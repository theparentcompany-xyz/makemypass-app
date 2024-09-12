export type AnalyticsData = {
  page_to_reg_total: {
    page_visits_graph: {
      [date: string]: number;
    };
    reg_graph: {
      [date: string]: number;
    };
  };
  utm_source: {
    'Page view': {
      [source: string]: number;
    };
    Register: {
      [source: string]: number;
    };
  };
  utm_medium: {
    'Page view': {
      [medium: string]: number;
    };
    Register: {
      [medium: string]: number;
    };
  };
  utm_campaign: {
    'Page view': {
      [campaign: string]: number;
    };
    Register: {
      [campaign: string]: number;
    };
  };
  utm_content: Record<string, never>;
  utm_term: Record<string, never>;
};
