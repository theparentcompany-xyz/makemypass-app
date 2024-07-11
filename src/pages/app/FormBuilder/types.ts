export interface Field {
  id: string;
  type: FieldType;
  title: string;
  hidden: boolean;
  unique: number | null;
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

export enum FieldType {
  Text = 'text',
  Email = 'email',
  PhoneNumber = 'phone',
  SingleSelect = 'singleselect',
  TextArea = 'textarea',
  MultiSelect = 'multiselect',
  Radio = 'radio',
  File = 'file',
  Date = 'date',
  DateTime = 'datetime',
  Time = 'time',
  Number = 'number',
  Rating = 'rating',
  Checkbox = 'checkbox',
}
