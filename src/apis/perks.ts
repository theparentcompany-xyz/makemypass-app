import { Dispatch } from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';

// export const getPerksInfo = (eventId: string, setPerks: any) =>
//   privateGateway
//     .get(makeMyPass.getPerksInfo(eventId))
//     .then((response) => {
//       const data = response.data.response;
//       const perkNames = [];

//       for (const key in data) {
//         const perks = data[key].perks;
//         for (const perk in perks) {
//           perkNames.push(perk);
//         }
//       }
//       console.log(perkNames);
//       setPerks(perkNames);
//     })
//     .catch((error) => {
//       throw error;
//     });

export const getUserPerksInfo = (ticketCode: string) =>
  privateGateway
    .get(makeMyPass.getUserPerksInfo(ticketCode))
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });

export const updatePerk = (
  ticketId: string,
  selectedPerk: string,
  setMessage: Dispatch<React.SetStateAction<string>>,
  setIsError: Dispatch<React.SetStateAction<boolean>>,
) =>
  privateGateway
    .put(makeMyPass.updatePerk(ticketId), {
      perk_name: selectedPerk,
    })
    .then((response) => {
      setMessage(response.data.message.general[0]);
    })
    .catch((error) => {
      setIsError(true);
      setMessage(error.response.data.message.general[0]);
    })
    .finally(() => {
      setTimeout(() => {
        setMessage('');
      }, 1500);
    });
