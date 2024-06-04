import toast from 'react-hot-toast';
import { privateGateway, publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { CouponData, DiscountData, TicketOptions, Tickets } from '../pages/app/EventPage/types';
import { Dispatch } from 'react';
import {
  ErrorMessages,
  EventType,
  FormDataType,
  FormFieldType,
  RazorpayPaymentDetails,
} from './types';
import { convertWebmToWav } from './helpers';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export const submitForm = async ({
  eventId,
  tickets,
  formData,
  coupon,
  setSuccess,
  setFormNumber,
  setFormData,
  setAmount,
  setFormErrors,
  response,
  setCoupon,
  setEventData,
  eventTitle,
  selectedDate,
  setDiscount,
}: {
  eventId: string;
  tickets: Tickets[];
  formData: FormDataType;
  coupon: CouponData;
  setSuccess?: React.Dispatch<React.SetStateAction<string>>;
  setFormNumber?: React.Dispatch<React.SetStateAction<number>>;
  setFormData?: React.Dispatch<React.SetStateAction<FormDataType>>;
  setAmount?: React.Dispatch<React.SetStateAction<string>>;
  setFormErrors?: Dispatch<ErrorMessages>;
  response?: unknown;
  setCoupon?: React.Dispatch<CouponData>;
  setEventData?: React.Dispatch<React.SetStateAction<EventType | undefined>>;
  eventTitle?: string;
  selectedDate?: string | null;
  setDiscount?: React.Dispatch<DiscountData>;
}) => {
  const selectedDateFormatted = selectedDate
    ? new Date(selectedDate).toISOString().split('T')[0]
    : null;

  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  document.body.appendChild(script);

  const backendFormData = new FormData();

  Object.keys(formData).forEach((key) => {
    let value = formData[key];

    if (!(value instanceof FileList)) {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((value) => backendFormData.append(key + '[]', value));
      } else {
        value = formData[key].toString();
      }
    }

    if (typeof value === 'string' && value.length > 0) {
      backendFormData.append(key, value);
    } else if (value instanceof FileList) {
      Array.from(value).forEach((value) => backendFormData.append(key + '[]', value));
    }
  });

  if (response) backendFormData.append('payment_data', JSON.stringify(response));
  if (coupon.value) backendFormData.append('coupon_code', coupon.value?.toString());
  tickets.forEach((ticket: Tickets) => backendFormData.append('tickets[]', JSON.stringify(ticket)));
  if (selectedDateFormatted) backendFormData.append('ticket_date', selectedDateFormatted);

  publicGateway
    .post(makeMyPass.submitForm(eventId), backendFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      if (response.data.response.gateway_type) {
        const paymentId: string = response.data.response.id;
        const paymentAmount: string = response.data.response.amount;

        const options = {
          key_id: response.data.response.gateway_key,
          amount: paymentAmount,
          currency: response.data.response.currency,
          name: 'MakeMyPass',
          description: 'Event Registration',
          image: '/pwa/maskable.webp',
          order_id: paymentId,
          handler: function (response: RazorpayPaymentDetails) {
            console.log(response);

            const audio = new Audio('/sounds/gpay.mp3');
            audio.play();

            publicGateway
              .post(makeMyPass.validatePayment, {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
              })
              .then((response) => {
                setSuccess && setSuccess(response.data.response.code || 'Will be Informed Later');

                if (response.data.response.ticket_url) {
                  const link = document.createElement('a');
                  link.href = response.data.response.ticket_url;
                  link.download = `Event Pass.png`;
                  document.body.appendChild(link);
                  link.click();
                }

                setTimeout(() => {
                  setSuccess && setSuccess('');
                  setFormNumber && setFormNumber(0);
                  setFormData && setFormData({});
                  setAmount && setAmount('');
                  setDiscount &&
                    setDiscount({ discount_value: 0, discount_type: 'error', ticket: [] });
                  if (setEventData && eventTitle) getEventInfo(eventTitle, setEventData);
                }, 5000);

                setCoupon && setCoupon({ status: '', description: '' });
              })
              .catch((error) => {
                toast.error(
                  error.response.data.message.general[0] || 'Error in Validating Payment',
                );
              });
          },
          theme: {
            color: '#00FF82',
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        setSuccess && setSuccess(response.data.response.code || 'Will be Informed Later');

        setTimeout(() => {
          setSuccess && setSuccess('');
          setFormNumber && setFormNumber(0);
          setFormData && setFormData({});
          setDiscount && setDiscount({ discount_value: 0, discount_type: 'error', ticket: [] });
          setAmount && setAmount('');
        }, 5000);

        setCoupon && setCoupon({ status: '', description: '' });
      }
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Registering Event');
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
      .catch(() => {
        setCoupon({
          ...couponData,
          value: '',
          error: 'Invalid Coupon Code',
        });
        setDiscount({
          discount_value: 0,
          discount_type: 'error',
          ticket: [],
        });
      });
};

export const validateRsvp = async (
  eventId: string,
  formData: FormDataType,
  setFormNumber: React.Dispatch<React.SetStateAction<number>>,
  setFieldErrors: Dispatch<React.SetStateAction<ErrorMessages>>,
  selectedDate?: string | null,
) => {
  const selectedDateFormatted = selectedDate
    ? new Date(selectedDate).toISOString().split('T')[0]
    : null;

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
      } else {
        value = formData[key].toString();
      }
    }

    if (typeof value === 'string' && value.length > 0) {
      payloadFormData.append(key, value);
    } else if (value instanceof FileList) {
      Array.from(value).forEach((value) => payloadFormData.append(key + '[]', value));
    }
  });

  if (selectedDateFormatted) payloadFormData.append('ticket_date', selectedDateFormatted);

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
  eventTitle: string,
  setEventData: Dispatch<React.SetStateAction<EventType | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.getEventInfo(eventTitle))
    .then((response) => {
      setEventData(response.data.response);
      console.log('API Response', response.data.response.tickets);
      // return response.data.response;
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Event Info');
    });
};

export const getTickets = async (
  eventId: string,
  setTicketInfo: React.Dispatch<React.SetStateAction<TicketOptions | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.getTicketInfo(eventId))
    .then((response) => {
      setTicketInfo(response.data.response.tickets);
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
      setFormFields(response.data.response.form_fields);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Form Fields');
    });
};

export const postAudio = async (eventId: string, recordedBlob: Blob) => {
  const form = new FormData();
  const file = new File([await convertWebmToWav(recordedBlob)], 'recorded.mp3', {
    type: 'audio/mp3',
  });
  form.append('file', file);
  publicGateway
    .post(makeMyPass.parseFromAudio(eventId), form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .catch((error) => {
      console.error(error.response.data.message.general[0]);
    });
};
