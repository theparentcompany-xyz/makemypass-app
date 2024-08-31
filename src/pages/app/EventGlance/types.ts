export type UTMDataType = {
  showUTM: boolean;
  data: {
    source: string[];
    medium: string[];
    campaign: string[];
    term: string[];
    content: string[];
  };
  selectedData: {
    source: string;
    medium: string;
    campaign: string;
    term: string;
    content: string;
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
