export interface Gift {
  id: string;
  name: string;
}

export type GiftsType = {
  claimedGifts: Gift[];
  unclaimedGifts: Gift[];
};
