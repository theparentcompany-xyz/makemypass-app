import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';

export const createOrg = (eventTitle: string) => {
  const userEmail = localStorage.getItem('userEmail');
  privateGateway
    .post(makeMyPass.orgCreate, {
      title: eventTitle,
      email: userEmail,
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Org Created Successfully');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};
