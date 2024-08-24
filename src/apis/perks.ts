import { Dispatch, SetStateAction } from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { perkType } from '../pages/app/EventGlance/components/ManageTickets/types';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

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
  ticketPerks: perkType[],
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
        updatedPerks.push({ id: '', name: '', count: 0, ticket_id: ticketId });
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
  setPerks: Dispatch<SetStateAction<perkType[]>>,
) => {
  privateGateway
    .put(makeMyPass.perk(eventId, ticketId, perkId), {
      name,
      count,
    })
    .then((response) => {
      setPerks(response.data.response.perks);
    })
    .catch(() => {
      setPerks([]);
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
