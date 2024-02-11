import { publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { TicketOptions } from '../pages/app/EventPage/types';

export const getTickets = async (
  eventId: string,
  setTicketInfo: React.Dispatch<React.SetStateAction<TicketOptions | undefined>>,
) => {
  publicGateway
    .get(makeMyPass.getTicketInfo(eventId))
    .then((response) => {
      setTicketInfo(response.data.response);
    })
    .catch((error) => {
      console.log(error);
    });
};
