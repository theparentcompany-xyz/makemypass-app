export type tableType = {
  id: string;
  registered_at: string;
  name: string;
  email: string;
  phonenumber: string;
  district: string;
  category: string;
  organization: string;
};

export type checkInButtonsType = {
  checkin: boolean;
  checkout: boolean;
  venues: boolean;
  gift: boolean;
  sub_events: boolean;
  perk: boolean;
};
