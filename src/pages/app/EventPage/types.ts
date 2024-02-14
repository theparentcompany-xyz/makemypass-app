type TicketType = {
  id: string;
  price: number;
  perks: {
    [key: string]: number;
  };
  limit: number | null;
  slots_left: number;
  default_selected: boolean;
  platform_fee: number;
  platform_fee_from_user: boolean;
};

export type TicketOptions = {
  [key: string]: TicketType;
};

export const fieldMappings = {
  BigText: 'textarea',
  SmallText: 'text',
  Dropdown: 'dropdown',
};

export type DiscountData = {
  discount_type: string;
  discount_value: number;
};
