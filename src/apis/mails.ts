import React from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { listMailType, MailType } from './types';
import toast from 'react-hot-toast';

type mailData = {
  smtp_server: string;
  smtp_port: string;
  smtp_username: string;
  smtp_password: string;
  from_mail: string;
};

export const listMails = (
  eventId: string,
  setMails: React.Dispatch<React.SetStateAction<listMailType[]>>,
) => {
  privateGateway
    .get(makeMyPass.listMails(eventId))
    .then((response) => {
      setMails(response.data.response);
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message?.general[0] || 'Error while fetching mails');
    });
};

export const getMail = (
  eventId: string,
  mailId: string,
  setMail: React.Dispatch<React.SetStateAction<MailType | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.getMail(eventId, mailId))
    .then((response) => {
      setMail(response.data);
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message?.general[0] || 'Error while fetching mail');
    });
};

export const updateMail = (
  eventId: string,
  selectedMail: MailType,
  data: Record<string, any>,
  setMails: React.Dispatch<React.SetStateAction<listMailType[]>>,
) => {
  privateGateway
    .patch(makeMyPass.updateMail(eventId, selectedMail?.id), data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      setMails((mails) =>
        mails.map((mail) =>
          mail.id === selectedMail.id
            ? {
                id: selectedMail.id,
                type: selectedMail.type,
                subject: selectedMail.subject,
              }
            : mail,
        ),
      );
      toast.success(response.data.message.general[0] || 'Mail updated successfully');
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message?.general[0] || 'Error while updating mail');
    });
};

export const getMailService = (
  eventId: string,
  setMailData: React.Dispatch<React.SetStateAction<any>>,
) => {
  privateGateway
    .get(makeMyPass.getMailService(eventId))
    .then((response) => {
      setMailData(response.data.response);
    })
    .catch((error) => {
      toast.error(
        error?.response?.data?.message?.general[0] || 'Error while fetching mail service',
      );
    });
};

export const updateMailService = (
  eventId: string,
  data: Record<string, any>,
  setFetchedData: React.Dispatch<React.SetStateAction<mailData | undefined>>,
  mailData: mailData | undefined,
) => {
  privateGateway
    .post(makeMyPass.updateMailService(eventId), data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Mail service updated successfully');
      setFetchedData(mailData);
    })
    .catch((error) => {
      toast.error(
        error?.response?.data?.message?.general[0] || 'Error while updating mail service',
      );
    });
};
