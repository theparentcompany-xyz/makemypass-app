export type User = {
  name: string;
  email: string;
  phone: string;
  district: string;
  organization: string;
  category: string;
};

export type multipleTicketCount = {
  userName?: string;
  entryDate?: string;
  hasMultipleTickets: boolean;
  tickets?: Ticket[];
  userData?: { [key: string]: string };
};

export type Ticket = {
  ticket_id: string;
  ticket_name: string;
  total_count: number;
  remaining_count: number;
  checked_in_count?: number;
};

export type RoomType = {
  roomNumber: string;
  showModel: boolean;
};
