import { useEffect, useState } from 'react';
import Theme from '../../../components/Theme/Theme';
import styles from './PaymentAnalytics.module.css';
import { getPaymentAnalytics, getPaymentAnalyticsCSV } from '../../../apis/payments';
import EventHeader from '../../../components/EventHeader/EventHeader';
import { PaymentAnalyticsType } from './types';
import GenericTable from '../../../components/Table/GenericTable';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';

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
          <GenericTable
            tableData={paymentAnalyticsList}
            tableHeading='Payment Logs'
            secondaryButton={
              <SecondaryButton
                onClick={() => {
                  getPaymentAnalyticsCSV(eventId);
                }}
                buttonText='Download CSV'
              />
            }
          />
        </div>
      </Theme>
    </>
  );
};

export default PaymentAnalytics;
