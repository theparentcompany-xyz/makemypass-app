import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { formatDate } from '../common/commonFunctions';
import { LogType } from '../pages/app/CheckIns/pages/Venue/Venue';
import { SelfCheckInData } from '../pages/app/SelfCheckIn/types';

export const getPrintData = async (
  eventId: string,
  ticketCode: string,
  setPrintData: Dispatch<SetStateAction<SelfCheckInData>>,
  setScanLogs: Dispatch<SetStateAction<LogType[]>>,
  setChecking: Dispatch<SetStateAction<boolean>>,
  setTrigger: Dispatch<SetStateAction<boolean>>,
) => {
  if (ticketCode.length > 0)
    privateGateway
      .post(makeMyPass.scanGuestPrint(eventId), {
        ticket_code: ticketCode,
      })
      .then((response) => {
        setPrintData(response.data.response);
      })
      .catch((error) => {
        toast.error(error.response.data.message.general[0] || 'Unable to process the request');

        setScanLogs((prev) => [
          ...prev,
          {
            message: ` ${error.response.data.message.general[0]}`,
            timestamp: formatDate(new Date().toString(), true),
            hasError: true,
          },
        ]);
      })
      .finally(() => {
        if (setChecking) {
          setChecking(false);
        }

        if (setTrigger) {
          setTrigger(false);
        }
      });
};
