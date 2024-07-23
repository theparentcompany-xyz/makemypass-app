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
  submission: {
    [key: string]: string;
  };
  amount: number;
  ticket_count: number;
  ticket_code: string;
  is_approved: boolean;
  entry_date: string | null;
  invited_by: string;
  is_checked_in: boolean;
  check_out_date: string | null;
  category: string;
  name: string;
};
