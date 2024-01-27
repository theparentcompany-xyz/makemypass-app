import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';

export const getUserInfo = async (ticketId: string) => {
  privateGateway
    .get(makeMyPass.userInfo(ticketId))
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Check-In Successful');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Check-In Failed');
    });
};
