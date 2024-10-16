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
  userData?: {
    field_key: string;
    value: string;
    title: string;
    type: string;
  }[];
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

export type MapNewCode = {
  apiConfirmation: boolean;
  modalConfirmation: boolean;
  ticketCode: string;
};
