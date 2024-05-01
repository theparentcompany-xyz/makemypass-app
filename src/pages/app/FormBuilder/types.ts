export interface Field {
  id: string;
  type: string;
  title: string;
  hidden: boolean;
  unique: boolean;
  options: string[];
  property: object;
  required: boolean;
  condition: unknown[];
  field_key: string;
  team_field: boolean;
  description: string | null;
}
