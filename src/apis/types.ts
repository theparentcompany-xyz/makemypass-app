import { ReactNode } from 'react';

export type Event = {
  id: string;
  title: string;
  banner: string | null;
  members: number;
  logo: string | null;
  name: string;
  event_start_date: string;
  event_end_date: string;
  is_private: boolean;
  shortlist: boolean;
  place: string | null;
  location: string | null;
  status: string;
  tags: string[];
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
  unique: number;
  required: boolean;
  field_key: string;
  description?: string;
  options?: string[];
  validate?: boolean;
  integration?: {
    url: string;
    method: string;
  };
  property?: {
    file_size: number;
    extension_types: string[];
    max_no_of_files: number;
    is_multiple: boolean;
    max_size: number;
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
  is_active: boolean;
  description: string;
  approval_required: boolean;
  allowed_dates: string[];
  code_prefix: string;
  code_digits: number;
  maintain_code_order?: boolean;
  id: string;
  price: number;
  show_price?: number;
  perks: {
    id: string;
    name: string;
    count: number;
  }[];
  registration_count: number;
  user_count: number;
  capacity: number | null;
  default_selected: boolean;
  platform_fee: number;
  gateway_fee: number;
  platform_fee_from_user: boolean;
  currency: string;
  category: string;
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
  capacity?: number;
  is_grouped_ticket: boolean;
  is_multiple_checkin: boolean;
  thank_you_new_page: boolean;
  is_private: boolean;
  is_team: boolean;
  is_checkout: boolean;
  show_ticket_first: boolean;
  approval_required: boolean;
  err_message: ReactNode;
  id: string;
  name: string;
  title: string;
  description: string;
  event_start_date: string;
  event_end_date: string;
  reg_start_date: string;
  reg_end_date: string;
  followup_msg: string;
  is_online: boolean;
  logo: string | File;
  banner: string | File;
  location: LocationType;
  place: string;
  claim_code_message: string;
  claim_ticked_id: string;
  already_bought: boolean;
  hosts: HostType[];
  form: FormFieldType[];
  tickets: TicketType[];
  shortlist: boolean;
  coupon: CouponType;
  parse_audio: boolean;
  select_multi_ticket?: boolean;
  is_sub_event: boolean;
  is_random_user: boolean;
  status: string;
  is_scratch_card: boolean;
  need_confirmation: boolean;
  confirmation_fields: string[];
  speakers?: {
    name: string;
    image: string;
    position: string;
  }[];
  script_injection?: {
    type: string;
    value: string;
  }[];
  host_communicate: {
    email: string;
    phone: string;
    facebook: string;
    linkedin: string;
    twitter: string;
    whatsapp: string;
    instagram: string;
  };
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

export type MailType = {
  attachments: string[];
  body: string;
  type_description: string;
  email_type: string;
  id: string;
  subject: string;
  type: string;
  updated_at: string;
};

export type listMailType = {
  id: string;
  type: string;
  subject: string;
};

export type ActivateCouponType = {
  showModal: boolean;
  active: boolean;
  description: string;
  isCouponActive: boolean;
};

export type VenueType = {
  id: string;
  name: string;
  count?: number;
};

export type VenueCRUDType = {
  showModal: boolean;
  venueList: VenueType[];
};

export type SpeakerType = {
  id: string;
  name: string;
  position: string;
  image: File | Blob | null | string;
};

export type SpeakerCRUDType = {
  showModal: boolean;
  speakerList: SpeakerType[];
};

//Reset Password Auth Type
export type AuthApiSuccessResponse = {
  hasError: boolean;
  statusCode: number;
  message: {
    general: string[];
  };
  response: {
    access_token: string;
    refresh_token: string;
  };
};

export type ApiErrorResponse = {
  hasError: boolean;
  statusCode: number;
  message: {
    general: string[];
    [key: string]: string[];
  };
  response: object;
};

export type PerkClaimedHourly = {
  [perkName: string]: {
    [date: string]: {
      [hour: string]: number;
    };
  };
};

export type EventPerkClaimedHourly = {
  [ticketName: string]: PerkClaimedHourly;
};

export type HourlyDataVenue = {
  [key: string]: {
    [date: string]: {
      [hour: string]: number;
    };
  };
};

export type AnalyticsData = {
  page_to_reg_total: {
    page_visits_graph: {
      [date: string]: number;
    };
    reg_graph: {
      [date: string]: number;
    };
  };
  utm: {
    source: {
      'Page view': {
        [source: string]: number;
      };
      Register: {
        [source: string]: number;
      };
    };
    medium: {
      'Page view': {
        [medium: string]: number;
      };
      Register: {
        [medium: string]: number;
      };
    };
    campaign: {
      'Page view': {
        [campaign: string]: number;
      };
      Register: {
        [campaign: string]: number;
      };
    };
    content: Record<string, never>;
    term: Record<string, never>;
  };

  metadata: Metadata;
};

type Metadata = {
  browser: {
    'Page view': Record<string, number>;
    Register: Record<string, number>;
  };
  device_type: {
    'Page view': Record<string, number>;
    Register: Record<string, number>;
  };
  operating_system: {
    'Page view': Record<string, number>;
    Register: Record<string, number>;
  };
  city: {
    'Page view': Record<string, number>;
    Register: Record<string, number>;
  };
  region: {
    'Page view': Record<string, number>;
    Register: Record<string, number>;
  };
  country: {
    'Page view': Record<string, number>;
    Register: Record<string, number>;
  };
  location: {
    'Page view': Record<string, number>;
    Register: Record<string, number>;
  };
  locale: {
    'Page view': Record<string, number>;
    Register: Record<string, number>;
  };
};

export type DefaultListType = {
  id: string;
  name: string;
};
