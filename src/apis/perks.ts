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

export const updatePerk = (eventId: string, ticketCode: string, userId: string, perkName: string) =>
  privateGateway
    .post(makeMyPass.updatePerk(eventId, ticketCode), {
      id: userId,
      perk_name: perkName,
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
