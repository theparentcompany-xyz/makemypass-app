import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';

export const getPerksInfo = (eventId: string, setPerks: any) =>
  privateGateway
    .get(makeMyPass.getPerksInfo(eventId))
    .then((response) => {
      console.log(response.data);
      setPerks(response.data.response);
    })
    .catch((error) => {
      throw error;
    });

export const getUserPerksInfo = (ticketCode: string) =>
  privateGateway
    .get(makeMyPass.getUserPerksInfo(ticketCode))
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });

export const updatePerk = (ticketId: string, currentTicketType: string, selectedPerk: string) =>
  privateGateway
    .put(makeMyPass.updatePerk(ticketId), {
      id: currentTicketType,
      perk_name: selectedPerk,
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
