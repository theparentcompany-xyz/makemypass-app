import { Dispatch } from 'react';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import type { EmailType } from '../pages/app/Guests/components/ViewGuest/types';

export const getEventMailLog = async (
  eventId: string,
  setAllMailLog: Dispatch<React.SetStateAction<EmailType[]>>,
) => {
  privateGateway.get(makeMyPass.mailLog(eventId)).then((response) => {
    setAllMailLog(response.data.response);
  });
};
