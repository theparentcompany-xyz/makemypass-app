import { Dispatch, SetStateAction } from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { Gift, GiftsType } from '../pages/app/Gifts/types';
import toast from 'react-hot-toast';

export const getUserGitfs = async (
  eventId: string,
  ticketCode: string,
  setGifts: Dispatch<SetStateAction<GiftsType>>,
) => {
  privateGateway
    .post(makeMyPass.listUserGifts(eventId), {
      ticket_code: ticketCode,
    })
    .then((response) => {
      setGifts({
        claimedGifts: response.data.response.claimed_gifts,
        unclaimedGifts: response.data.response.unclaimed_gifts,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const claimUserGift = (
  eventId: string,
  selectedGift: Gift,
  ticketCode: string,
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    privateGateway
      .post(makeMyPass.claimUserGift(eventId), {
        gift_id: selectedGift.id,
        ticket_code: ticketCode,
        gift_name: selectedGift.name,
      })
      .then((response) => {
        toast.success(response.data.message.general[0]);
        resolve();
      })
      .catch(() => {
        toast.error("Couldn't claim gift");
        reject();
      });
  });
};
