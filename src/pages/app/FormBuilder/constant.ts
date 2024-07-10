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
  Text: MdTextFields,
  Email: MdEmail,
  PhoneNumber: MdPhone,
  SingleSelect: MdArrowDropDown,
  TextArea: MdSubject,
  MultiSelect: MdArrowDropDown,
  Radio: MdRadioButtonChecked,
  File: MdAttachFile,
  Date: MdCalendarToday,
  DateTime: MdCalendarToday,
  Time: MdAccessTime,
  Number: Md123,
  Rating: MdStar,
  Checkbox: MdCheckBox,
};

export const HexColors: Record<string, string> = {
  Text: '#DE3163',
  Email: '#BB2DC7',
  PhoneNumber: '#325FFA',
  SingleSelect: '#682FFF',
  TextArea: '#CC62D5',
  MultiSelect: '#325FFA',
  Radio: '#EC660D',
  File: '#07A460',
  Date: '#D19D20',
  DateTime: '#939597',
  Time: '#325FFA',
  Number: '#E83B47',
  Rating: '#DE3163',
  Checkbox: '#BB2DC7',
};
