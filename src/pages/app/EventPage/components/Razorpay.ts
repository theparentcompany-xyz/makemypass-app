import { publicGateway } from '../../../../../services/apiGateway';
import { makeMyPass } from '../../../../../services/urls';
import { submitForm } from '../../../../apis/publicpage';

export const showRazorpay = async (
  ticketId: string,
  formData: any,
  setFormErrors: any,
  setSuccess: React.Dispatch<React.SetStateAction<string>>,
  setFormNumber: React.Dispatch<React.SetStateAction<number>>,
  setFormData: React.Dispatch<React.SetStateAction<any>>,
  setAmount: React.Dispatch<React.SetStateAction<string>>,
) => {
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  document.body.appendChild(script);

  let paymentId: string = '';
  let paymentAmount: string = '';

  await publicGateway
    .post(makeMyPass.createPayment(ticketId), formData)
    .then((response) => {
      paymentId = response.data.response.id;
      paymentAmount = response.data.response.amount;
    })
    .catch((err) => {
      setFormErrors(err.response.data.message);
    });

  var options = {
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
        ticketId,
        formData,
        setSuccess,
        setFormNumber,
        setFormData,
        setAmount,
        response,
      });
    },
    theme: {
      color: '#00FF82',
    },
  };

  var rzp1 = new (window as any).Razorpay(options);
  rzp1.open();
};
