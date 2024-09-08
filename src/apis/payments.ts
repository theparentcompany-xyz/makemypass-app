import { Dispatch, SetStateAction } from 'react';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import type { PaymentAnalyticsType } from '../pages/app/PaymentAnalytics/types';

export const getEventPaymentLog = async (
  setPaymentAnalyticsList: Dispatch<SetStateAction<PaymentAnalyticsType[]>>,
) => {
  const eventId = JSON.parse(sessionStorage.getItem('eventData')!).event_id;
  privateGateway.get(makeMyPass.paymentLog(eventId)).then((response) => {
    setPaymentAnalyticsList(response.data.response);
  });
};

export const getPaymentAnalyticsCSV = async () => {
  const eventId = JSON.parse(sessionStorage.getItem('eventData')!).event_id;
  return privateGateway.get(makeMyPass.paymentLogCSV(eventId)).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'payment_analytics.csv');
    document.body.appendChild(link);
    link.click();
  });
};
