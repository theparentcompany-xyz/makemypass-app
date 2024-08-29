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
        max_no_of_files: number;
        max_length?: number;
        min_length?: number;
      }
    | { [key: string]: never };
  required: boolean;
  conditions: {
    field: string;
    operator: string;
    value: string | string[];
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

export enum DefaultFieldTypes {
  Name = 'name',
  Email = 'email',
  Phone = 'phone',
  Category = 'category',
  Organization = 'organization',
  Referral = 'referral',
  District = 'district',
  TeamId = 'team_id',
}

export type ErrorResponse = {
  [key: string]: string[];
};
