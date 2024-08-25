import { Dispatch, SetStateAction } from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { perkType } from '../pages/app/EventGlance/components/ManageTickets/types';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { TicketPerkType } from '../pages/app/CheckIns/pages/Perks/types';
import { LogType } from '../pages/app/CheckIns/pages/Venue/Venue';
import { formatDate } from '../common/commonFunctions';

export const getTicketPerkList = async (
  eventId: string,
  ticketId: string,
  setPerks: Dispatch<SetStateAction<perkType[]>>,
) => {
  privateGateway
    .get(makeMyPass.perkList(eventId, ticketId))
    .then((response) => {
      const perks = response.data.response.perks;
      const perksWithTicketId = perks.map((perk: perkType) => {
        return {
          ...perk,
          ticketId: ticketId,
        };
      });
      setPerks(perksWithTicketId);
    })
    .catch(() => {
      setPerks([]);
    });
};

export const createPerk = async (
  eventId: string,
  ticketId: string,
  name: string,
  count: number,
  setTicketPerks: Dispatch<SetStateAction<perkType[]>>,
) => {
  const perkId = uuidv4();
  privateGateway
    .post(makeMyPass.createPerk(eventId, ticketId), {
      id: perkId,
      name,
      count,
    })
    .then(() => {
      setTicketPerks((prevPerks) => {
        const updatedPerks = [...prevPerks];
        const lastPerkWithUpdatedId = { ...updatedPerks.pop() };
        lastPerkWithUpdatedId.id = perkId;
        updatedPerks.push(lastPerkWithUpdatedId as perkType);
        updatedPerks.push({ id: '', name: '', count: 1, ticketId: ticketId });
        return updatedPerks;
      });

      toast.success('Perk created successfully');
    })
    .catch(() => {
      toast.error('Failed to create perk');
    });
};

export const updatePerk = async (
  eventId: string,
  ticketId: string,
  perkId: string,
  name: string,
  count: number,
  setTicketPerks: Dispatch<SetStateAction<perkType[]>>,
) => {
  privateGateway
    .put(makeMyPass.perk(eventId, ticketId, perkId), {
      name,
      count,
    })
    .then(() => {
      setTicketPerks((prevPerks) => {
        const updatedPerks = prevPerks.map((perk) => {
          if (perk.id === perkId) {
            return {
              ...perk,
              name,
              count,
              isEditing: false,
            };
          }
          return perk;
        });
        return updatedPerks;
      });
      toast.success('Perk updated successfully');
    })
    .catch(() => {
      toast.error('Failed to update perk');
    });
};

export const deletePerk = async (eventId: string, ticketId: string, perkId: string) => {
  privateGateway
    .delete(makeMyPass.perk(eventId, ticketId, perkId))
    .then(() => {
      toast.success('Perk deleted successfully');
    })
    .catch(() => {
      toast.error('Failed to delete perk');
    });
};

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
