type TicketType = {
  id: string;
  price: number;
  perks: {
    [key: string]: number;
  };
  limit: number | null;
  slots_left: number;
  default_selected: boolean;
};

export type TicketOptions = {
  [key: string]: TicketType;
};
