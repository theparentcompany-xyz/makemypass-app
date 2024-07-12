export interface Field {
  id: string;
  type: FieldType;
  title: string;
  hidden: boolean;
  unique: number | null;
  options: string[];
  property: {
    extension_types: string[];
    max_size: number;
    is_multiple: boolean;
  } | { [key: string]: never };
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
  Text = 'text',
  LongText = 'textarea',
  Email = 'email',
  Phone = 'phone',
  SingleSelect = 'singleselect',
  MultiSelect = 'multiselect',
  Radio = 'radio',
  Checkbox = 'checkbox',
  Number = 'number',
  DateTime = 'datetime',
  Date = 'date',
  Time = 'time',
  Rating = 'rating',
  File = 'file',
}
