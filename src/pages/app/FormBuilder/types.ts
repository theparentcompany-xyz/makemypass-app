export interface Field {
  id: string;
  type: string;
  title: string;
  hidden: boolean;
  unique: boolean;
  options: string[];
  property: object;
  required: boolean;
  condition: {
    field: string;
    condition: string;
    value: string;
  }[];
  field_key: string;
  team_field: boolean;
  description: string | null;
}
