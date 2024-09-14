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

  metadata: Metadata;
};

export type Metadata = {
  browser: {
    'Page view': Record<string, number>;
    Register: Record<string, number>;
  };
  device_type: {
    'Page view': Record<string, number>;
    Register: Record<string, number>;
  };
  operating_system: {
    'Page view': Record<string, number>;
    Register: Record<string, number>;
  };
  city: {
    'Page view': Record<string, number>;
    Register: Record<string, number>;
  };
  region: {
    'Page view': Record<string, number>;
    Register: Record<string, number>;
  };
  country: {
    'Page view': Record<string, number>;
    Register: Record<string, number>;
  };
  location: {
    'Page view': Record<string, number>;
    Register: Record<string, number>;
  };
  locale: {
    'Page view': Record<string, number>;
    Register: Record<string, number>;
  };
};
