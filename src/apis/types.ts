export type Event = {
  id: string;
  title: string;
  members: number;
  logo: string | null;
  date: string;
  day: string;
  name: string;
};

export type hostList = {
  id: string;
  name: string;
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

export type FormField = {
  id: string;
  type: string;
  title: string;
  required: boolean;
  field_key: string;
  options?: string[];
  integration?: {
    url: string;
    method: string;
  };
};

export type FormData = {
  [key: string]: string;
};
