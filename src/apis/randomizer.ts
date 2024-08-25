import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { Dispatch, SetStateAction } from 'react';
import { userListType } from '../pages/app/Randomizer/types';

export const getSpinWheelUserList = async (
  eventId: string,
  setUserList: Dispatch<SetStateAction<userListType[]>>,
) => {
  privateGateway
    .get(makeMyPass.spinWheelList(eventId))
    .then((response) => {
      console.log(response.data.response);

      setUserList(response.data.response.participant);
    })
    .catch(() => {
      toast.error('Failed to get perks');
    });
};

export const createSpinWheelLog = async (eventId: string, userId: string) => {
  privateGateway
    .post(makeMyPass.spinWheelLogCreate(eventId), {
      event_register_id: userId,
    })
    .then(() => {
      toast.success('Log created successfully');
    })
    .catch(() => {
      toast.error('Failed to create log');
    });
};
