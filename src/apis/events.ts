import toast from 'react-hot-toast';
import { privateGateway, publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { Event } from './types';
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
  privateGateway
    .get(makeMyPass.getEventId(eventName))
    .then((response) => {
      localStorage.setItem('eventData', JSON.stringify(response.data.response));
      getEventDatas(response.data.response.event_id);
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
      role: string;
      name: string;
      logo: string;
    }>
  >,
) => {
  privateGateway
    .get(makeMyPass.getEventData(eventId))
    .then((response) => {
      setEventData(response.data.response);
      localStorage.setItem('role', response.data.response.role);
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
