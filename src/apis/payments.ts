import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';

export const getPaymentAnalytics = async (event_id: string) => {
  privateGateway
    .get(makeMyPass.getPaymentAnalytics(event_id))
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
