import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { TicketType } from './types';

export const getTicket = async (
  eventId: string,
  ticketId: string,
  setTickets: React.Dispatch<React.SetStateAction<TicketType[]>>,
) => {
  privateGateway
    .get(makeMyPass.getTicket(eventId, ticketId))
    .then((response) => {
      setTickets((curr) => {
        return [...curr, response.data.response];
      });
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const createTicket = async (eventId: string, ticket: TicketType) => {
  delete ticket['new'];
  privateGateway
    .post(makeMyPass.createTicket(eventId), ticket, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Ticket Created Successfully');
      window.location.reload();
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};
export const editTicket = async (eventId: string, ticketId: string, changedData: Object) => {
  privateGateway
    .patch(makeMyPass.editTicket(eventId, ticketId), changedData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      // window.location.reload();
      toast.success(response.data.message.general[0] || 'Ticket Updated Successfully');
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message?.general[0] || 'Unable to process the request');
    });
};

export const deleteTicket = async (eventId: string, ticketId: string) => {
  const toastId = toast.loading('Deleting Ticket...');
  privateGateway
    .delete(makeMyPass.deleteTicket(eventId, ticketId))
    .then((response) => {
      toast.success(response?.data?.message?.general[0] || 'Ticket Deleted Successfully', {
        id: toastId,
      });
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message?.general[0] || 'Unable to process the request', {
        id: toastId,
      });
    });
};
