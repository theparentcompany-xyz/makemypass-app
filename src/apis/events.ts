import toast from 'react-hot-toast';
import { privateGateway, publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { Event, EventType } from './types';
import { Dispatch } from 'react';
import { PubllicEvent } from '../pages/app/LandingPage/components/Projects/types';
import { getEventDatas } from './publicpage';

export const getEvents = async (setEvents: React.Dispatch<React.SetStateAction<Event[]>>) => {
  privateGateway
    .get(makeMyPass.listEvents)
    .then((response) => {
      setEvents(response.data.response.events);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const getEventId = async (
  eventName: string,
  setHasEvent?: Dispatch<React.SetStateAction<boolean>>,
) => {
  const localData = localStorage.getItem('eventData');

  if (!localData)
    privateGateway
      .get(makeMyPass.getEventId(eventName))
      .then((response) => {
        localStorage.setItem('eventData', JSON.stringify(response.data.response));

        if (localStorage.getItem('accessToken')) getEventDatas(response.data.response.event_id);
      })
      .catch(() => {
        setHasEvent && setHasEvent(false);
      });
};

export const getEventData = async (
  eventId: string,
  setEventData: React.Dispatch<
    React.SetStateAction<{
      title: string;
      date: string;
      current_user_role: string;
      name: string;
      logo: string;
    }>
  >,
) => {
  privateGateway
    .get(makeMyPass.getEvent(eventId))
    .then((response) => {
      setEventData(response.data.response);
      localStorage.setItem('current_user_role', response.data.response.current_user_role);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const getPublicEvents = async (
  setEvents: React.Dispatch<React.SetStateAction<PubllicEvent[]>>,
) => {
  publicGateway
    .get(makeMyPass.listPublicEvents)
    .then((response) => {
      setEvents(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const getCategories = async (
  eventId: string,
  setCategories: Dispatch<React.SetStateAction<string[]>>,
) => {
  privateGateway
    .get(makeMyPass.getCategories(eventId))
    .then((response) => {
      setCategories(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const createEvent = (eventTitle: string) => {
  privateGateway
    .post(makeMyPass.createEvent, {
      title: eventTitle,
    }).then((response) => {
      toast.success(response.data.message.general[0] || 'Event Created Successfully');
      setTimeout(() => {
        window.location.href = `/${eventTitle.toLowerCase().replace(/\s/g, '-')}/manage`;
      }, 1000)

    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const getEvent = (
  eventId: string,
  setEventTitle?: Dispatch<React.SetStateAction<string>>,
  setEventData?: Dispatch<React.SetStateAction<EventType | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.getEvent(eventId))
    .then((response) => {
      setEventData && setEventData(response.data.response);
      setEventTitle && setEventTitle(response.data.response.title);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const editEvent = (eventId: string, eventData: Object) => {
  privateGateway
    .patch(makeMyPass.editEvent(eventId), eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Event Updated Successfully');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};
