export type SubEventCRUDType = {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  place: string;
  location: string | null;
  capacity: null | number;
  price: number;
  currency: string;
  approval_required: boolean;
  active: boolean;
  platform_fee: number;
  gateway_fee: number;
};
