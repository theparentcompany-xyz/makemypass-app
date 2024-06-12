import { ReactNode } from 'react';

export const fieldMappings = {
  BigText: 'textarea',
  SmallText: 'text',
  Dropdown: 'dropdown',
};

export type DiscountData = {
  discount_type: string;
  discount_value: number;
  ticket: string[];
};

export type CouponData = {
  status: boolean;
  description: string;
  value?: string;
  error?: string;
};

type TicketType = {
  currency: ReactNode;
  id: string;
  price: number;
  perks: {
    [key: string]: number;
  };
  limit: number | null;
  slots_left: number;
  default_selected: boolean;
  platform_fee: number;
  platform_fee_from_user: boolean;
  entry_date: {
    date: string;
    capacity: number;
    price: number;
  }[];
};

export type TicketOptions = {
  [key: string]: TicketType;
};

export type Tickets = {
  ticket_id: string;
  count: number;
  my_ticket: boolean;
};

export type successModalProps = {
  showModal: boolean;
  ticketCode: string;
  email?: string;
  eventTitle?: string;
};
