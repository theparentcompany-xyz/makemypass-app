import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import type { Gift, GiftsType } from '../pages/app/Gifts/types';

export const getGuestGiftList = async (
  eventId: string,
  ticketCode: string,
  setGifts: Dispatch<SetStateAction<GiftsType>>,
) => {
  privateGateway
    .post(makeMyPass.scanGuestGiftList(eventId), {
      ticket_code: ticketCode,
    })
    .then((response) => {
      setGifts({
        claimedGifts: response.data.response.claimed_gifts,
        unclaimedGifts: response.data.response.unclaimed_gifts,
      });
    });
};

export const claimUserGift = (
  eventId: string,
  selectedGift: Gift,
  ticketCode: string,
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    privateGateway
      .post(makeMyPass.scanGuestGiftClaim(eventId), {
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
