export type Field = {
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
};

export type ErrorResponse = {
  [key: string]: string[];
};
