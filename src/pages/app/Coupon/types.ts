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
  value: number;
  tickets: string[];
  description: string;
  active: boolean;
  conditions: string;
  [key: string]: string | number | boolean | string[];
};
