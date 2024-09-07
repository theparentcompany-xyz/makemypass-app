import React from 'react';
import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { listMailType, MailType } from './types';

type mailData = {
  smtp_server: string;
  smtp_port: string;
  smtp_username: string;
  smtp_password: string;
  from_mail: string;
};

export const listEventMails = (
  eventId: string,
  setMails: React.Dispatch<React.SetStateAction<listMailType[]>>,
) => {
  privateGateway
    .get(makeMyPass.communicationMailList(eventId))
    .then((response) => {
      setMails(response.data.response);
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message?.general[0] || 'Error while fetching mails');
    });
};

export const getEventMailData = async (
  eventId: string,
  mailId: string,
  setMail?: React.Dispatch<React.SetStateAction<MailType | undefined>>,
) => {
  try {
    const response = await privateGateway.get(makeMyPass.communcationMailGet(eventId, mailId));
    setMail && setMail(response.data.response);
    return response.data.response;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(error?.response?.data?.message?.general[0] || 'Error while fetching mail');
  }
};

export const updateEventMail = (
  eventId: string,
  selectedMail: MailType,
  data: FormData,
  setMails: React.Dispatch<React.SetStateAction<listMailType[]>>,
  setMailData: React.Dispatch<React.SetStateAction<MailType | undefined>>,
  setSelectedMail: React.Dispatch<React.SetStateAction<listMailType | undefined>>,
) => {
  privateGateway
    .put(makeMyPass.communicationMailUPdate(eventId, selectedMail?.id), data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      setMails((mails) =>
        mails.map((mail) =>
          mail.id === selectedMail.id
            ? {
                id: response?.data?.response?.id ? response.data.response.id : selectedMail.id,
                type: selectedMail.type,
                subject: selectedMail.subject,
              }
            : mail,
        ),
      );
      setMailData({
        ...selectedMail,
        id: response?.data?.response?.id ? response.data.response.id : selectedMail.id,
      } as MailType);

      toast.success(response.data.message.general[0] || 'Mail updated successfully');
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message?.general[0] || 'Error while updating mail');
    })
    .finally(() => {
      setSelectedMail(undefined);
    });
};

export const getEventMailService = (
  eventId: string,
  setMailData: React.Dispatch<React.SetStateAction<mailData | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.communicationServiceMail(eventId))
    .then((response) => {
      setMailData(response.data.response);
    })
    .catch((error) => {
      toast.error(
        error?.response?.data?.message?.general[0] || 'Error while fetching mail service',
      );
    });
};

export const updateEventMailService = (
  eventId: string,
  data: Record<string, unknown>,
  setFetchedData: React.Dispatch<React.SetStateAction<mailData | undefined>>,
  mailData: mailData | undefined,
) => {
  privateGateway
    .post(makeMyPass.communicationServiceMail(eventId), data, {
      headers: {
        'Content-Type': 'application/json',
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
