import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { resentTicket } from '../pages/app/Guests/types';
import { Dispatch } from 'react';

export const resentEventTicket = async (
  ticketData: resentTicket,
  setResentTicket: Dispatch<React.SetStateAction<resentTicket>>,
) => {
  const eventId = JSON.parse(localStorage.getItem('eventData')!).event_id;
  console.log(ticketData.guestId);
  privateGateway
    .post(makeMyPass.resentTicket, {
      client_id: ticketData.guestId,
      event_id: eventId,
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Ticket resent successfully');
      setResentTicket({
        status: false,
        name: '',
        guestId: '',
      });
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Something went wrong');
    });
};
