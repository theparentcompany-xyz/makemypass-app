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
  payment_analytics: {
    paid_user_percentage: string;
    total_amount: number;
    total_paid_users: number;
    total_withdraw: number;
  };
  organisation_count: {
    [organisation: string]: string;
  };
  days_left: string;
  event_date: string;
  active_timeframe: {
    Morning: number;
    Night: number;
    Evening: number;
    Afternoon: number;
  };
  page_visit: {
    total: number | null;
    yesterday: number | null;
    this_week: number | null;
    conversion_rate_vs_page_visit: number | null;
    total_unique: number | null;
  };
  referral_analytics: {
    [key: string]: {
      count: number;
      amount: number;
    };
  };
};

export interface Dataset {
  label: string;
  data: number[];
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
