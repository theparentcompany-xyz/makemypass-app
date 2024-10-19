import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

import { privateGateway, publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { formatDate } from '../common/commonFunctions';
import { TableType } from '../components/Table/types';
import type { SubEventListType } from '../pages/app/CheckIns/pages/SubEvent/types';
import type { LogType } from '../pages/app/CheckIns/pages/Venue/Venue';
import { PaginationDataType } from '../pages/app/Guests/types';
import type { SubEventCRUDType } from '../pages/app/SubEvents/Admin/Dashboard/types';
import type { SelectedSubEventsType } from '../pages/app/SubEvents/User/types';
import type { FormFieldType, SubEventType } from './types';

export const getSubEvents = (
  eventId: string,
  eventRegisterId: string,
  setIsEventsLoading: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<SubEventType[]> => {
  return new Promise((resolve, reject) => {
    setIsEventsLoading(true);

    publicGateway
      .get(makeMyPass.viewSubEvent(eventId, eventRegisterId))
      .then((response) => {
        setIsEventsLoading(false);
        resolve(response.data.response.sub_events);

        const localStorageData = {
          title: response.data.response.title,
          id: response.data.response.id,
          logo: response.data.response.logo,
        };

        sessionStorage.setItem('eventData', JSON.stringify(localStorageData));
      })
      .catch((error) => {
        setIsEventsLoading(false);
        toast.error(error.response.data.message.general[0] || 'Unable to process the request');
        reject([]);
      });
  });
};

export const getSubEventForm = (
  eventId: string,
  eventRegisterId: string,
  selectedSubEventIds: SelectedSubEventsType[],
): Promise<FormFieldType[]> => {
  return new Promise((resolve, reject) => {
    publicGateway
      .post(makeMyPass.getSubEventForm(eventId, eventRegisterId), {
        sub_event_ids: selectedSubEventIds
          .filter((subEvent) => !subEvent.alreadyRegistered)
          .map((subEvent) => subEvent.id),
      })
      .then((response) => {
        resolve(response.data.response.form);
      })
      .catch((error) => {
        toast.error(error.response.data.message.general[0] || 'Unable to process the request');
        reject(error);
      });
  });
};

export const subEventRegister = (
  eventId: string,
  eventRegisterId: string,
  formData: Record<string, string | string[]>,
  selectedEvents: SelectedSubEventsType[],
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string[]>>>,
  setTriggerFetch: React.Dispatch<React.SetStateAction<boolean>>,
  setShowFormModal?: React.Dispatch<React.SetStateAction<boolean>>,
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const backendFormData = new FormData();

  selectedEvents.forEach((eventId) => {
    if (!eventId.alreadyRegistered) backendFormData.append('sub_event_ids[]', eventId.id);
  });

  //Trim the formData to remove spaces
  Object.keys(formData).forEach((key) => {
    if (typeof formData[key] === 'string') {
      formData[key] = formData[key].toString().trim();
    }
  });

  Object.keys(formData).forEach((key) => {
    let value = formData[key];

    if (!(value instanceof FileList)) {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((value) => backendFormData.append(key + '[]', value));
      } else {
        value = formData[key].toString();
      }
    }

    if (typeof value === 'string' && value.length > 0) {
      backendFormData.append(key, value);
    } else if (value instanceof FileList) {
      Array.from(value).forEach((value) => backendFormData.append(key + '[]', value));
    }
  });
  publicGateway
    .post(makeMyPass.subEventRegister(eventId, eventRegisterId), backendFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => {
      toast.success('Registered successfully');
      setFormErrors({});
      setShowFormModal && setShowFormModal(false);
      setTimeout(() => {
        setTriggerFetch((prev) => !prev);
      }, 1000);
    })
    .catch((error) => {
      setFormErrors(error.response.data.message);
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    })
    .finally(() => {
      setIsLoading && setIsLoading(false);
    });
};

export const removeSubEvent = (
  eventId: string,
  eventRegisterId: string,
  subEventId: string,
  setSelectedEvents: Dispatch<SetStateAction<SelectedSubEventsType[]>>,
  setSubEventToRemove: Dispatch<SetStateAction<string | null>>,
  setTriggerFetch: Dispatch<SetStateAction<boolean>>,
) => {
  publicGateway
    .delete(makeMyPass.removeRegisteredSubEvent(eventId, eventRegisterId, subEventId))
    .then(() => {
      toast.success('Sub Event removed successfully');
      setSelectedEvents((selectedEvents) =>
        selectedEvents.filter((eventId) => eventId.id !== subEventId),
      );
      setSubEventToRemove(null);
      setTimeout(() => {
        setTriggerFetch((prev) => !prev);
      }, 1000);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const checkInUserSubEvent = async (
  ticketCode: string,
  eventId: string,
  selectedSubEvent: SubEventListType | null,
  setScanLogs: Dispatch<React.SetStateAction<LogType[]>>,
) => {
  if (selectedSubEvent)
    privateGateway
      .post(makeMyPass.scanGuestSubEventCheckin(eventId), {
        sub_event_id: selectedSubEvent?.id,
        ticket_code: ticketCode,
      })
      .then((response) => {
        setScanLogs((prev) => [
          ...prev,
          {
            message: `${response.data.message.general[0]}`,
            timestamp: formatDate(new Date().toString(), true),
            hasError: false,
          },
        ]);
      })
      .catch((error) => {
        setScanLogs((prev) => [
          ...prev,
          {
            message: `${error.response.data.message.general[0]}`,
            timestamp: formatDate(new Date().toString(), true),
            hasError: true,
          },
        ]);
      });
  else {
    toast.error('Please select a sub-event to check-in');
  }
};

export const listCheckInSubEvents = async (
  eventId: string,
  setSubEvents: Dispatch<React.SetStateAction<SubEventListType[]>>,
) => {
  privateGateway
    .get(makeMyPass.scanGuestSubEventList(eventId))
    .then((response) => {
      setSubEvents(response.data.response.sub_events);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

//Dashboard.tsx

export const listDashboardSubEvents = async (
  eventId: string,
  setSubEvents: Dispatch<React.SetStateAction<SubEventListType[]>>,
) => {
  privateGateway
    .get(makeMyPass.listSubEvents(eventId))
    .then((response) => {
      setSubEvents(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const createNewSubEvent = (
  eventId: string,
  subEvent: SubEventCRUDType,
  setSubEvents: Dispatch<React.SetStateAction<SubEventListType[]>>,
  setCurrentSelectedType: Dispatch<React.SetStateAction<string>>,
  subEventDescription: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const filteredSubEventData = Object.fromEntries(
      Object.entries(subEvent).filter(
        ([key, value]) => key != 'id' && value !== '' && value !== null && value !== undefined,
      ),
    );

    privateGateway
      .post(makeMyPass.createNewSubEvent(eventId), {
        ...filteredSubEventData,
        description: subEventDescription,
      })
      .then((response) => {
        toast.success('Sub Event created successfully');
        listDashboardSubEvents(eventId, setSubEvents);
        setCurrentSelectedType('');
        resolve(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message.general[0] || 'Unable to process the request');
        reject(error);
      });
  });
};

export const getSubEventData = async (
  eventId: string,
  subEventId: string,
  setSelectedSubEvent: Dispatch<SetStateAction<SubEventCRUDType>>,
  setLimitCapacity: Dispatch<SetStateAction<boolean>>,
) => {
  privateGateway
    .get(makeMyPass.updateSubEvent(eventId, subEventId))
    .then((response) => {
      setSelectedSubEvent(response.data.response);
      setLimitCapacity(response.data.response.capacity !== 0);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const deleteSubEvent = async (
  eventId: string,
  subEventId: string,
  setSubEvents: Dispatch<React.SetStateAction<SubEventListType[]>>,
) => {
  privateGateway
    .delete(makeMyPass.updateSubEvent(eventId, subEventId))
    .then(() => {
      toast.success('Sub Event deleted successfully');
      listDashboardSubEvents(eventId, setSubEvents);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const editSubEvent = async (
  eventId: string,
  subEvent: SubEventCRUDType,
  setSubEvents: Dispatch<React.SetStateAction<SubEventListType[]>>,
  setCurrentSelectedType: Dispatch<React.SetStateAction<string>>,
  subEventDescription: string,
) => {
  if (!subEvent) return;
  console.log(subEvent);
  privateGateway
    .patch(makeMyPass.updateSubEvent(eventId, subEvent.id), {
      ...subEvent,
      description: subEventDescription,
    })
    .then(() => {
      toast.success('Sub Event updated successfully');
      listDashboardSubEvents(eventId, setSubEvents);
      setCurrentSelectedType('');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const listSubEventGuests = async (
  eventId: string,
  subEventId: string,
  setSubEventGuests: Dispatch<React.SetStateAction<TableType[]>>,
  setPaginationData: Dispatch<React.SetStateAction<PaginationDataType>>,
) => {
  privateGateway
    .get(makeMyPass.subEventGuestList(eventId, subEventId))
    .then((response) => {
      setSubEventGuests(response.data.response.data);
      setPaginationData(response.data.response.pagination);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const downloadSubEventCSV = async (eventId: string, subEventId: string) => {
  privateGateway
    .get(makeMyPass.subEventCSVDownload(eventId, subEventId))
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
