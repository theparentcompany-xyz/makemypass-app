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
