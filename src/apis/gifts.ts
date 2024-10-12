import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import type { Gift, GiftsType } from '../pages/app/Gifts/types';
import { spinWheelType } from '../pages/app/Spinwheel/types';

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

export const getSpinWheelData = (
  eventId: string,
  ticketCode: string,
  setValidatedTicket: Dispatch<SetStateAction<boolean>>,
  setSpinWheelData: Dispatch<SetStateAction<spinWheelType[] | undefined>>,
) => {
  privateGateway
    .post(makeMyPass.getSpinWheelData(eventId), {
      ticket_code: ticketCode,
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Ticket Validated');
      setValidatedTicket(true);
      setSpinWheelData(response.data.response.gifts);
    })
    .catch((err) => {
      toast.error(err?.response?.data.message.general[0]);
      console.error(err);
    });
};

export const spinTheWheel = (
  eventId: string,
  ticketCode: string,
  spinWheelData: spinWheelType[] | undefined,
  setPrizeNumber: Dispatch<SetStateAction<number | undefined>>,
  setSpin: Dispatch<SetStateAction<boolean>>,
) => {
  privateGateway
    .post(makeMyPass.getSpinWheelGift(eventId), {
      ticket_code: ticketCode,
    })
    .then((response) => {
      setPrizeNumber(
        spinWheelData?.findIndex((gift) => {
          if (gift.id == response.data.response.id) {
            return true;
          }
        }),
      );
      setSpin(true);
    })
    .catch((err) => {
      toast.error(err?.response?.data.message.general[0]);
      console.error(err);
    });
};
