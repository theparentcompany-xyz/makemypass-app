export interface Field {
  id: string;
  type: string;
  title: string;
  hidden: boolean;
  unique: boolean;
  options: string[];
  property: object;
  required: boolean;
  conditions: {
    field: string;
    operator: string;
    value: string;
  }[];
  field_key: string;
  team_field: boolean;
  description: string | null;
}
