export const customStyles = {
  control: (provided: any) => ({
    ...provided,
    border: 'none',
    backgroundColor: '#2A3533',
    fontFamily: 'Inter, sans-serif',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '0.9rem',
  }),

  group: (provided: any) => ({
    ...provided,
    paddingTop: 0,
  }),

  singleValue: (base: any) => ({
    ...base,
    color: '#fff',
  }),
  option: (provided: any) => ({
    ...provided,
    fontFamily: 'Inter, sans-serif',
    color: '#000',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '0.9rem',
  }),
};
