export type PaymentAnalyticsType = {
  user_name: string;
  amount: number;
  currency: string;
  platform_charge: number;
  gateway_charge: number;
  payment_gateway: string;
  payment_method: string;
  payment_id: string;
  status: string;
  is_cash_in_hand: boolean;
  created_at: string;
};
