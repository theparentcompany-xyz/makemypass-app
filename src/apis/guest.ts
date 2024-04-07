import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { Dispatch } from 'react';
import { SelectedGuest } from '../pages/app/Guests/types';
import { ErrorMessages, FormDataType } from './types';

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
  formData: FormDataType,
  setFormErrors: Dispatch<React.SetStateAction<ErrorMessages>>,
  setSelectedGuestId: Dispatch<React.SetStateAction<SelectedGuest | null>>,
) => {
  formData['tickets[]'] = ticketId;
  privateGateway
    .post(makeMyPass.sentInvite(eventId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Guest added successfully');
      setSelectedGuestId(null);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Guest adding failed');
      setFormErrors(error.response.data.message);
    });
};

export const downloadFormSubmission = (eventId: string) => {
  privateGateway
    .get(makeMyPass.downloadFormSubmission(eventId))
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `form-submission-${eventId}.csv`);
      document.body.appendChild(link);
      link.click();
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Form submission download failed');
    });
};
