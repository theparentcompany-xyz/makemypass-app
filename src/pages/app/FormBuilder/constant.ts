import { IconType } from 'react-icons/lib';
import {
  Md123,
  MdAccessTime,
  MdArrowDropDown,
  MdAttachFile,
  MdCalendarToday,
  MdCheckBox,
  MdEmail,
  MdPhone,
  MdRadioButtonChecked,
  MdStar,
  MdSubject,
  MdTextFields,
} from 'react-icons/md';

import { ConditionalQuestionOperator } from '../../../../services/enums.ts';
import { DefaultFieldTypes, FieldType } from './enum.ts';

export interface ConditionType {
  value: ConditionalQuestionOperator;
  label: string;
}

export function getConditions(type: string): ConditionType[] {
  switch (type) {
    case FieldType.Text:
    case FieldType.Email:
    case FieldType.Phone:
    case FieldType.LongText:
      return conditions.filter((condition) =>
        [
          ConditionalQuestionOperator.EQUALS,
          ConditionalQuestionOperator.NOT_EQUALS,
          ConditionalQuestionOperator.IN,
          ConditionalQuestionOperator.NOT_IN,
          ConditionalQuestionOperator.EMPTY,
          ConditionalQuestionOperator.NOT_EMPTY,
          ConditionalQuestionOperator.CONTAINS,
          ConditionalQuestionOperator.NOT_CONTAINS,
        ].includes(condition.value),
      );
    case FieldType.Number:
    case FieldType.Date:
    case FieldType.DateTime:
    case FieldType.Time:
      return conditions.filter((condition) =>
        [
          ConditionalQuestionOperator.EQUALS,
          ConditionalQuestionOperator.NOT_EQUALS,
          ConditionalQuestionOperator.IN,
          ConditionalQuestionOperator.NOT_IN,
          ConditionalQuestionOperator.EMPTY,
          ConditionalQuestionOperator.NOT_EMPTY,
          ConditionalQuestionOperator.GREATER_THAN,
          ConditionalQuestionOperator.GREATER_THAN_OR_EQUAL,
          ConditionalQuestionOperator.LESS_THAN,
          ConditionalQuestionOperator.LESS_THAN_OR_EQUAL,
        ].includes(condition.value),
      );
    case FieldType.Rating:
    case FieldType.Checkbox:
    case FieldType.MultiSelect:
    case FieldType.SingleSelect:
    case FieldType.Radio:
      return conditions.filter((condition) =>
        [
          ConditionalQuestionOperator.EQUALS,
          ConditionalQuestionOperator.NOT_EQUALS,
          ConditionalQuestionOperator.IN,
          ConditionalQuestionOperator.NOT_IN,
          ConditionalQuestionOperator.EMPTY,
          ConditionalQuestionOperator.NOT_EMPTY,
        ].includes(condition.value),
      );
    default:
      return [];
  }
}

export const conditions: ConditionType[] = [
  {
    value: ConditionalQuestionOperator.EQUALS,
    label: 'Equal',
  },
  {
    value: ConditionalQuestionOperator.NOT_EQUALS,
    label: 'Not Equal',
  },
  {
    value: ConditionalQuestionOperator.IN,
    label: 'In',
  },
  {
    value: ConditionalQuestionOperator.NOT_IN,
    label: 'Not In',
  },
  {
    value: ConditionalQuestionOperator.EMPTY,
    label: 'Empty',
  },
  {
    value: ConditionalQuestionOperator.NOT_EMPTY,
    label: 'Not Empty',
  },
  {
    value: ConditionalQuestionOperator.CONTAINS,
    label: 'Contains',
  },
  {
    value: ConditionalQuestionOperator.NOT_CONTAINS,
    label: 'Not Contains',
  },
  {
    value: ConditionalQuestionOperator.GREATER_THAN,
    label: 'Greater Than',
  },
  {
    value: ConditionalQuestionOperator.GREATER_THAN_OR_EQUAL,
    label: 'Greater Than and Equal',
  },
  {
    value: ConditionalQuestionOperator.LESS_THAN,
    label: 'Less Than',
  },
  {
    value: ConditionalQuestionOperator.LESS_THAN_OR_EQUAL,
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

export const DefaultFiledTypeMapping: Record<DefaultFieldTypes, FieldType> = {
  [DefaultFieldTypes.Name]: FieldType.Text,
  [DefaultFieldTypes.Email]: FieldType.Email,
  [DefaultFieldTypes.Phone]: FieldType.Phone,
  [DefaultFieldTypes.Category]: FieldType.SingleSelect,
  [DefaultFieldTypes.Organization]: FieldType.Text,
  [DefaultFieldTypes.Referral]: FieldType.Text,
  [DefaultFieldTypes.District]: FieldType.SingleSelect,
  [DefaultFieldTypes.TeamId]: FieldType.Text,
};
