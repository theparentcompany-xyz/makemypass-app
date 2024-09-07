import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { SpinWheelLogList, userListType } from '../pages/app/Randomizer/types';

export const getSpinWheelUserList = async (
  setUserList: Dispatch<SetStateAction<userListType[]>>,
  setHasLoaded: Dispatch<SetStateAction<boolean>>,
) => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  privateGateway
    .get(makeMyPass.spinWheelList(eventId))
    .then((response) => {
      setUserList(response.data.response.participants);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0]);
    })
    .finally(() => {
      setHasLoaded(true);
    });
};

export const createSpinWheelLog = async (
  setLogList: Dispatch<SetStateAction<SpinWheelLogList[]>>,
  setResult: Dispatch<SetStateAction<{ name: string; id: string }>>,
) => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  privateGateway
    .post(makeMyPass.spinWheelLogList(eventId))
    .then((response) => {
      setLogList((prev) => [...prev, response.data.response]);
      setResult({
        name: response.data.response.name,
        id: response.data.response.id,
      });
    })
    .catch(() => {
      toast.error('There was an error while spinning, please try again');
    });
};

export const getSpinWheelLogList = async (
  setLogList: Dispatch<SetStateAction<SpinWheelLogList[]>>,
) => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  privateGateway
    .get(makeMyPass.spinWheelLogList(eventId))
    .then((response) => {
      setLogList(response.data.response.participants);
    })
    .catch(() => {
      toast.error('Failed to get logs');
    });
};

export const checkSpinWheelPickUser = async (
  eventId: string,
  setShowPicket: Dispatch<SetStateAction<boolean>>,
) => {
  privateGateway
    .get(makeMyPass.spinWheelCheckPickUser(eventId))
    .then((response) => {
      setShowPicket(response.data.response.is_random_user);
    })
    .catch(() => {
      toast.error('Failed to get logs');
    });
};
