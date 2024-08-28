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

export const getEventMailData = (
  eventId: string,
  mailId: string,
  setMail: React.Dispatch<React.SetStateAction<MailType | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.communcationMailGet(eventId, mailId))
    .then((response) => {
      setMail(response.data);
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message?.general[0] || 'Error while fetching mail');
    });
};

export const updateEventMail = async (
  eventId: string,
  selectedMail: MailType,
  data: Record<string, any>,
  setMails: React.Dispatch<React.SetStateAction<listMailType[]>>,
  setMailData: React.Dispatch<React.SetStateAction<MailType | undefined>>,
) => {
  try {
    console.log('data', data);

    const response = await privateGateway.patch(
      makeMyPass.communicationMailUPdate(eventId, selectedMail?.id),
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

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
  } catch (error: any) {
    toast.error(error?.response?.data?.message?.general[0] || 'Error while updating mail');
  }
};

export const getEventMailService = (
  eventId: string,
  setMailData: React.Dispatch<React.SetStateAction<any>>,
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
  data: Record<string, any>,
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

export const deleteEventMailAttachment = (
  eventId: string,
  mailId: string,
  attachmentPath: string,
) => {
  privateGateway
    .post(makeMyPass.communicationMailDeleteAttachment(eventId, mailId), {
      attachment_path: attachmentPath,
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Attachment deleted successfully');
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message?.general[0] || 'Error while deleting attachment');
    });
};
