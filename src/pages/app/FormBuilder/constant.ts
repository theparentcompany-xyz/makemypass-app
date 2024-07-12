import { IconType } from 'react-icons/lib';
import {
  MdTextFields,
  MdEmail,
  MdPhone,
  MdArrowDropDown,
  MdSubject,
  MdRadioButtonChecked,
  MdAttachFile,
  MdCalendarToday,
  MdAccessTime,
  Md123,
  MdStar,
  MdCheckBox,
} from 'react-icons/md';
import { FieldType } from './types.ts';

export interface ConditionType {
  value: string;
  label: string;
}

export function getConditions(type: string): ConditionType[] {
  switch (type) {
    case FieldType.Text:
    case FieldType.Email:
    case FieldType.Phone:
    case FieldType.SingleSelect:
    case FieldType.LongText:
    case FieldType.MultiSelect:
    case FieldType.Radio:
      return conditions.filter((condition) =>
        ['=', '!=', 'in', 'not in', 'empty', 'not empty', 'contains', 'not contains'].includes(
          condition.value,
        ),
      );
    case FieldType.Number:
      return conditions.filter((condition) =>
        ['=', '!=', 'in', 'not in', 'empty', 'not empty', '>', '>=', '<', '<='].includes(
          condition.value,
        ),
      );
    case FieldType.Date:
    case FieldType.DateTime:
    case FieldType.Time:
      return conditions.filter((condition) =>
        ['=', '!=', '>', '>=', '<', '<='].includes(condition.value),
      );
    case FieldType.File:
    case FieldType.Rating:
    case FieldType.Checkbox:
      return conditions.filter((condition) =>
        ['=', '!=', 'empty', 'not empty'].includes(condition.value),
      );
    default:
      return [];
  }
}

export const conditions = [
  {
    value: '=',
    label: 'Equal',
  },
  {
    value: '!=',
    label: 'Not Equal',
  },
  {
    value: 'in',
    label: 'In',
  },
  {
    value: 'not in',
    label: 'Not In',
  },
  {
    value: 'empty',
    label: 'Empty',
  },
  {
    value: 'not empty',
    label: 'Not Empty',
  },
  {
    value: 'contains',
    label: 'Contains',
  },
  {
    value: 'not contains',
    label: 'Not Contains',
  },
  {
    value: '>',
    label: 'Greater Than',
  },
  {
    value: '>=',
    label: 'Greater Than and Equal',
  },
  {
    value: '<',
    label: 'Less Than',
  },
  {
    value: '<=',
    label: 'Less Than and Equal',
  },
];

export const IconsMapping: Record<FieldType, IconType> = {
  [FieldType.Text]: MdTextFields,
  [FieldType.Email]: MdEmail,
  [FieldType.Phone]: MdPhone,
  [FieldType.SingleSelect]: MdArrowDropDown,
  [FieldType.LongText]: MdSubject,
  [FieldType.MultiSelect]: MdArrowDropDown,
  [FieldType.Radio]: MdRadioButtonChecked,
  [FieldType.File]: MdAttachFile,
  [FieldType.Date]: MdCalendarToday,
  [FieldType.DateTime]: MdCalendarToday,
  [FieldType.Time]: MdAccessTime,
  [FieldType.Number]: Md123,
  [FieldType.Rating]: MdStar,
  [FieldType.Checkbox]: MdCheckBox,
};

export const HexColors: Record<FieldType, string> = {
  [FieldType.Text]: '#DE3163',
  [FieldType.Email]: '#BB2DC7',
  [FieldType.Phone]: '#325FFA',
  [FieldType.SingleSelect]: '#682FFF',
  [FieldType.LongText]: '#CC62D5',
  [FieldType.MultiSelect]: '#325FFA',
  [FieldType.Radio]: '#EC660D',
  [FieldType.File]: '#07A460',
  [FieldType.Date]: '#D19D20',
  [FieldType.DateTime]: '#939597',
  [FieldType.Time]: '#325FFA',
  [FieldType.Number]: '#E83B47',
  [FieldType.Rating]: '#DE3163',
  [FieldType.Checkbox]: '#BB2DC7',
};


export const FileExtensions = [
  { value: '.csv', label: '.csv' },
  { value: '.pdf', label: '.pdf' },
  { value: '.doc', label: '.doc' },
  { value: '.docx', label: '.docx' },
  { value: '.jpg', label: '.jpg' },
  { value: '.png', label: '.png' },
  { value: '.jpeg', label: '.jpeg' },
  { value: '.gif', label: '.gif' },
  { value: '.xlsx', label: '.xlsx' },
  { value: '.ppt', label: '.ppt' },
  { value: '.pptx', label: '.pptx' },
  { value: '.csv', label: '.csv' },
  { value: '.txt', label: '.txt' },
  { value: '.zip', label: '.zip' },
  { value: '.rar', label: '.rar' },
  { value: '.tar', label: '.tar' },
  { value: '.gz', label: '.gz' },
  { value: '.7z', label: '.7z' },
];
