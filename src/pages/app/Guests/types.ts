export type guests = {
  id: string;
  registered_at: string;
  name: string;
  email: string;
  phone_number: string;
  district: string;
  category: string;
  organization: string;
};

export type resentTicket = {
  status: boolean;
  name: string;
  guestId: string;
};
