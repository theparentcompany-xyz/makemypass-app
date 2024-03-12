import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { hostData } from '../pages/app/Overview/Overview/types';
import { Dispatch } from 'react';

export const addHosts = async (
  eventId: string,
  hostMail: string,
  role: string,
  is_private: boolean,
  setHostData: Dispatch<React.SetStateAction<hostData>>,
) => {
  privateGateway
    .post(makeMyPass.addHost(eventId), {
      host_email: hostMail,
      role: role,
      is_private: is_private,
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Host addedd successfully');
      setHostData({
        email: '',
        role: '',
        id: '',
        is_private: true,
      });
    })

    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const updateHostRole = async (
  eventId: string,
  hostId: string,
  role: string,
  is_private: boolean,
  setHostData: Dispatch<React.SetStateAction<hostData>>,
) => {
  privateGateway
    .put(makeMyPass.updateHostRole(eventId), {
      host_id: hostId,
      role: role,
      is_private: is_private,
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Host added successfully');
      setHostData({
        email: '',
        role: '',
        id: '',
        is_private: true,
      });
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const removeHost = async (
  eventId: string,
  hostId: string,
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  privateGateway
    .delete(makeMyPass.removeHost(eventId, hostId))
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Host removed successfully');
      setOpenDeleteModal(false);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};
