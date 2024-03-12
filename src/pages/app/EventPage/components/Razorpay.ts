import { publicGateway } from '../../../../../services/apiGateway';
import { makeMyPass } from '../../../../../services/urls';
import { submitForm } from '../../../../apis/publicpage';
import { CouponData } from '../types';

export const showRazorpay = async (
  eventId: string,
  ticketId: string,
  formData: any,
  coupon: CouponData,
  setFormErrors: any,
  setSuccess: React.Dispatch<React.SetStateAction<string>>,
  setFormNumber: React.Dispatch<React.SetStateAction<number>>,
  setFormData: React.Dispatch<React.SetStateAction<any>>,
  setAmount: React.Dispatch<React.SetStateAction<string>>,
  setCoupon: React.Dispatch<CouponData>,
) => {
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  document.body.appendChild(script);

  let paymentId: string = '';
  let paymentAmount: string = '';

  const backendFormData = new FormData();
  backendFormData.append('tickets', JSON.stringify([ticketId]));
  Object.keys(formData).forEach((key) => {
    if (formData[key]) {
      backendFormData.append(key, formData[key]);
    }
  });

  await publicGateway
    .post(makeMyPass.createPayment(eventId), backendFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      paymentId = response.data.response.id;
      paymentAmount = response.data.response.amount;
    })
    .catch((err) => {
      setFormErrors(err.response.data.message);
    });

  const options = {
    key_id: import.meta.env.VITE_APP_PUBLIC_KEY,
    amount: paymentAmount,
    currency: 'INR',
    name: 'MakeMyPass',
    description: 'Event Registration',
    image: '/maskable.webp',
    order_id: paymentId,
    handler: function (response: any) {
      const audio = new Audio('/gpay.mp3');
      audio.play();
      submitForm({
        eventId,
        ticketId,
        formData,
        coupon,
        setSuccess,
        setFormNumber,
        setFormData,
        setAmount,
        response,
        setCoupon,
      });
    },
    theme: {
      color: '#00FF82',
    },
  };

  const rzp1 = new (window as any).Razorpay(options);
  rzp1.open();
};
