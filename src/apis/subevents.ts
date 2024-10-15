import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

import { privateGateway, publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { formatDate } from '../common/commonFunctions';
import type { SubEventListType } from '../pages/app/CheckIns/pages/SubEvent/types';
import { LogType } from '../pages/app/CheckIns/pages/Venue/Venue';
import type { SelectedSubEventsType } from '../pages/app/SubEvents/User/types';
import { FormFieldType, SubEventType } from './types';

export const getSubEvents = async (
  eventId: string,
  eventRegisterId: string,
  setIsEventsLoading: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<SubEventType[]> => {
  setIsEventsLoading(true);

  try {
    const response = await publicGateway
      .get(makeMyPass.viewSubEvent(eventId, eventRegisterId));
    setIsEventsLoading(false);
    return response.data.response.sub_events;
  } catch (error: any) {
    setIsEventsLoading(false);
    toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    return [];
  }
};

export const getSubEventForm = (
  eventId: string,
  eventRegisterId: string,
  selectedSubEventIds: SelectedSubEventsType[],
): Promise<FormFieldType[]> => {
  return new Promise((resolve, reject) => {
    publicGateway
      .post(makeMyPass.getSubEventForm(eventId, eventRegisterId), {
        sub_event_ids: selectedSubEventIds.map((subEvent) => subEvent.id),
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
