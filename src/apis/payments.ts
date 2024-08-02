import { Dispatch, SetStateAction } from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { PaymentAnalyticsType } from '../pages/app/PaymentAnalytics/types';

export const getPaymentAnalytics = async (
  event_id: string,
  setPaymentAnalyticsList: Dispatch<SetStateAction<PaymentAnalyticsType[]>>,
) => {
  privateGateway
    .get(makeMyPass.getPaymentAnalytics(event_id))
    .then((response) => {
      console.log(response.data);
      setPaymentAnalyticsList(response.data.response);
    })
    .catch((error) => {
      console.log(error);
    });
};
