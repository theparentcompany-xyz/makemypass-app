import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { hostList } from './types';

export const getHosts = async (
  eventId: string,
  setHosts: React.Dispatch<React.SetStateAction<hostList[]>>,
) => {
  privateGateway
    .get(makeMyPass.listHosts(eventId))
    .then((response) => {
      setHosts(response.data.response.hosts);
    })
    .catch((error) => {
      console.log(error);
    });
};
