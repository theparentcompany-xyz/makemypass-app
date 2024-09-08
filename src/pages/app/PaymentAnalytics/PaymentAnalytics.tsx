import { useEffect, useState } from 'react';

import { getEventPaymentLog, getPaymentAnalyticsCSV } from '../../../apis/payments';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import GenericTable from '../../../components/Table/GenericTable';
import Theme from '../../../components/Theme/Theme';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import type { PaymentAnalyticsType } from './types';

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
