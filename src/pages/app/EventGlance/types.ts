export type UTMDataType = {
  showUTM: boolean;
  data: {
    utm_source: string[];
    utm_medium: string[];
    utm_campaign: string[];
    utm_term: string[];
    utm_content: string[];
  };
  selectedData: {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_term: string;
    utm_content: string;
  };
  addUTM: {
    type: keyof UTMDataType['data'] | '';
    value: string;
  };
  editUTM: {
    type: keyof UTMDataType['data'] | '';
    value: string;
    index: number;
  };
};
