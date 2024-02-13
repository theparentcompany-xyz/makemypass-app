import { publicGateway } from '../../../../../services/apiGateway';
import { makeMyPass } from '../../../../../services/urls';
import { submitForm } from '../../../../apis/publicpage';

export const showRazorpay = async (name: any, ticketId: any, formData: any) => {
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
      console.log(err);
    });

  var options = {
    key_id: import.meta.env.VITE_APP_PUBLIC_KEY,
    key_secret: import.meta.env.VITE_APP_SECRET_KEY,
    amount: paymentAmount,
    currency: 'INR',
    name: name,
    description: 'Test Transactions',
    image: '', // add image url
    order_id: paymentId,
    handler: function (response: any) {
      console.log('paymentResponse', response);
      submitForm(ticketId, formData, response);
    },
    theme: {
      color: '#3399cc',
    },
  };

  var rzp1 = new (window as any).Razorpay(options);
  rzp1.open();
};