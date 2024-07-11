export interface Field {
  id: string;
  type: string;
  title: string;
  hidden: boolean;
  unique: number;
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

export interface ChangeType {
  showModal: boolean;
  currentType: string;
  fieldId: string;
}

export enum FieldType {
  Text = 'text',
  Email = 'email',
  PhoneNumber = 'phonenumber',
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
