import { useEffect, useState } from 'react';
import Theme from '../../../components/Theme/Theme';
import { getEventPaymentLog, getPaymentAnalyticsCSV } from '../../../apis/payments';
import { PaymentAnalyticsType } from './types';
import GenericTable from '../../../components/Table/GenericTable';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';

const PaymentAnalytics = () => {
  const [paymentAnalyticsList, setPaymentAnalyticsList] = useState<PaymentAnalyticsType[]>([]);
  useEffect(() => {
    getEventPaymentLog(setPaymentAnalyticsList);
  }, []);

  useEffect;

  return (
    <Theme>
      <DashboardLayout prevPage='-1'>
        <GenericTable
          tableData={paymentAnalyticsList}
          tableHeading='Payment Logs'
          secondaryButton={
            <SecondaryButton
              onClick={() => {
                getPaymentAnalyticsCSV();
              }}
              buttonText='Download CSV'
            />
          }
        />
      </DashboardLayout>
    </Theme>
  );
};

export default PaymentAnalytics;
