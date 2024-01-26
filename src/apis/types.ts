export type Event = {
  id: string;
  title: string;
  members: number;
  logo: string | null;
  date: string;
  day: string;
};

export type hostList = {
  id: string;
  name: string | null;
  email: string;
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
