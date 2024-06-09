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
  name: string | string[];
  guestId: string | string[];
};

export type SelectedGuest = {
  id: string | string[];
  type: string | string[];
};

interface Condition {
  field: string;
  value: string;
  operator: string;
}

export interface FormField {
  id: string;
  type: string;
  title: string;
  hidden: boolean;
  unique: boolean;
  options: string[];
  property: Record<string, any>;
  required: boolean;
  field_key: string;
  conditions: Condition[];
  team_field: boolean;
  description: string | null;
}

interface TicketCondition {
  field: string;
  value: string;
  operator: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string | null;
  show_price: string | null;
  price: number;
  perks: Record<string, any>;
  slots_left: number;
  default_selected: boolean;
  platform_fee: number;
  platform_fee_from_user: boolean;
  conditions: TicketCondition[];
  currency: string;
  entry_date: string[];
}

interface Coupon {
  status: boolean;
  description: string;
}

export interface FormEventData {
  form: FormField[];
  tickets: Ticket[];
  select_multi_ticket: boolean;
  is_sub_event: boolean;
  coupon: Coupon;
}
