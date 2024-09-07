import Select, { ActionMeta, SingleValue } from 'react-select';
import { customStyles } from '../EventPage/constants';

const SelectComponent = ({
  backgroundColor,
  options,
  onChange,
  value,
  isSmall,
}: {
  backgroundColor?: string;
  options?: {
    value: string;
    label: string;
  }[];
  onChange?:
    | ((
        newValue: SingleValue<{ value: string; label: string }>,
        actionMeta: ActionMeta<{ value: string; label: string }>,
      ) => void)
    | undefined;
  value?: string;
  isSmall?: boolean;
}) => {
  return (
    <>
      <Select
        className='basic-single'
        classNamePrefix='select'
        isClearable={true}
        name='role'
        onChange={onChange}
        options={options}
        styles={{
          ...customStyles,
          control: (provided: any) => ({
            ...provided,
            border: 'none',
            backgroundColor: backgroundColor || 'transparent', // Set the background color to transparent
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: isSmall ? '0.7rem' : '0.9rem',
            zIndex: 1000,
            width: isSmall ? '100px' : '12rem',
          }),
          menu: (provided: any) => ({
            ...provided,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#24352F',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '0.9rem',
            zIndex: 10000,
          }),
        }}
        value={options?.find((option) => option.value === value)}
      />
    </>
  );
};

export default SelectComponent;
