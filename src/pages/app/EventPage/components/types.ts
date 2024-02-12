export interface PaymentType {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: null | string;
  status: string;
  attempts: number;
  notes: string[];
  created_at: number;
}
