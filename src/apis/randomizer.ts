import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { Dispatch, SetStateAction } from 'react';
import { SpinWheelLogList, userListType } from '../pages/app/Randomizer/types';

export const getSpinWheelUserList = async (
  eventId: string,
  setUserList: Dispatch<SetStateAction<userListType[]>>,
  setHasLoaded: Dispatch<SetStateAction<boolean>>,
) => {
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
  eventId: string,

  setLogList: Dispatch<SetStateAction<SpinWheelLogList[]>>,
) => {
  privateGateway
    .post(makeMyPass.spinWheelLogList(eventId))
    .then((response) => {
      toast.success('Log created successfully');
      setLogList((prev) => [...prev, response.data.response]);
    })
    .catch(() => {
      toast.error('Failed to create log');
    });
};

export const getSpinWheelLogList = async (
  eventId: string,
  setLogList: Dispatch<SetStateAction<SpinWheelLogList[]>>,
) => {
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
