import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { Dispatch } from 'react';
import { SelectedGuest } from '../pages/app/Guests/types';

export const sentInvite = (eventId: string, ticketId: string) => {
  privateGateway
    .post(makeMyPass.sentInvite(eventId, ticketId))
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const shortListUser = (
  eventId: string,
  userId: string,
  isShortListed: boolean,
  setSelectedGuestId: Dispatch<React.SetStateAction<SelectedGuest | null>>,
) => {
  privateGateway
    .post(makeMyPass.shortListUser(eventId, userId), {
      is_shortlisted: isShortListed,
    })
    .then((response) => {
      console.log(response.data);
      toast.success(response.data.message.general[0] || 'User shortlisted successfully');
      setSelectedGuestId(null);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'User shortlisting failed');
    });
};
