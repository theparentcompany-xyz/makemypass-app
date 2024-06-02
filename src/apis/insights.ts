import toast from 'react-hot-toast';
import { privateGateway, publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { Dispatch, SetStateAction } from 'react';

export const getVisibility = (id: string, setVisibility: Dispatch<SetStateAction<boolean>>) => {
  privateGateway
    .get(makeMyPass.getAnalyticsVisibility(id))
    .then((response) => {
      setVisibility(response.data.response.public);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Visibility Data');
    });
};
