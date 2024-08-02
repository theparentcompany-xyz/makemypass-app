import { useEffect, useState } from 'react';
import Theme from '../../../components/Theme/Theme';
import styles from './PaymentAnalytics.module.css';
import { getPaymentAnalytics } from '../../../apis/payments';
import EventHeader from '../../../components/EventHeader/EventHeader';
import { PaymentAnalyticsType } from './types';
import GenericTable from '../../../components/Table/GenericTable';

const PaymentAnalytics = () => {
  const eventId = JSON.parse(sessionStorage.getItem('eventData')!).event_id;
  const [paymentAnalyticsList, setPaymentAnalyticsList] = useState<PaymentAnalyticsType[]>([]);
  useEffect(() => {
    getPaymentAnalytics(eventId, setPaymentAnalyticsList);
  }, []);

  useEffect;

  return (
    <>
      <Theme>
        <div className={styles.paymentAnalyticsContainer}>
          <EventHeader previousPageNavigate='/events' />
          <GenericTable tableData={paymentAnalyticsList} tableHeading='Payment Logs' />
        </div>
      </Theme>
    </>
  );
};

export default PaymentAnalytics;
