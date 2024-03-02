import { BsSuitcaseLg } from 'react-icons/bs';
import { GoPerson } from 'react-icons/go';
import { IoCallOutline } from 'react-icons/io5';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { RiCoupon3Line } from 'react-icons/ri';
import { DiscountData } from './types';

export const customStyles = {
  control: (provided: any) => ({
    ...provided,
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    fontFamily: 'Inter, sans-serif',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '0.9rem',
    maxWidth: '25rem',
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

  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: '#323838',
    borderRadius: '4px',
    padding: '2px 6px',
    color: '#fff',
    fontSize: '1.9rem',
  }),

  multiValueLabel: (provided: any) => ({
    ...provided,
    color: '#fff',
    fontSize: '0.9rem',
  }),

  multiValueRemove: (provided: any) => ({
    ...provided,
    color: '#fff',
    fontSize: '0.9rem',
    ':hover': {
      backgroundColor: '#323838',
      color: '#fff',
    },
  }),

  placeholder: (provided: any) => ({
    ...provided,
    color: '#9E9E9E',
  }),

  menu: (provided: any) => ({
    ...provided,
    backgroundColor: 'rgba(255, 255, 255)',
    fontFamily: 'Inter, sans-serif',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '0.9rem',
    zIndex: 10000,
    position: 'relative',
  }),

  menuList: (provided: any) => ({
    ...provided,
    paddingTop: 0,
    paddingBottom: 0,
  }),

  noOptionsMessage: (provided: any) => ({
    ...provided,
    color: '#9E9E9E',
  }),
  loadingMessage: (provided: any) => ({
    ...provided,
    color: '#9E9E9E',
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: '#9E9E9E',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#9E9E9E',
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: '#9E9E9E',
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '2px 8px',
  }),
  input: (provided: any) => ({
    ...provided,
    color: '#fff',
  }),
  loadingIndicator: (provided: any) => ({
    ...provided,
    color: '#9E9E9E',
  }),
};

export const getIcon = (type: string) => {
  switch (type) {
    case 'name':
      return (
        <GoPerson
          size={20}
          style={{
            color: '#9E9E9E',
          }}
        />
      );
    case 'phone_number':
      return (
        <IoCallOutline
          size={20}
          style={{
            color: '#9E9E9E',
          }}
        />
      );
    case 'email':
      return (
        <MdOutlineAlternateEmail
          size={20}
          style={{
            color: '#9E9E9E',
          }}
        />
      );
    case 'organisation_campus':
      return (
        <BsSuitcaseLg
          size={22}
          style={{
            color: '#9E9E9E',
          }}
        />
      );
    case 'coupon_code':
      return (
        <RiCoupon3Line
          size={20}
          style={{
            color: '#9E9E9E',
          }}
        />
      );
  }
};

export const discountedTicketPrice = (ticketPrice: number, discount: DiscountData) => {
  let discountedPrice = 0;
  if (discount.discount_type?.toLowerCase() === 'percentage') {
    discountedPrice = (ticketPrice * (100 - discount.discount_value)) / 100;
  } else {
    discountedPrice = ticketPrice - discount.discount_value;
  }

  if (discountedPrice < 0) return 0;
  else {
    if (isNaN(discountedPrice)) return 0;
    return discountedPrice;
  }
};
