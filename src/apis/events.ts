import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { Event } from './types'; // Assuming Event is the type for events
import { NavigateFunction } from 'react-router';
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

export const getEventId = async (eventName: string, navigate?: NavigateFunction) => {
  privateGateway
    .get(makeMyPass.getEventId(eventName))
    .then((response) => {
      localStorage.setItem('eventData', JSON.stringify(response.data.response));
      getEventDatas(response.data.response.event_id);
    })
    .catch((error) => {KW
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
