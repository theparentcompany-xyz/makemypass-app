import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { hostList } from './types';

export const getHosts = async (
  eventId: string,
  setHosts: React.Dispatch<React.SetStateAction<hostList[]>>,
) => {
  privateGateway
    .get(makeMyPass.eventHostList(eventId))
    .then((response) => {
      setHosts(response.data.response.hosts);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};
