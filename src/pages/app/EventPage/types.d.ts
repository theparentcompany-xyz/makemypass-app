import { ReactNode } from 'react';

export const fieldMappings = {
  BigText: 'textarea',
  SmallText: 'text',
  Dropdown: 'dropdown',
};

export type DiscountData = {
  discount_type: string;
  discount_value: number;
  ticket: {
    id: string;
    name: string;
  }[];
};

export type CouponData = {
  status: boolean;
  description: string;
  value?: string;
  error?: string;
  public_coupon?: string[];
};

type TicketType = {
  currency: ReactNode;
  id: string;
  price: number;
  perks: {
    [key: string]: number;
  };
  limit: number | null;
  capacity: number;
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

export type SuccessModalProps = {
  showModal: boolean;
  eventTitle?: string;
  eventRegisterId?: string;
  followupMessage?: string;
  is_approved?: string;
  show_sub_event?: boolean;
  loading?: boolean;
  eventId?: string;
  redirection?: {
    url: string;
    type: 'on_submit' | 'on_button_click';
  };
  newPage?: boolean;
};

export type AudioControlsType = {
  showModal: boolean;
  transcribing: boolean;
  noData: boolean;
};

export type ClaimCodeExceedType = {
  exceeded: boolean;
  message: string;
};
