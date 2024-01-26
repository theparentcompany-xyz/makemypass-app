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
  name: string | null;
  email: string;
  role: string;
};
