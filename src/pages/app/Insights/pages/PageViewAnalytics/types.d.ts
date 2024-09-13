export type AnalyticsData = {
  page_to_reg_total: {
    page_visits_graph: {
      [date: string]: number;
    };
    reg_graph: {
      [date: string]: number;
    };
  };
  utm: {
    source: {
      'Page view': {
        [source: string]: number;
      };
      Register: {
        [source: string]: number;
      };
    };
    medium: {
      'Page view': {
        [medium: string]: number;
      };
      Register: {
        [medium: string]: number;
      };
    };
    campaign: {
      'Page view': {
        [campaign: string]: number;
      };
      Register: {
        [campaign: string]: number;
      };
    };
    content: Record<string, never>;
    term: Record<string, never>;
  };
};
