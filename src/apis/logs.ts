import { Dispatch } from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';

export const getAllMailLog = async (
  eventId: string,
  setAllMailLog: Dispatch<React.SetStateAction<boolean>>,
) => {
  privateGateway
    .get(makeMyPass.getAllMailLog(eventId))
    .then((response) => {
      console.log(response.data.response);
      setAllMailLog(true);
    })
    .catch((error) => {
      console.log(error);
      setAllMailLog(true);
    });
};
