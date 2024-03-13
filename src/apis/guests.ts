import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { ResentTicket, SelectedGuest } from '../pages/app/Guests/types';
import { Dispatch } from 'react';
import { FormDataType } from './types';
import { isArray } from 'chart.js/helpers';

export const resentEventTicket = async (
  ticketData: ResentTicket,
  setResentTicket: Dispatch<React.SetStateAction<ResentTicket>>,
) => {
  const eventId = JSON.parse(localStorage.getItem('eventData')!).event_id;
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
  data: FormDataType,
  setSelectedGuestId: Dispatch<React.SetStateAction<SelectedGuest | null>>,
  setFormData: Dispatch<React.SetStateAction<FormDataType>>,
) => {
  if (data && !isArray(data.id))
    privateGateway
      .put(makeMyPass.editSubmission(eventId, data.id), data)
      .then((response) => {
        toast.success(response.data.message.general[0] || 'Submission edited successfully');
        setSelectedGuestId(null);
        setFormData({});
      })
      .catch((error) => {
        toast.error(error.response.data.message.general[0] || 'Something went wrong');
      });
  else {
    toast.error("Edit data can't be empty");
  }
};

export const downloadTicket = async (eventId: string, ticketCode: string, name: string) => {
  privateGateway
    .get(makeMyPass.downloadTicket(eventId, ticketCode))
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Ticket downloaded successfully');
      console.log(response.data.response.image);
      const link = document.createElement('a');
      link.href = response.data.response.image;
      link.download = `${name}.png`;
      document.body.appendChild(link);
      link.click();
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Something went wrong');
    });
};

export const downloadCSVData = async (eventId: string) => {
  privateGateway
    .get(makeMyPass.downloadCSV(eventId))
    .then((response) => {
      const csvData = response.data;
      const csvContent = 'data:text/csv;charset=utf-8,' + csvData;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'data.csv');
      document.body.appendChild(link);
      link.click();
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Something went wrong');
    });
};

export const getCsvTemplate = (eventId: string) => {
  privateGateway
    .get(makeMyPass.downloadCSVTemplate(eventId))
    .then((response) => {
      const csvData = response.data;
      const csvContent = 'data:text/csv;charset=utf-8,' + csvData;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'template.csv');
      document.body.appendChild(link);
      link.click();
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Something went wrong');
    })
}


export const getFileStatus = (eventId: string) => {
  privateGateway
    .get(makeMyPass.getFileStatus(eventId))
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Something went wrong');
    });
}

export const uploadFile = (eventId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  privateGateway
    .post(makeMyPass.uploadFile(eventId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'File uploaded successfully');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Something went wrong');
    });
}