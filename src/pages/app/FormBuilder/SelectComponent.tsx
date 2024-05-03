import Select from 'react-select';
import { customStyles } from '../EventPage/constants';

const SelectComponent = ({
  backgroundColor,
  options,
}: {
  backgroundColor?: string;
  options?: {
    value: string;
    label: string;
  }[];
}) => {
  return (
    <>
      <Select
        className='basic-single'
        classNamePrefix='select'
        name='role'
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
            fontSize: '0.9rem',
            zIndex: 1000,
            width: '12rem',
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
      />
    </>
  );
};

export default SelectComponent;