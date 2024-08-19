import toast from 'react-hot-toast';
import { privateGateway, publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import {
  AudioControlsType,
  CouponData,
  DiscountData,
  Tickets,
  SuccessModalProps,
  ClaimCodeExceedType,
} from '../pages/app/EventPage/types';
import React, { Dispatch, SetStateAction } from 'react';
import { ErrorMessages, EventType, FormDataType, RazorpayPaymentDetails } from './types';
import { convertWebmToWav } from './helpers';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export const submitForm = async ({
  eventId,
  isCouponFirst,
  tickets,
  formData,
  coupon,
  setSuccess,
  setFormNumber,
  setFormData,
  setFormErrors,
  response,

  setEventData,
  eventTitle,
  selectedDate,
  setDiscount,
  setLoading,
  setCoupon,
  ticketCode,
}: {
  eventId: string;
  isCouponFirst?: boolean;
  tickets: Tickets[];
  formData: FormDataType;
  coupon: CouponData;
  setSuccess?: React.Dispatch<React.SetStateAction<SuccessModalProps>>;
  setFormNumber?: React.Dispatch<React.SetStateAction<number>>;
  setFormData?: React.Dispatch<React.SetStateAction<FormDataType>>;
  setFormErrors?: Dispatch<ErrorMessages>;
  response?: unknown;

  setEventData?: React.Dispatch<React.SetStateAction<EventType | undefined>>;
  eventTitle?: string;
  selectedDate?: string | null;
  setDiscount?: React.Dispatch<DiscountData>;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setCoupon?: React.Dispatch<React.SetStateAction<CouponData>>;
  ticketCode?: string | null;
}) => {
  setLoading && setLoading(true);
  const selectedDateFormatted = selectedDate
    ? new Date(selectedDate).toISOString().split('T')[0]
    : null;

  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  document.body.appendChild(script);

  const backendFormData = new FormData();

  //Trim the formData to remove spaces
  Object.keys(formData).forEach((key) => {
    if (typeof formData[key] === 'string') {
      formData[key] = formData[key].toString().trim();
    }
  });

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
  if (ticketCode) backendFormData.append('ticket_code', ticketCode);

  publicGateway
    .post(makeMyPass.formSubmit(eventId), backendFormData, {
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
            const audio = new Audio('/sounds/gpay.mp3');
            audio.play();
            setSuccess &&
              setSuccess((prev) => ({
                ...prev,
                showModal: true,
                loading: true,
              }));
            publicGateway
              .post(makeMyPass.formValidatePayment, {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
              })
              .then((response) => {
                setSuccess &&
                  setSuccess((prev) => ({
                    ...prev,
                    ticketURL: response.data.response.ticket_url,
                    followupMessage: response.data.response.followup_msg,
                    eventRegisterId: response.data.response.event_register_id,
                    loading: false,
                    redirection: response.data.response.redirection,
                  }));

                if (isCouponFirst && setFormNumber) setFormNumber(1);
                else if (setFormNumber) setFormNumber(0);

                setFormData && setFormData({});
                setDiscount &&
                  setDiscount({ discount_value: 0, discount_type: 'error', ticket: [] });

                if (setEventData && eventTitle) getEventInfo(eventTitle, setEventData);
              })
              .catch((error) => {
                toast.error(
                  error.response.data.message.general[0] || 'Error in Validating Payment',
                );
                setSuccess &&
                  setSuccess((prev) => ({
                    ...prev,
                    showModal: false,
                    loading: false,
                  }));
              })
              .finally(() => {
                setLoading && setLoading(false);
              });
          },
          theme: {
            color: '#00FF82',
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        setSuccess &&
          setSuccess((prev) => ({
            ...prev,
            showModal: true,
            ticketURL: response.data.response.ticket_url,
            followupMessage: response.data.response.followup_msg,
            eventRegisterId: response.data.response.event_register_id,
            loading: false,
            redirection: response.data.response.redirection,
          }));
        if (isCouponFirst && setFormNumber) setFormNumber(1);
        else if (setFormNumber) setFormNumber(0);
        setFormData && setFormData({});
        setDiscount && setDiscount({ discount_value: 0, discount_type: 'error', ticket: [] });
      }
    })
    .catch((error) => {
      if (error.response.data.message['coupon_key']) {
        setCoupon &&
          setCoupon({
            ...coupon,
            error: error.response.data.message['coupon_key'][0],
          });
      }

      if (setFormErrors && error.response.data.message) setFormErrors(error.response.data.message);
      if (error.response.data.message.general[0])
        toast.error(error.response.data.message.general[0]);
    })
    .finally(() => {
      setLoading && setLoading(false);
    });
};

