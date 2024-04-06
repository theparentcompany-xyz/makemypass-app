import toast from 'react-hot-toast';
import { privateGateway, publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { CouponData, DiscountData, TicketOptions } from '../pages/app/EventPage/types';
import { Dispatch } from 'react';
import { ErrorMessages, EventDetails, EventType, FormDataType, FormFieldType } from './types';
import { convertWebmToWav } from './helpers';

export const submitForm = async ({
  eventId,
  ticketIds,
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
  eventId: string;
  ticketIds: string[];
  formData: FormDataType;
  coupon: CouponData;
  setSuccess?: React.Dispatch<React.SetStateAction<string>>;
  setFormNumber?: React.Dispatch<React.SetStateAction<number>>;
  setFormData?: React.Dispatch<React.SetStateAction<FormDataType>>;
  setAmount?: React.Dispatch<React.SetStateAction<string>>;
  setFormErrors?: Dispatch<ErrorMessages>;
  response?: unknown;
  setCoupon?: React.Dispatch<CouponData>;
}) => {
  const backendFormData = new FormData();

  Object.keys(formData).forEach((key) => {
    let value = formData[key];

    if (!(value instanceof FileList)) {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((value) => backendFormData.append(key + '[]', value));
      }
      else {
        value = formData[key].toString()
      }
    }


    if (typeof value === 'string' && value.length > 0) {
      backendFormData.append(key, value);
    }
    else if (value instanceof FileList) {
      Array.from(value).forEach((value) => backendFormData.append(key + '[]', value));
    }
  });

  if (response) backendFormData.append('payment_data', JSON.stringify(response));
  if (coupon.value) backendFormData.append('coupon_code', coupon.value?.toString());
  ticketIds.forEach((ticketId) => backendFormData.append('tickets[]', ticketId));

  publicGateway
    .post(makeMyPass.submitForm(eventId), backendFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      setSuccess && setSuccess(response.data.response.code);

      setTimeout(() => {
        setSuccess && setSuccess('');
        setFormNumber && setFormNumber(0);
        setFormData && setFormData({});
        setAmount && setAmount('');
      }, 4000);

      setCoupon && setCoupon({ coupon: '', description: '' });
    })
    .catch((error) => {
      toast.error('Error in Registering Event');
      if (setFormErrors) setFormErrors(error.response.data.message);
    });
};

export const applyCoupon = async (
  eventId: string,
  couponData: CouponData,
  setDiscount: React.Dispatch<DiscountData>,
  setCoupon: React.Dispatch<CouponData>,
) => {
  if (couponData.value)
    publicGateway
      .post(makeMyPass.validateCoupon(eventId, couponData.value))
      .then((response) => {
        setDiscount(response.data.response);
      })
      .catch((error) => {
        setCoupon({
          ...couponData,
          error: error.response.data.message.general[0] || 'Invalid Coupon',
        });
        setDiscount({
          discount_value: 0,
          discount_type: 'error',
        });
      });
};

export const validateRsvp = async (
  eventId: string,
  formData: FormDataType,
  setFormNumber: React.Dispatch<React.SetStateAction<number>>,
  setFieldErrors: Dispatch<React.SetStateAction<ErrorMessages>>,
) => {
  // Remove empty key-value pairs from formData
  Object.keys(formData).forEach((key) => {
    if (formData[key] === '') {
      delete formData[key];
    }
  });


  const payloadFormData = new FormData();

  Object.keys(formData).forEach((key) => {
    let value = formData[key];

    if (!(value instanceof FileList)) {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((value) => payloadFormData.append(key + '[]', value));
      }
      else {
        value = formData[key].toString()
      }
    }

    if (typeof value === 'string' && value.length > 0) {
      payloadFormData.append(key, value);
    }
    else if (value instanceof FileList) {
      Array.from(value).forEach((value) => payloadFormData.append(key + '[]', value));
    }
  });


  return publicGateway
    .post(makeMyPass.validateRsvp(eventId), payloadFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => {
      setFormNumber(1);
    })
    .catch((error) => {
      setFieldErrors(error.response.data.message);
    });
};

export const getEventInfo = async (
  eventId: string,
  setEventData: Dispatch<React.SetStateAction<EventType | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.getEventInfo(eventId))
    .then((response) => {
      setEventData(response.data.response);
      return response.data.response;
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Event Info');
    });
};

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
  setFormFields: Dispatch<React.SetStateAction<FormFieldType[]>>,
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

export const getEventDatas = async (
  eventId: string,
  setEventData?: Dispatch<React.SetStateAction<EventDetails | undefined>>,
) => {
  return publicGateway
    .get(makeMyPass.getEventDatas(eventId))
    .then((response) => {
      if (setEventData) setEventData(response.data.response);

      const eventData = JSON.parse(localStorage.getItem('eventData') || '{}');
      eventData['logo'] = response.data.response['logo'];
      eventData['is_private'] = response.data.response['is_private'];
      localStorage.setItem('eventData', JSON.stringify(eventData));
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Event Data');
    });
};


export const postAudio = async (eventId: string, recordedBlob: Blob) => {
  const form = new FormData();
  const file = new File([await convertWebmToWav(recordedBlob)], 'recorded.mp3', { type: 'audio/mp3' });
  form.append('file', file);
  publicGateway
    .post(makeMyPass.parseFromAudio(eventId), form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error.response.data.message.general[0]);
    });
}

