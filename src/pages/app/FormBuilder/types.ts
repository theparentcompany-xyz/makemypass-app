export interface Field {
  id: string;
  type: FieldType;
  title: string;
  hidden: boolean;
  unique: number | null;
  options: string[];
  property:
    | {
        extension_types: string[];
        max_size: number;
        is_multiple: boolean;
      }
    | { [key: string]: never };
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

export enum FieldType {
  'text' = 'Text',
  'textarea' = 'TextArea',
  'email' = 'Email',
  'phone' = 'PhoneNumber',
  'singleselect' = 'SingleSelect',
  'multiselect' = 'MultiSelect',
  'radio' = 'Radio',
  'checkbox' = 'Checkbox',
  'number' = 'Number',
  'datetime' = 'DateTime',
  'date' = 'Date',
  'time' = 'Time',
  'rating' = 'Rating',
  'file' = 'File',
}
