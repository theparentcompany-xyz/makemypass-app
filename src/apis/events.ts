import { Dispatch } from 'react';
import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { ErrorMessages, Event, EventType } from './types';

export const getEventsList = async (
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>,
  setIsDataLoaded: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  privateGateway
    .get(makeMyPass.listEvents)
    .then((response) => {
      setEvents(response.data.response.events);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    })
    .finally(() => {
      setIsDataLoaded(true);
    });
};

export const getCommonTags = async (setTags: React.Dispatch<React.SetStateAction<string[]>>) => {
  privateGateway
    .get(makeMyPass.listCommonTags)
    .then((response) => {
      setTags(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

interface EventData {
  title: string;
  current_user_role: string;
  event_name: string;
  logo: string;
  event_id: string;
}

export const setEventInfoLocal = async (eventName: string): Promise<EventData> => {
  return new Promise((resolve, reject) => {
    privateGateway
      .get(makeMyPass.getEventInfo(eventName))
      .then((response) => {
        const eventData: EventData = {
          title: response.data.response.title,
          current_user_role: response.data.response.current_user_role,
          event_name: response.data.response.name,
          logo: response.data.response.logo,
          event_id: response.data.response.id,
        };
        sessionStorage.setItem('eventData', JSON.stringify(eventData));
        resolve(eventData); // Now correctly resolving with an EventData object
      })
      .catch((error) => {
        toast.error('Event Not Found');
        reject(error); // Reject the promise on error
      });
  });
};

export const getEventId = async (
  eventName: string,
): Promise<{
  id: string;
  name: string;
}> => {
  return new Promise((resolve, reject) => {
    privateGateway
      .get(makeMyPass.getEventId(eventName))
      .then((response) => {
        const eventData = {
          id: response.data.response.id,
          title: response.data.response.name,
        };
        sessionStorage.setItem('eventData', JSON.stringify(eventData));
        resolve(response.data.response);
      })
      .catch((error) => {
        toast.error(error.response.data.message.general[0] || 'Unable to process the request');
        reject(error);
      });
  });
};

export const getFormCategories = async (
  eventId: string,
  setCategories: Dispatch<React.SetStateAction<string[]>>,
) => {
  privateGateway
    .get(makeMyPass.guestListFormCategories(eventId))
    .then((response) => {
      setCategories(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const createEvent = (eventTitle: string) => {
  privateGateway
    .post(makeMyPass.eventCreate, {
      title: eventTitle,
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Event Created Successfully');
      setTimeout(() => {
        window.location.href = `/${eventTitle.toLowerCase().replace(/\s/g, '-')}/manage`;
      }, 1000);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const getEventData = (
  eventId: string,
  setEventTitle?: Dispatch<React.SetStateAction<string>>,
  setEventData?: Dispatch<React.SetStateAction<EventType | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.event(eventId))
    .then((response) => {
      setEventData && setEventData(response.data.response);
      setEventTitle && setEventTitle(response.data.response.title);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const updateEventData = ({
  eventId,
  eventData,
  setIsPublished,
  setFormErrors,
  setLoading,
}: {
  eventId: string;
  eventData: FormData;
  setIsPublished?: Dispatch<boolean>;
  setFormErrors?: Dispatch<ErrorMessages>;
  setLoading?: Dispatch<boolean>;
}) => {
  setLoading && setLoading(true);
  privateGateway
    .patch(makeMyPass.event(eventId), eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Event Updated Successfully');
      // if (!setIsPublished) window.location.href = `/${response.data.response.name}/manage`;
      setIsPublished && setIsPublished(eventData.get('is_public_insight') === 'true');
    })
    .catch((error) => {
      setIsPublished && setIsPublished(false);
      setFormErrors && setFormErrors(error.response.data.message);
      // toast.error(error?.response?.data?.message?.general[0] || 'Unable to process the request');

      Object.keys(error.response.data.message).forEach((key) => {
        if (error.response.data.message[key][0].length > 0)
          toast.error(error.response.data.message[key][0]);
      });
    })
    .finally(() => {
      setLoading && setLoading(false);
    });
};

export const deleteEvent = (eventId: string) => {
  privateGateway
    .delete(makeMyPass.event(eventId))
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Event Deleted Successfully');
      setTimeout(() => {
        window.location.href = '/events';
      }, 1000);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const createDuplicateEvent = async (eventId: string) => {
  privateGateway
    .post(makeMyPass.eventCreateDuplicate(eventId))
    .then((response) => {
      toast.success('Event Duplicated Successfually');
      setEventInfoLocal(response.data.response.event_name);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};
