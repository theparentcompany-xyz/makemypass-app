interface CouponType {
  id: string;
  description: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  tickets: string[];
  active: boolean;
  created_at: string;
}

export default CouponType;

export type CreateCouponType = {
  code: string;
  type: 'percentage' | 'amount';
  value: number;
  tickets: string[];
  description: string;
  is_active: boolean;
  count: number;
  is_private: boolean;
  conditions: {
    field: string;
    value: string;
    operator: string;
  }[];
  [key: string]: any;
};
