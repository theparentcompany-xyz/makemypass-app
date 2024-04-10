import { publicGateway } from '../../../../../services/apiGateway';
import { makeMyPass } from '../../../../../services/urls';
import { submitForm } from '../../../../apis/publicpage';
import { CouponData } from '../types';

export const showRazorpay = async (
  eventId: string,
  ticketIds: string[],
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

  ticketIds.forEach((ticketId) => {
    backendFormData.append('tickets[]', ticketId);
  });

  Object.keys(formData).forEach((key) => {
    let value = formData[key];

    if (!(value instanceof FileList))
      if (Array.isArray(formData[key])) {
        formData[key].forEach((value: string) => backendFormData.append(key + '[]', value));
      } else {
        value = formData[key];
      }

    if (typeof value === 'string' && value.length > 0) backendFormData.append(key, value);
    else if (value instanceof FileList) {
      Array.from(value).forEach((value) => backendFormData.append(key + '[]', value));
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
    image: '/pwa/maskable.webp',
    order_id: paymentId,
    handler: function (response: any) {
      const audio = new Audio('/sounds/gpay.mp3');
      audio.play();
      submitForm({
        eventId,
        ticketIds,
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
