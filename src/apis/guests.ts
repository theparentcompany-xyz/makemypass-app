import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { FormEventData, GuestsType, ResentTicket, SelectedGuest } from '../pages/app/Guests/types';
import { Dispatch } from 'react';
import { ErrorMessages, FormDataType } from './types';
import { isArray } from 'chart.js/helpers';
import { BulkUploadType } from '../pages/app/Guests/components/BulkUpload/types';
import { EmailType, VisitedVenues } from '../pages/app/Guests/components/ViewGuest/types';
import { RegistrationDataType } from '../pages/app/Overview/Overview/types';
import { NavigateFunction } from 'react-router';

export const resentEventTicket = async (
  ticketData: ResentTicket,
  setResentTicket: Dispatch<React.SetStateAction<ResentTicket>>,
) => {
  const eventId = JSON.parse(sessionStorage.getItem('eventData')!).event_id;
  privateGateway
    .post(makeMyPass.resentTicket(eventId, ticketData.guestId.toString()))
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
  setFormErrors: Dispatch<React.SetStateAction<ErrorMessages>>,
) => {
  const backendFormData = new FormData();

  Object.keys(data).forEach((key) => {
    let value = data[key];

    if (!(value instanceof FileList)) {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((value) => backendFormData.append(key + '[]', value));
      } else {
        value = data[key]?.toString();
      }
    }

    if (typeof value === 'string' && value.length > 0) {
      backendFormData.append(key, value);
    } else if (value instanceof FileList) {
      Array.from(value).forEach((value) => backendFormData.append(key + '[]', value));
    }
  });

  console.log(data);

  if (data && !isArray(data.id) && typeof data.id === 'string')
    privateGateway
      .put(makeMyPass.editSubmission(eventId, data.id), backendFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        toast.success(response.data.message.general[0] || 'Submission edited successfully');
        setSelectedGuestId(null);
        setFormData({});
      })
      .catch((error) => {
        setFormErrors(error.response.data.response);
        toast.error(error.response.data.message.general[0] || 'Something went wrong');
      });
  else {
    toast.error("Edit data can't be empty");
  }
};

export const getEditGuestData = async (
  eventId: string,
  eventRegisterId: string,
  setFormData: Dispatch<React.SetStateAction<RegistrationDataType | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.editSubmission(eventId, eventRegisterId))
    .then((response) => {
      setFormData(response.data.response);
    })
    .catch(() => {
      toast.error('Something went wrong');
    });
};

export const downloadTicket = async (
  eventId: string,
  eventRegisterId: string,
  navigate: NavigateFunction,
) => {
  privateGateway
    .get(makeMyPass.downloadTicket(eventId, eventRegisterId))
    .then((response) => {
      const eventTitle = JSON.parse(sessionStorage.getItem('eventData')!).event_name;
      navigate(`/${eventTitle}/ticket?ticketURL=${response.data.response.image}`);
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

export const initateRefund = async (
  eventId: string,
  eventRegisterId: string,
  setInitateRefundClicked: Dispatch<React.SetStateAction<boolean>>,
) => {
  privateGateway
    .post(makeMyPass.initateRefund(eventId, eventRegisterId))
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Refund initiated successfully');
      setInitateRefundClicked(false);
    })
    .catch(() => {
      toast.error("Can't initiate refund");
    });
};

export const getGuestInfo = async (
  eventId: string,
  setEventFormData: Dispatch<React.SetStateAction<FormEventData | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.addGuestInfo(eventId))
    .then((response) => {
      setEventFormData({
        id: eventId,
        ...response.data.response,
      });
    })
    .catch(() => {
      toast.error('Something went wrong');
    });
};

export const deleteSubmission = async (eventId: string, submissionId: string) => {
  privateGateway
    .delete(makeMyPass.guestInfo(eventId, submissionId))
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Submission deleted successfully');
    })
    .catch(() => {
      toast.error('Something went wrong, Couldnt Delete Submission');
    });
};

export const listGuests = async (
  eventId: string,
  setGuestList: Dispatch<React.SetStateAction<GuestsType[]>>,
) => {
  privateGateway
    .get(makeMyPass.listGuests(eventId))
    .then((response) => {
      setGuestList(response.data.response);
    })
    .catch(() => {
      setGuestList([]);
    });
};

export const getIndividualGuestInfo = async (
  eventId: string,
  eventRegisterId: string,
  setSelectedGuest: Dispatch<React.SetStateAction<RegistrationDataType | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.guestInfo(eventId, eventRegisterId))
    .then((response) => {
      setSelectedGuest(response.data.response);
    })
    .catch(() => {
      toast.error('Something went wrong');
    });
};

// Bulk Upload APIS

export const getCSVTemplate = (eventId: string) => {
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
    });
};

export const getFileStatus = (
  eventId: string,
  setFileStatus: Dispatch<React.SetStateAction<BulkUploadType[]>>,
) => {
  privateGateway
    .get(makeMyPass.getFileStatus(eventId))
    .then((response) => {
      setFileStatus(response.data.response.files);
    })
    .catch(() => {
      setFileStatus([]);
    });
};

export const uploadFile = (
  eventId: string,
  file: File,
  selectedTickets: string[],
  setFileStatus: Dispatch<React.SetStateAction<BulkUploadType[]>>,
  sendTicket: boolean,
  sendInvoice: boolean,
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('send_ticket', sendTicket ? 'true' : 'false');
  formData.append('send_invoice', sendInvoice ? 'true' : 'false');

  selectedTickets.forEach((ticket) => {
    formData.append('tickets[]', ticket);
  });

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
    })
    .finally(() => {
      getFileStatus(eventId, setFileStatus);
    });
};

export const getVisistedVenues = async (
  eventId: string,
  eventRegisterId: string,
  setVisitedVenues: Dispatch<React.SetStateAction<VisitedVenues>>,
) => {
  privateGateway.get(makeMyPass.listVisitedVenues(eventId, eventRegisterId)).then((response) => {
    setVisitedVenues({
      status: true,
      venues: response.data.response,
    });
  });
};

export const getMailLog = async (
  eventId: string,
  eventRegisterId: string,
  setMailLog: Dispatch<
    React.SetStateAction<{
      showLog: boolean;
      logs: EmailType[];
    }>
  >,
) => {
  privateGateway
    .get(makeMyPass.getMailLog(eventId, eventRegisterId))
    .then((response) => {
      setMailLog({
        showLog: true,
        logs: response.data.response,
      });
    })
    .catch(() => {
      setMailLog({
        showLog: false,
        logs: [],
      });
    });
};
