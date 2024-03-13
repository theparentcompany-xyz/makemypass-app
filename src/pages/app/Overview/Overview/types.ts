export type recentRegistration = {
  id: string;
  registered_at: string;
  name: string;
  email: string;
  phone_number: string;
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
