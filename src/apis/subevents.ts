import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { SubEventType } from './types';

export const getSubEvents = (
  eventId: string,
  eventRegisterId: string,
  setSubEvents: React.Dispatch<React.SetStateAction<SubEventType[]>>,
) => {
  privateGateway
    .get(makeMyPass.viewSubEvent(eventId, eventRegisterId))
    .then((response) => {
      setSubEvents(response.data.response.sub_events);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};
