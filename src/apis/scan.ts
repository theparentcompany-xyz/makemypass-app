import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';

export const getUserInfo = async (
  ticketId: string,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
) => {
  privateGateway
    .post(makeMyPass.userInfo(ticketId))
    .then((response) => {
      setMessage(response.data.message.general[0] || 'Check-In Successful');
    })
    .catch((error) => {
      setMessage(error.response.data.message.general[0] || 'Check-In Failed');
    });
};
