import { ReactNode } from 'react';

export type Event = {
  id: string;
  title: string;
  members: number;
  logo: string | null;
  date: string;
  day: string;
  name: string;
  start_day: string;
  start_date: string;
  event_start_date: string;
};

export type hostList = {
  id: string;
  name: string;
  email: string;
  is_private: boolean;
  role: string;
};

export type User = {
  name: string;
  email: string;
  phone: string;
  district: string;
  organization: string;
  category: string;
};

export type FormDataType = {
  [key: string]: string | string[];
};

export type ErrorMessages = {
  [key: string]: string[];
};

export type EventHosts = {
  profile_pic: string;
  id: string;
  name: string;
};

interface LocationType {
  lat: number;
  lng: number;
}

interface HostType {
  id: string;
  name: string;
  profile_pic: string;
}

export type FormFieldType = {
  id: string;
  type: string;
  title: string;
  hidden: boolean;
  unique: boolean;
  required: boolean;
  field_key: string;
  description?: string;
  options?: string[];
  integration?: {
    url: string;
    method: string;
  };
  property?: {
    file_size: number;
    extension_types: string[];
    max_no_of_files: number;
  };
  conditions?: {
    field: string;
    value: string;
    operator: string;
  }[];
};

export interface TicketType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  title: string;
  description: string;
  approval_required: boolean;
  code_prefix: string;
  code_digits: number;
  maintain_code_order: boolean;
  id: string;
  price: number;
  show_price?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  perks: any;
  slots_left: number | null;
  default_selected: boolean;
  platform_fee: number;
  platform_fee_from_user: boolean;
  currency: string;
  entry_date: {
    date: string;
    capacity: number;
    price: number;
    show_price?: number;
  }[];
  conditions?: {
    field: string;
    value: string;
    operator: string;
  }[];
}

interface CouponType {
  status: boolean;
  description: string;
  value?: string;
  error?: string;
}

export interface EventType {
  err_message: ReactNode;
  id: string;
  name: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  reg_start_date: string;
  reg_end_date: string;
  event_start_date: string;
  event_end_date: string;
  start_time: string;
  end_time: string;
  logo: string;
  banner: string;
  location: LocationType;
  place: string;
  hosts: HostType[];
  form: FormFieldType[];
  tickets: TicketType[];
  shortlist: boolean;
  coupon: CouponType;
  parse_audio?: boolean;
  select_multi_ticket?: boolean;
  capacity?: number;
  is_private: boolean;
  is_online: boolean;
  is_grouped_ticket: boolean;
  is_multiple_checkin: boolean;
  is_sub_event: boolean;
  approval_required: boolean;
  status: string;

  speakers?: {
    name: string;
    image: string;
    position: string;
  }[];
}

export type EventDetails = {
  id: string;
  banner: string;
  name: string;
  title: string;
  description: string | null;
  date: string;
  logo: string;
  time: string;
  hosts: EventHosts[];
  location: {
    lat: number;
    lng: number;
  };
  registered_members_count: number;
  is_private: boolean;
  shortlist: boolean;
  place: string;
  start_time: string;
  start_date: string;
  end_date: string;
  end_time: string;
};

export type FileType = {
  file_id: string;
  status: string;
  success_count: number;
  failure_count: number;
  total_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type PaymentDetails<T extends string> = {
  [key in `${T}_${string}`]: string;
} & {
  payment_id: string;
  order_id: string;
  signature: string;
};

export type RazorpayPaymentDetails = PaymentDetails<'razorpay'>;

export type PreviewData = {
  name: string;
  entry_date: string | null;
  tickets: {
    [key: string]: number;
  };
};

export type ConditionType = {
  field: string;
  value: string;
  operator: string;
};
