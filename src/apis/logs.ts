import { Dispatch } from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { EmailType } from '../pages/app/Guests/components/ViewGuest/types';

export const getAllMailLog = async (
  eventId: string,
  setAllMailLog: Dispatch<React.SetStateAction<EmailType[]>>,
) => {
  privateGateway.get(makeMyPass.mailLog(eventId)).then((response) => {
    setAllMailLog(response.data.response);
  });
};
