import { useEffect, useState } from 'react';
import styles from './Razorpay.module.css';
import { publicGateway } from '../../../../../services/apiGateway';
import { makeMyPass } from '../../../../../services/urls';

const Razorpay = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
  }, []);

  const handlePaymentSuccess = async (response: any) => {
    try {
      let bodyData = new FormData();

      // we will send the response we've got from razorpay to the backend to validate the payment
      bodyData.append('response', JSON.stringify(response));

      publicGateway
        .post('/success', bodyData)
        .then(() => {
          console.log('Everything is OK!');
          setName('');
          setAmount('');
        })
        .catch((err) => {
          console.log(err);
        });
    } catch {
      console.log('Error');
    }
  };

  const showRazorpay = async () => {
    let paymentId: string = '';
    let paymentAmount: string = '';
    await publicGateway
      .post(makeMyPass.createPayment, {
        amount: amount,
        name: name,
      })
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
        // handlePaymentSuccess(response);
      },
      theme: {
        color: '#3399cc',
      },
    };

    var rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
  };

  return (
    <>
      <div className={styles.razorPayContainer}>
        <div className='container' style={{ marginTop: '20vh' }}>
          <form>
            <h1>Payment page</h1>

            <div className='form-group'>
              <label htmlFor='name'>Product name</label>
              <input
                type='text'
                className='form-control'
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='exampleInputPassword1'>Amount</label>
              <input
                type='text'
                className='form-control'
                id='amount'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </form>
          <button
            onClick={() => {
              showRazorpay();
            }}
            className='btn btn-primary btn-block'
          >
            Pay with razorpay
          </button>
        </div>
      </div>
    </>
  );
};

export default Razorpay;
