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
    case FieldType.text:
    case FieldType.email:
    case FieldType.phone:
    case FieldType.singleselect:
    case FieldType.textarea:
    case FieldType.multiselect:
    case FieldType.radio:
      return conditions.filter((condition) =>
        ['=', '!=', 'in', 'not in', 'empty', 'not empty', 'contains', 'not contains'].includes(
          condition.value,
        ),
      );
    case FieldType.number:
      return conditions.filter((condition) =>
        ['=', '!=', 'in', 'not in', 'empty', 'not empty', '>', '>=', '<', '<='].includes(
          condition.value,
        ),
      );
    case FieldType.date:
    case FieldType.datetime:
    case FieldType.time:
      return conditions.filter((condition) =>
        ['=', '!=', '>', '>=', '<', '<='].includes(condition.value),
      );
    case FieldType.file:
    case FieldType.rating:
    case FieldType.checkbox:
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

export const IconsMapping: Record<string, IconType> = {
  text: MdTextFields,
  email: MdEmail,
  phone: MdPhone,
  singleselect: MdArrowDropDown,
  textarea: MdSubject,
  multiselect: MdArrowDropDown,
  radio: MdRadioButtonChecked,
  file: MdAttachFile,
  date: MdCalendarToday,
  datetime: MdCalendarToday,
  time: MdAccessTime,
  number: Md123,
  rating: MdStar,
  checkbox: MdCheckBox,
};

export const HexColors: Record<string, string> = {
  text: '#DE3163',
  email: '#BB2DC7',
  phone: '#325FFA',
  singleselect: '#682FFF',
  textarea: '#CC62D5',
  multiselect: '#325FFA',
  radio: '#EC660D',
  file: '#07A460',
  date: '#D19D20',
  datetime: '#939597',
  time: '#325FFA',
  number: '#E83B47',
  rating: '#DE3163',
  checkbox: '#BB2DC7',
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
