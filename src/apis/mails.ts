import React from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { MailType } from './types';
import toast from 'react-hot-toast';

export const listMails = (
  eventId: string,
  setMails: React.Dispatch<React.SetStateAction<MailType[]>>,
) => {
  privateGateway
    .get(makeMyPass.listMails(eventId))
    .then((response) => {
      setMails(response.data.response);
      console.log(response.data.response);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getMail = (eventId: string, mailId: string) => {
  privateGateway
    .get(makeMyPass.getMail(eventId, mailId))
    .then((response) => {
      console.log(response.data.response);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const updateMail = (eventId: string, mailId: string, data: Record<string, any>) => {
  privateGateway
    .patch(makeMyPass.updateMail(eventId, mailId), data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      toast.success('Mail updated successfully');
      console.log(response.data.response);
    })
    .catch((error) => {
      toast.error('Error while updating mail');
      console.log(error);
    });
};
