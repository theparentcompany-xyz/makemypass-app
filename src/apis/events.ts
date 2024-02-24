import toast from 'react-hot-toast';
import { privateGateway, publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { Event } from './types'; // Assuming Event is the type for events
import { NavigateFunction } from 'react-router';
import { getEventDatas } from './publicpage';
import { Dispatch } from 'react';

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

export const getEventId = async (eventName: string, navigate?: NavigateFunction) => {
  privateGateway
    .get(makeMyPass.getEventId(eventName))
    .then((response) => {
      localStorage.setItem('eventData', JSON.stringify(response.data.response));
      getEventDatas(response.data.response.event_id);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
      navigate && navigate('/404');
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

export const getPublicEvents = async (setEvents: React.Dispatch<React.SetStateAction<Event[]>>) => {
  publicGateway
    .get(makeMyPass.listPublicEvents)
    .then((response) => {
      setEvents(response.data.response);
      console.log(response.data.response);
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
      console.log(response.data.response);
      setCategories(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};
