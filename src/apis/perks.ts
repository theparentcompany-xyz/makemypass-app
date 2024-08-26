import { Dispatch, SetStateAction } from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import toast from 'react-hot-toast';
import { TicketPerkType } from '../pages/app/CheckIns/pages/Perks/types';
import { LogType } from '../pages/app/CheckIns/pages/Venue/Venue';
import { formatDate } from '../common/commonFunctions';

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
            message: `${response.data.message.general[0]}`,
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
            message: ` ${error.response.data.message.general[0]}`,
            timestamp: formatDate(new Date().toString(), true),
            hasError: true,
          },
        ]);
      toast.error(error.response.data.message.general[0]);
    });
};
