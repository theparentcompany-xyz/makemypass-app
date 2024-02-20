import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { Dispatch } from 'react';
import { SelectedGuest } from '../pages/app/Guests/types';
import { ErrorMessages, FormData } from './types';

export const sentInvite = (eventId: string, ticketId: string) => {
  privateGateway
    .post(makeMyPass.sentInvite(eventId, ticketId))
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Invite sent successfully');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Invite sending failed');
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
      toast.success(response.data.message.general[0] || 'User shortlisted successfully');
      setSelectedGuestId(null);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'User shortlisting failed');
    });
};

export const addGuest = (
  eventId: string,
  ticketId: string,
  formData: FormData,
  setFormErrors: Dispatch<React.SetStateAction<ErrorMessages>>,
  setSelectedGuestId: Dispatch<React.SetStateAction<SelectedGuest | null>>,
) => {
  privateGateway
    .post(makeMyPass.sentInvite(eventId, ticketId), formData)
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Guest added successfully');
      setSelectedGuestId(null);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Guest adding failed');
      setFormErrors(error.response.data.message);
    });
};
