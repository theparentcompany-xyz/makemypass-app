import { Dispatch } from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { EmailType } from '../pages/app/Guests/components/ViewGuest/types';

export const getAllMailLog = async (
  eventId: string,
  setAllMailLog: Dispatch<React.SetStateAction<EmailType[]>>,
) => {
  privateGateway
    .get(makeMyPass.getAllMailLog(eventId))
    .then((response) => {
      console.log(response.data.response);
      setAllMailLog(response.data.response);
    })
    .catch((error) => {
      console.log(error);
    });
};
