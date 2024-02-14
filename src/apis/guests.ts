import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { GuestsType, ResentTicket, SelectedGuest } from '../pages/app/Guests/types';
import { Dispatch } from 'react';

export const resentEventTicket = async (
  ticketData: ResentTicket,
  setResentTicket: Dispatch<React.SetStateAction<ResentTicket>>,
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

export const editSubmissons = async (
  eventId: string,
  data: GuestsType | null,
  setSelectedGuestId: Dispatch<React.SetStateAction<SelectedGuest | null>>,
) => {
  const dataToSent = {
    name: data?.name,
    email: data?.email,
    phone_number: data?.phone_number,
    district: data?.district,
    category: data?.category,
    organization: data?.organization,
  };

  if (data)
    privateGateway
      .put(makeMyPass.editSubmission(eventId, data.id), dataToSent)
      .then((response) => {
        toast.success(response.data.message.general[0] || 'Submission edited successfully');
        setSelectedGuestId(null);
      })
      .catch((error) => {
        toast.error(error.response.data.message.general[0] || 'Something went wrong');
      });
  else {
    toast.error("Edit data can't be empty");
  }
};

export const downloadTicket = async (eventId: string, ticketCode: string) => {
  privateGateway
    .get(makeMyPass.downloadTicket(eventId, ticketCode))
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Ticket downloaded successfully');
      window.open(response.data.response.image, '_blank');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Something went wrong');
    });
};
