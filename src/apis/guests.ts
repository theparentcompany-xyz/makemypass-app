import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

import { privateGateway, publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import type { BulkUploadType } from '../pages/app/Guests/components/BulkUpload/types';
import type { EmailType, VisitedVenues } from '../pages/app/Guests/components/ViewGuest/types';
import { FormEventData, GuestsType, ResentTicket, SelectedGuest } from '../pages/app/Guests/types';
import type { RegistrationDataType } from '../pages/app/Overview/Overview/types';
import { ErrorMessages, FormDataType } from './types';

export const resentGuestTicket = async (
  ticketData: ResentTicket,
  setResentTicket: Dispatch<React.SetStateAction<ResentTicket>>,
) => {
  const eventId = JSON.parse(sessionStorage.getItem('eventData')!).event_id;
  privateGateway
    .post(makeMyPass.guestResentTicket(eventId, ticketData.guestId.toString()))
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Ticket resend successfully');
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

export const updateGuestSubmission = async (
  eventId: string,
  eventRegisterId: string,
  data: FormDataType,
  setSelectedGuestId: Dispatch<React.SetStateAction<SelectedGuest | null>>,
  setFormData: Dispatch<React.SetStateAction<FormDataType>>,
  setFormErrors: Dispatch<React.SetStateAction<ErrorMessages>>,
  setGuests: Dispatch<SetStateAction<GuestsType[]>>,
) => {
  const backendFormData = new FormData();

  Object.keys(data).forEach((key) => {
    let value = data[key];

    if (!(value instanceof FileList)) {
      if (Array.isArray(value) && value.length >= 0) {
        value.forEach((value) => backendFormData.append(key + '[]', value));
      } else {
        value = data[key]?.toString();
      }
    }

    if (typeof value === 'string' && value.length >= 0) {
      backendFormData.append(key, value);
    } else if (value instanceof FileList) {
      Array.from(value).forEach((value) => backendFormData.append(key + '[]', value));
    }
  });

  if (eventRegisterId && data)
    privateGateway
      .put(makeMyPass.guestEditSubmission(eventId, eventRegisterId), backendFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        toast.success(response.data.message.general[0] || 'Submission edited successfully');
        const updatedData = response.data.response;
        setSelectedGuestId(null);
        setFormData({});
        setGuests((prev) => {
          return prev.map((guest) => {
            if (guest.id === updatedData.id) {
              return {
                ...guest,
                ...updatedData,
              };
            }
            return guest;
          });
        });
      })
      .catch((error) => {
        setFormErrors(error.response.data.response);
        toast.error(error.response.data.message.general[0] || 'Something went wrong');
      });
  else {
    toast.error("Edit data can't be empty");
  }
};

export const getGuestEditPrefillData = async (
  eventId: string,
  eventRegisterId: string,
  setSelectedGuest: Dispatch<React.SetStateAction<RegistrationDataType | undefined>>,
  setFormData: Dispatch<React.SetStateAction<FormDataType>>,
) => {
  privateGateway
    .get(makeMyPass.guestEditSubmission(eventId, eventRegisterId))
    .then((response) => {
      setSelectedGuest(response.data.response);
      setFormData(response.data.response.submissions);
    })
    .catch(() => {
      toast.error('Something went wrong');
    });
};

export const viewGuestTicket = async (
  eventId: string,
  eventRegisterId: string,
  setImageUrl: Dispatch<React.SetStateAction<string>>,
  setLoading?: Dispatch<React.SetStateAction<boolean>>,
) => {
  publicGateway
    .get(makeMyPass.guestDownloadTicket(eventId, eventRegisterId))
    .then((response) => {
      setImageUrl(response.data.response.image);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Something went wrong');
    })
    .finally(() => {
      setLoading && setLoading(false);
    });
};

export const downloadRegisterCSVData = async (
  eventId: string,
  showCheckedInOnly: boolean,
  showApprovedOnly: boolean,
) => {
  const params = new URLSearchParams();
  if (showCheckedInOnly) params.append('checkin_only', 'true');
  if (showApprovedOnly) params.append('approved_only', 'true');

  privateGateway
    .get(makeMyPass.guestDownloadCSV(eventId) + '?' + params.toString())
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

export const initateGuestRefund = async (
  eventId: string,
  eventRegisterId: string,
  setInitateRefundClicked: Dispatch<React.SetStateAction<boolean>>,
) => {
  privateGateway
    .post(makeMyPass.guestInitateRefund(eventId, eventRegisterId))
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Refund initiated successfully');
      setInitateRefundClicked(false);
    })
    .catch(() => {
      toast.error("Can't initiate refund");
    });
};

export const getEventFormData = async (
  eventId: string,
  setEventFormData: Dispatch<React.SetStateAction<FormEventData | undefined>>,
  setTriggerFetch?: Dispatch<React.SetStateAction<boolean>>,
) => {
  privateGateway
    .get(makeMyPass.guestFormInfo(eventId))
    .then((response) => {
      setEventFormData({
        id: eventId,
        ...response.data.response,
      });
      if (setTriggerFetch) setTriggerFetch((prev) => !prev);
    })
    .catch(() => {
      toast.error('Something went wrong');
    });
};

export const deleteGuestSubmission = async (
  eventId: string,
  submissionId: string,
  setTriggerFetch: Dispatch<SetStateAction<boolean>> | undefined,
) => {
  privateGateway
    .delete(makeMyPass.guestInformation(eventId, submissionId))
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Submission deleted successfully');
      if (setTriggerFetch) setTriggerFetch((prev) => !prev);
    })
    .catch(() => {
      toast.error('Something went wrong, Couldnt Delete Submission');
    });
};

export const getGuestInformation = async (
  eventId: string,
  eventRegisterId: string,
  setSelectedGuest: Dispatch<React.SetStateAction<RegistrationDataType | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.guestInformation(eventId, eventRegisterId))
    .then((response) => {
      setSelectedGuest(response.data.response);
    })
    .catch(() => {
      toast.error('Something went wrong');
    });
};

// Bulk Upload APIS

export const getBulkImportCSV = (eventId: string) => {
  privateGateway
    .get(makeMyPass.bulkDownloadTemplate(eventId))
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

export const getGuestBulkImportList = (
  eventId: string,
  setFileStatus: Dispatch<React.SetStateAction<BulkUploadType[]>>,
) => {
  privateGateway
    .get(makeMyPass.bulkGuestList(eventId))
    .then((response) => {
      setFileStatus(response.data.response.files);
    })
    .catch(() => {
      setFileStatus([]);
    });
};

export const uploadBulkGuestData = (
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
    .post(makeMyPass.bulkGuestUpload(eventId), formData, {
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
      getGuestBulkImportList(eventId, setFileStatus);
    });
};

export const getGuestVisistedVenues = async (
  eventId: string,
  eventRegisterId: string,
  setVisitedVenues: Dispatch<React.SetStateAction<VisitedVenues>>,
) => {
  privateGateway.get(makeMyPass.guestVisitedVenues(eventId, eventRegisterId)).then((response) => {
    setVisitedVenues({
      status: true,
      venues: response.data.response,
    });
  });
};

export const getGuestMailLog = async (
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
    .get(makeMyPass.guestMailLog(eventId, eventRegisterId))
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