export const validateFormCoupon = async (
  eventId: string,
  couponData: CouponData,
  setDiscount: React.Dispatch<DiscountData>,
  setCoupon: React.Dispatch<CouponData>,
) => {
  if (couponData.value)
    publicGateway
      .post(makeMyPass.formValidateCoupon(eventId, couponData.value))
      .then((response) => {
        setDiscount(response.data.response);
      })
      .catch(() => {
        //TODO: check status code and show error message accordingly
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

export const validateRSVPData = (
  eventId: string,
  isCouponFirst: boolean | undefined,
  formData: FormDataType,
  setFormNumber: React.Dispatch<React.SetStateAction<number>>,
  setFieldErrors: Dispatch<React.SetStateAction<ErrorMessages>>,
  selectedDate?: string | null,
) => {
  return new Promise<void>((resolve, reject) => {
    const selectedDateFormatted = selectedDate
      ? new Date(selectedDate).toISOString().split('T')[0]
      : null;

    //Trim the formData to remove spaces
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === 'string') {
        formData[key] = formData[key].toString().trim();
      }
    });

    // Remove empty key-value pairs from formData
    Object.keys(formData).forEach((key) => {
      if (formData[key] === '') {
        delete formData[key];
      }
    });

    const payloadFormData: FormData = new FormData();

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

    publicGateway
      .post(makeMyPass.formValidateRSVP(eventId), payloadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        if (!isCouponFirst) setFormNumber(1);
        resolve();
      })
      .catch((error) => {
        setFieldErrors(error.response.data.message);
        reject(error);
      });
  });
};

export const getEventInfo = async (
  eventTitle: string,
  setEventData: Dispatch<React.SetStateAction<EventType | undefined>>,
  setEventNotFound?: Dispatch<React.SetStateAction<boolean>>,
  claimCode?: string | null,
  setClaimCodeExceed?: React.Dispatch<React.SetStateAction<ClaimCodeExceedType>>,
  setSuccess?: React.Dispatch<React.SetStateAction<SuccessModalProps>>,
) => {
  let backendURL = makeMyPass.formEventInfo(eventTitle);
  if (claimCode) backendURL += `?claim_code=${claimCode}`;
  privateGateway
    .get(backendURL)
    .then((response) => {
      setEventData(response.data.response);
      setSuccess &&
        setSuccess((prev) => ({
          ...prev,
          eventTitle: response.data.response.title,
          eventId: response.data.response.id,
          loading: false,
        }));
      sessionStorage.setItem('eventId', response.data.response.id);

      const eventData = {
        title: response.data.response.title,
        current_user_role: response.data.response.current_user_role,
        event_name: response.data.response.name,
        logo: response.data.response.logo,
        event_id: response.data.response.id,
      };
      sessionStorage.setItem('eventData', JSON.stringify(eventData));

      if (response.data.response.claim_code_message) {
        setClaimCodeExceed &&
          setClaimCodeExceed({
            exceeded: true,
            message: response.data.response.claim_code_message,
          });
      }
    })
    .catch((error) => {
      if (error.response.data.statusCode === 404) setEventNotFound && setEventNotFound(true);
    });
};

export const parseAudio = async (
  eventId: string,
  recordedBlob: Blob,
  formData: FormDataType,
  setFormData: React.Dispatch<FormDataType>,
  setShowAudioModal: React.Dispatch<AudioControlsType>,
) => {
  setShowAudioModal({
    showModal: true,
    transcribing: true,
    noData: false,
  });
  const form = new FormData();
  const file = new File([await convertWebmToWav(recordedBlob)], 'recorded.mp3', {
    type: 'audio/mp3',
  });
  form.append('file', file);
  form.append('previous_form', JSON.stringify(formData));
  publicGateway
    .post(makeMyPass.formParseFromAudio(eventId), form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      const newFormData: FormDataType = { ...formData, ...response?.data?.response?.data };
      setFormData(newFormData);

      if (Object.keys(response?.data?.response?.data).length === 0) {
        setShowAudioModal({
          showModal: true,
          transcribing: false,
          noData: true,
        });
      } else {
        setShowAudioModal({
          showModal: false,
          transcribing: false,
          noData: false,
        });
      }
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Transcribing Audio');
      setShowAudioModal({
        showModal: true,
        transcribing: false,
        noData: true,
      });
    });
};

export const sendVerfication = async (contactType: string, contactInfo: string) => {
  const eventId = sessionStorage.getItem('eventId');
  if (!eventId) return;
  publicGateway
    .post(makeMyPass.formSendVerfication(eventId), {
      contact_type: contactType,
      contact_info: contactInfo,
    })
    .then(() => {
      toast.success('Verification Email Sent');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0]);
    });
};

export const claimScratchCard = async (
  eventRegisterId: string,
  setScratchCard: Dispatch<SetStateAction<{ name: string; image: string; isFetching: boolean }>>,
) => {
  setScratchCard({
    name: '',
    image: '',
    isFetching: true,
  });
  if (!sessionStorage.getItem('eventId')) {
    toast.error('Event Id not found');
    return;
  }
  publicGateway
    .post(makeMyPass.scratchCardClaim(sessionStorage.getItem('eventId') ?? '', eventRegisterId))
    .then((response) => {
      setScratchCard({
        name: response.data.response.name,
        image: response.data.response.image,
        isFetching: false,
      });
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0]);
      setScratchCard({
        name: '',
        image: '',
        isFetching: false,
      });
    });
};
