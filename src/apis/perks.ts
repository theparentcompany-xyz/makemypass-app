import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { formatDate } from '../common/commonFunctions';
import { TicketPerkType } from '../pages/app/CheckIns/pages/Perks/types';
import { LogType } from '../pages/app/CheckIns/pages/Venue/Venue';

export const getScanPerkList = async (
  eventId: string,
  setAvailablePerks: Dispatch<SetStateAction<TicketPerkType[]>>,
) => {
  privateGateway
    .get(makeMyPass.scanGuestPerkList(eventId))
    .then((response) => {
      setAvailablePerks(response.data.response.perks);
    })
    .catch(() => {
      toast.error('Failed to get perks');
    });
};

export const claimUserPerk = async (
  eventId: string,
  ticketId: string,
  perkId: string,
  setScanLogs: Dispatch<SetStateAction<LogType[]>>,
  setChecking: Dispatch<SetStateAction<boolean>>,
  setTrigger: Dispatch<SetStateAction<boolean>>,
  setExhaustHistory: Dispatch<SetStateAction<string[]>>,
) => {
  privateGateway
    .post(makeMyPass.scanGuestPerkClaim(eventId), {
      ticket_code: ticketId,
      perk_id: perkId,
    })
    .then((response) => {
      setChecking(false);
      setTrigger(false);
      if (setScanLogs)
        setScanLogs((prev) => [
          ...prev,
          {
            message: `${response.data.response.message}`,
            timestamp: formatDate(new Date().toString(), true),
            hasError: false,
          },
        ]);
      toast.success(response.data.message.general[0]);
    })
    .catch((error) => {
      setChecking(false);
      setTrigger(false);
      if (setScanLogs)
        setScanLogs((prev) => [
          ...prev,
          {
            message: ` ${error.response.data.response.message}`,
            timestamp: formatDate(new Date().toString(), true),
            hasError: true,
          },
        ]);
      if (setScanLogs && error.response.data.message.general) {
        setScanLogs((prev) => [
          ...prev,
          {
            message: ` ${error.response.data.message.general[0]}`,
            timestamp: formatDate(new Date().toString(), true),
            hasError: true,
          },
        ]);
      }
      if (error.response.data.response.history) {
        setExhaustHistory(error.response.data.response.history);
      }
      toast.error(error.response.data.response.message);
    });
};
