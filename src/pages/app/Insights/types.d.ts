export type AnalyticsData = {
  analytics: {
    [date: string]: number;
  };
  total_reg: number;
  yesterday_reg: number;
  today_reg: number;
  today_category: {
    [category: string]: number;
  };
  week_count: number;
  category_percentages: {
    [category: string]: string;
  };
  district_percentages: {
    [district: string]: string;
  };
  venue_analytics: {
    [venue: string]: number;
  };
  payment_analytics: {
    paid_user_percentage: string;
    cash_in_hand_users: number;
    total_amount: number;
    platform_paid_users: number;
    with_drawable_amount: number;
    platform_paid_user_percent: number;
    total_cash_in_hand: number;
    online_paid_user_percentage: string;
    cash_in_hand_user_percent: string;
    total_paid_percentage: string;
    total_platform_payments: number;
    total_paid_users: number;
  };
  organisation_count: {
    [organisation: string]: string;
  };
  days_left: string;
  event_start_date: string;
  active_timeframe: {
    Morning: number;
    Night: number;
    Evening: number;
    Afternoon: number;
  };
  page_visit: {
    register_page: {
      total: number | null;
      yesterday: number | null;
      this_week: number | null;
      conversion_rate_vs_page_visit: number | null;
      total_unique: number | null;
    };
  };
  referral_analytics: {
    [key: string]: {
      count: number;
      amount: number;
    };
  };
  coupon_analytics: {
    [key: string]: {
      count: number;
      amount: number;
    };
  };
};

export interface Dataset {
  label: string;
  data: number[] | unknown[];
  borderColor: string | string[];
  backgroundColor: string | string[];
  borderWidth?: number;
}

export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface LineChartProps {
  data: ChartData;
  title: string;
}

export type utmDataType = {
  utm_source: {
    [key: string]: number;
  };
  utm_medium: {
    [key: string]: number;
  };
  utm_campaign: {
    [key: string]: number;
  };
  utm_term: {
    [key: string]: number;
  };
  utm_content: {
    [key: string]: number;
  };
};

export type LineBarData = {
  label: string;
  data: unknown;
  fill: boolean;
  backgroundColor: string;
  borderColor: string;
}[];
