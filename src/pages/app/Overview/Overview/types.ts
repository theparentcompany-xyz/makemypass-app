export type recentRegistration = {
  id: string;
  registered_at: string;
  name: string;
  email: string;
  phonenumber: string;
  district: string;
  category: string;
  organization: string;
};

export type hostList = {
  id: string;
  name: string;
  email: string;
  role: string;
  is_private: boolean;
};

export type hostData = {
  email: string;
  role: string;
  id?: string;
  is_private: boolean;
};

export type hostId = {
  id: string;
  type: 'edit' | 'delete';
};
export type RegistrationDataType = {
  id: string;
  registered_at: string;
  check_in_date: string | null;
  submissions: {
    id: string;
    type: string;
    title: string;
    value: string | string[];
  }[];
  amount: number;
  ticket_count: number;
  event_approval_required: boolean;
  has_venues: boolean;
  ticket_code: string;
  is_approved: boolean;
  entry_date: string | null;
  invited_by: string;
  extra_ticket: number;
  is_checked_in: boolean;
  check_out_date: string | null;
  category: string;
  name: string;
  coupon_code: string;
  bought_by: {
    id: string;
    name: string;
  };
  consumed_by: {
    id: string;
    name: string;
  }[];
};
