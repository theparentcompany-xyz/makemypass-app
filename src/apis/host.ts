import { Dispatch } from 'react';
import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { hostData } from '../pages/app/Overview/Overview/types';
import { hostList } from './types';

export const createEventHost = async (
  eventId: string,
  hostMail: string,
  role: string,
  is_private: boolean,
  setHostData: Dispatch<React.SetStateAction<hostData>>,
) => {
  privateGateway
    .post(makeMyPass.eventHostCreate(eventId), {
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

export const updateEventHost = async (
  eventId: string,
  hostId: string,
  role: string,
  is_private: boolean,
  setHostData: Dispatch<React.SetStateAction<hostData>>,
  setHostList: Dispatch<React.SetStateAction<hostList[]>>,
) => {
  privateGateway
    .put(makeMyPass.host(eventId, hostId), {
      role: role,
      is_private: is_private,
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Host added successfully');
      setHostList((prevState) => [
        ...prevState.map((host) =>
          host.id == hostId ? { ...host, role: role, is_private: is_private } : host,
        ),
      ]);

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

export const removeEventHost = async (
  eventId: string,
  hostId: string,
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  privateGateway
    .delete(makeMyPass.host(eventId, hostId))
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Host removed successfully');
      setOpenDeleteModal(false);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};
