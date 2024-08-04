import { Dispatch, SetStateAction } from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { PaymentAnalyticsType } from '../pages/app/PaymentAnalytics/types';

export const getPaymentAnalytics = async (
  event_id: string,
  setPaymentAnalyticsList: Dispatch<SetStateAction<PaymentAnalyticsType[]>>,
) => {
  privateGateway.get(makeMyPass.getPaymentAnalytics(event_id)).then((response) => {
    setPaymentAnalyticsList(response.data.response);
  });
};

export const getPaymentAnalyticsCSV = async (event_id: string) => {
  return privateGateway.get(makeMyPass.getPaymentAnalyticsCSV(event_id)).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'payment_analytics.csv');
    document.body.appendChild(link);
    link.click();
  });
};
