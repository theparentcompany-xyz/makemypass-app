export type GuestsType = {
  id: string;
  registered_at: string;
  name: string;
  email: string;
  phone_number: string;
  district: string;
  category: string;
  organization: string;
};

export type ResentTicket = {
  status: boolean;
  name: string;
  guestId: string;
};

export type SelectedGuest = {
  id: string;
  type: string;
};
