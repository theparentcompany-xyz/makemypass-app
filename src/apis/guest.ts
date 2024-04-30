import toast from 'react-hot-toast';
import { privateGateway, publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { Dispatch } from 'react';
import { SelectedGuest } from '../pages/app/Guests/types';
import { ErrorMessages, FormDataType, PaymentDetails } from './types';

export const shortListUser = (
  eventId: string,
  userId: string,
  isShortListed: boolean,
  setSelectedGuestId: Dispatch<React.SetStateAction<SelectedGuest | null>>,
) => {
  privateGateway
    .post(makeMyPass.shortListUser(eventId, userId), {
      is_approved: isShortListed,
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'User shortlisted successfully');
      setSelectedGuestId(null);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'User shortlisting failed');
    });
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export const addGuest = (
  eventId: string,
  ticketId: string,
  formData: FormDataType,
  setFormErrors: Dispatch<React.SetStateAction<ErrorMessages>>,
  setSelectedGuestId: Dispatch<React.SetStateAction<SelectedGuest | null>>,
) => {
  formData['tickets[]'] = ticketId;

  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  document.body.appendChild(script);

  privateGateway
    .post(makeMyPass.sentInvite(eventId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      if (response.data.response.gateway_type) {
        toast.success('Complete Payment to add guest');
        const paymentId: string = response.data.response.id;
        const paymentAmount: string = response.data.response.amount;
        type RazorpayPaymentDetails = PaymentDetails<'razorpay'>;
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
                payment_signature: response.razorpay_signature,
              })
              .then(() => {
                setTimeout(() => {
                  setSelectedGuestId(null);
                  toast.success('Guest added successfully');
                }, 2000);
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
        toast.success(response.data.message.general[0] || 'Guest added successfully');
        setSelectedGuestId(null);
      }
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Guest adding failed');
      setFormErrors(error.response.data.message);
    });
};

export const downloadFormSubmission = (eventId: string) => {
  privateGateway
    .get(makeMyPass.downloadFormSubmission(eventId))
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `form-submission-${eventId}.csv`);
      document.body.appendChild(link);
      link.click();
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Form submission download failed');
    });
};
