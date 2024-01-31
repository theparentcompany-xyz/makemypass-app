import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';

export const addHosts = async (eventId: string, hostMail: string, role: string) => {
  console.log(role);
  privateGateway
    .post(makeMyPass.addHost(eventId), {
      host_email: hostMail,
      role: role,
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Host addedd successfully');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const updateHostRole = async (eventId: string, hostId: string, role: string) => {
  privateGateway
    .put(makeMyPass.updateHostRole(eventId), {
      host_id: hostId,
      role: role,
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Host addedd successfully');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};
