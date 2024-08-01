import { useEffect } from 'react';
import Theme from '../../../components/Theme/Theme';
import styles from './PaymentAnalytics.module.css';
import { getPaymentAnalytics } from '../../../apis/payments';

const PaymentAnalytics = () => {
  const eventId = JSON.parse(sessionStorage.getItem('eventData')!).event_id;
  useEffect(() => {
    getPaymentAnalytics(eventId);
  });
  return (
    <>
      <Theme>
        <div className={styles.paymentAnalyticsContainer}></div>
      </Theme>
    </>
  );
};

export default PaymentAnalytics;
