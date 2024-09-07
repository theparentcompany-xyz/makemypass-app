export type TableType = {
  is_approved: boolean;
  amount: number;
  check_in_date: string;
  phonenumber: string;
  id: string;
  name: string;
  email: string;
  category: string;
  date: string;
  is_private: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type TabType = {
  [key: string]: {
    backgroundColor: string;
    color: string;
  };
};
