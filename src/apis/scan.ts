import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { User } from './types';

export const getUserInfo = async (
  ticketId: string,
  setCheckIn: React.Dispatch<React.SetStateAction<boolean>>,
  setUserData: React.Dispatch<React.SetStateAction<User | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.userInfo(ticketId))
    .then((response) => {
      setUserData(response.data.response);
      toast.success('Check-In Successful');
      setCheckIn(true);
    })
    .catch((error) => {
      toast.error('Check-In Failed');
      setCheckIn(false);
    });
};
