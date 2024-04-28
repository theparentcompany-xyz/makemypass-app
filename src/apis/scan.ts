import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { TicketType } from './types';

export const checkInUser = async (
  ticketId: string,
  eventId: string,
  setMessage?: React.Dispatch<React.SetStateAction<string>>,
  setIsError?: React.Dispatch<React.SetStateAction<boolean>>,
  selectedTicket?: TicketType | undefined,
) => {
  privateGateway
    .post(makeMyPass.checkInUser(ticketId, eventId), {
      ticket_id: selectedTicket?.id,
    })
    .then((response) => {
      if (setMessage && setIsError) {
        setMessage(response.data.message.general[0] || 'Check-In Successful');
        setIsError(false);
      } else {
        toast.success(response.data.message.general[0] || 'Check-In Successful');
      }
    })
    .catch((error) => {
      if (setMessage && setIsError) {
        setMessage(error.response.data.message.general[0] || 'Check-In Failed');
        setIsError(true);
      } else {
        toast.error(error.response.data.message.general[0] || 'Check-In Failed');
      }
    });
};

export const getCheckInCount = async (
  eventId: string,
  setCheckInCount: React.Dispatch<React.SetStateAction<number>>,
) => {
  privateGateway
    .get(makeMyPass.checkInCount(eventId))
    .then((response) => {
      setCheckInCount(response.data.response.authorized_count);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Check-In Count');
    });
};
