import toast from 'react-hot-toast';
import { publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { DiscountData, TicketOptions } from '../pages/app/EventPage/types';
import { Dispatch } from 'react';
import { FormData, FormField } from './types';

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

export const submitForm = async (
  ticketId: string,
  data: FormData,
  setSuccess?: React.Dispatch<React.SetStateAction<string>>,
  setFormNumber?: React.Dispatch<React.SetStateAction<number>>,
  setFormData?: React.Dispatch<React.SetStateAction<FormData>>,
  setAmount?: React.Dispatch<React.SetStateAction<string>>,
  response?: any,
) => {
  console.log(data);
  publicGateway
    .post(makeMyPass.submitForm(ticketId), {
      rsvp_data: data,
      payment_data: response,
    })
    .then((response) => {
      setSuccess && setSuccess(response.data.response.code);

      setTimeout(() => {
        setSuccess && setSuccess('');
        setFormNumber && setFormNumber(0);
        setFormData && setFormData({});
        setAmount && setAmount('');
      }, 3000);
    })
    .catch(() => {
      toast.error('Error in Registering Event');
    });
};

export const applyCoupon = async (
  eventId: string,
  couponCode: string,
  setDiscount: React.Dispatch<DiscountData>,
) => {
  publicGateway
    .post(makeMyPass.validateCoupon(eventId), {
      coupon_code: couponCode,
    })
    .then((response) => {
      setDiscount(response.data.response);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const registerUpdateView = async (eventId: string) => {
  return publicGateway
    .post(makeMyPass.registerUpdateView(eventId))
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const validateRsvp = async (
  ticketId: string,
  formData: FormData,
  setFormNumber: React.Dispatch<React.SetStateAction<number>>,
  setFieldErrors: Dispatch<React.SetStateAction<any>>,
) => {
  return publicGateway
    .post(makeMyPass.validateRsvp(ticketId), formData)
    .then(() => {
      setFormNumber(1);
    })
    .catch((error) => {
      setFieldErrors(error.response.data.message);
    });
};

export const getEventDatas = async (eventId: string, setEventData: any) => {
  return publicGateway
    .get(makeMyPass.getEventDatas(eventId))
    .then((response) => {
      setEventData(response.data.response);
    })
    .catch((error) => {
      console.log(error);
    });
};
