import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';

export const checkInUser = async (
  ticketId: string,
  eventId: string,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setIsError: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  privateGateway
    .post(makeMyPass.checkInUser(ticketId, eventId))
    .then((response) => {
      setMessage(response.data.message.general[0] || 'Check-In Successful');
      setIsError(false);
    })
    .catch((error) => {
      setMessage(error.response.data.message.general[0] || 'Check-In Failed');
      setIsError(true);
    });
};
