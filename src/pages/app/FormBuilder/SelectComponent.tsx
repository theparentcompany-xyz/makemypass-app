import Select from 'react-select';
import { customStyles } from '../EventPage/constants';

const SelectComponent = () => {
  const categories = ['Attendee', 'Speaker', 'Sponsor', 'Exhibitor', 'Staff'];

  return (
    <>
      <Select
        className='basic-single'
        classNamePrefix='select'
        name='role'
        options={[
          ...categories.map((category) => ({
            value: category,
            label: category,
          })),
          {
            value: '',
            label: 'All',
          },
        ]}
        styles={{
          ...customStyles,
          control: (provided: any) => ({
            ...provided,
            border: 'none',
            backgroundColor: 'transparent', // Set the background color to transparent
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '0.9rem',
            zIndex: 1000,
            width: '12rem',
          }),
        }}
      />
    </>
  );
};

export default SelectComponent;
