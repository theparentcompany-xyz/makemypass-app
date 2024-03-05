import toast from 'react-hot-toast';
import { publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { CouponData, DiscountData, TicketOptions } from '../pages/app/EventPage/types';
import { Dispatch } from 'react';
import { ErrorMessages, EventDetails, EventHosts, FormData, FormField } from './types';
import { isArray } from 'chart.js/helpers';

export const getTickets = async (
  eventId: string,
  setTicketInfo: React.Dispatch<React.SetStateAction<TicketOptions | undefined>>,
) => {
  publicGateway
    .get(makeMyPass.getTicketInfo(eventId))
    .then((response) => {
      setTicketInfo(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Tickets');
    });
};

export const getFormFields = async (
  eventId: string,
  setFormFields: Dispatch<React.SetStateAction<FormField[]>>,
) => {
  publicGateway
    .get(makeMyPass.getFormFields(eventId))
    .then((response) => {
      setFormFields(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Form Fields');
    });
};

export const submitForm = async ({
  ticketId,
  formData,
  coupon,
  setSuccess,
  setFormNumber,
  setFormData,
  setAmount,
  setFormErrors,
  response,
  setCoupon,
}: {
  ticketId: string;
  formData: FormData;
  coupon: CouponData;
  setSuccess?: React.Dispatch<React.SetStateAction<string>>;
  setFormNumber?: React.Dispatch<React.SetStateAction<number>>;
  setFormData?: React.Dispatch<React.SetStateAction<FormData>>;
  setAmount?: React.Dispatch<React.SetStateAction<string>>;
  setFormErrors?: Dispatch<ErrorMessages>;
  response?: unknown;
  setCoupon?: React.Dispatch<CouponData>;
}) => {
  publicGateway
    .post(makeMyPass.submitForm(ticketId), {
      rsvp_data: formData,
      payment_data: response,
      coupon_code: coupon.value,
    })
    .then((response) => {
      setSuccess && setSuccess(response.data.response.code);

      setTimeout(() => {
        setSuccess && setSuccess('');
        setFormNumber && setFormNumber(0);
        setFormData && setFormData({});
        setAmount && setAmount('');
      }, 2000);

      setCoupon && setCoupon({ coupon: '', description: '' });
    })
    .catch((error) => {
      toast.error('Error in Registering Event');
      if (setFormErrors) setFormErrors(error.response.data.message);
    });
};

export const applyCoupon = async (
  eventId: string,
  couponCode: string | string[],
  setDiscount: React.Dispatch<DiscountData>,
  setCoupon: React.Dispatch<CouponData>,
) => {
  if (!isArray(couponCode))
    publicGateway
      .post(makeMyPass.validateCoupon(eventId, couponCode))
      .then((response) => {
        setDiscount(response.data.response);
      })
      .catch((error) => {
        setCoupon(error.response.data.message.coupon_key);
        setDiscount({
          discount_value: 0,
          discount_type: 'error',
        });
      });
};

export const registerUpdateView = async (eventId: string) => {
  return publicGateway.post(makeMyPass.registerUpdateView(eventId)).catch((error) => {
    console.log(error);
  });
};

export const validateRsvp = async (
  ticketId: string,
  formData: FormData,
  setFormNumber: React.Dispatch<React.SetStateAction<number>>,
  setFieldErrors: Dispatch<React.SetStateAction<ErrorMessages>>,
) => {
  // Remove empty key-value pairs from formData
  Object.keys(formData).forEach((key) => {
    if (formData[key] === '') {
      delete formData[key];
    }
  });

  return publicGateway
    .post(makeMyPass.validateRsvp(ticketId), formData)
    .then(() => {
      setFormNumber(1);
    })
    .catch((error) => {
      setFieldErrors(error.response.data.message);
    });
};

export const getEventDatas = async (
  eventId: string,
  setEventData?: Dispatch<React.SetStateAction<EventDetails | undefined>>,
) => {
  return publicGateway
    .get(makeMyPass.getEventDatas(eventId))
    .then((response) => {
      if (setEventData) setEventData(response.data.response);
      console.log(response.data.response);

      const eventData = JSON.parse(localStorage.getItem('eventData') || '{}');
      eventData['logo'] = response.data.response['logo'];
      eventData['is_private'] = response.data.response['is_private'];
      localStorage.setItem('eventData', JSON.stringify(eventData));
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Event Data');
    });
};

export const getEventHosts = async (
  eventId: string,
  setHosts?: Dispatch<React.SetStateAction<EventHosts[]>>,
) => {
  return publicGateway
    .get(makeMyPass.listHostedBy(eventId))
    .then((response) => {
      if (setHosts) setHosts(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Hosts');
    });
};

export const getCouponInfo = async (eventId: string, setCoupon: React.Dispatch<CouponData>) => {
  publicGateway
    .get(makeMyPass.getCouponInfo(eventId))
    .then((response) => {
      setCoupon(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Coupon Info');
    });
};
