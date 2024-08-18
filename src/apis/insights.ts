import toast from 'react-hot-toast';
import { publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { Dispatch, SetStateAction } from 'react';

export const getInsightsVisibility = (
  id: string,
  setVisibility: Dispatch<SetStateAction<boolean>>,
) => {
  publicGateway
    .get(makeMyPass.getAnalyticsVisibility(id))
    .then((response) => {
      setVisibility(response.data.response.public);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Visibility Data');
    });
};
