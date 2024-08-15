import React from 'react';
// import Slider from '../../../../../../../components/SliderButton/Slider';
import styles from './AdvancedSetting.module.css';
import { TicketType } from '../../../../../../../apis/types';
import InputField from '../../../../../../auth/Login/InputField';
type Props = {
  selectedTicket: TicketType;
  setSelectedTicket: React.Dispatch<React.SetStateAction<TicketType | undefined>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdvancedSetting = ({ selectedTicket, setSelectedTicket, setIsOpen }: Props) => {
  return (
    <>
      {/* <label className={styles.optionLabel}>Code Prefix</label>
      <input
        className={styles.optionInput}
        placeholder='Eg, PS123'
        value={selectedTicket?.code_prefix}
        onChange={(e) =>
          setSelectedTicket({ ...selectedTicket, code_prefix: e.target.value } as TicketType)
        }
      /> */}

      <InputField
        type='text'
        name='code_prefix'
        id='code_prefix'
        icon={<></>}
        description='Code Prefix'
        placeholder='Eg, PS123'
        value={selectedTicket?.code_prefix}
        onChange={(e) =>
          setSelectedTicket({ ...selectedTicket, code_prefix: e.target.value } as TicketType)
        }
      />

      {/* <label className={styles.optionLabel}>No of digits</label>
      <input
        className={styles.optionInput}
        placeholder=''
        value={selectedTicket?.code_digits}
        onChange={(e) =>
          setSelectedTicket({
            ...selectedTicket,
            code_digits: Number(e.target.value),
          } as TicketType)
        }
      /> */}

      <InputField
        type='number'
        name='code_suffix'
        id='code_suffix'
        icon={<></>}
        description='No of digits'
        placeholder=''
        value={selectedTicket?.code_digits.toString()}
        onChange={(e) =>
          setSelectedTicket({
            ...selectedTicket,
            code_digits: Number(e.target.value),
          } as TicketType)
        }
      />

      {/* <div className={styles.modalTicketOption}>
        <div className={styles.modalTicketSliderLabel}>
          <p className={styles.ticketSliderLabel}>Maintain Order</p>
          <p className={styles.ticketSliderSubLabel}>The tickets will be generated in order</p>
        </div>

        <Slider
          checked={selectedTicket?.maintain_code_order as boolean}
          onChange={() => {
            setSelectedTicket({
              ...selectedTicket,
              maintain_code_order: !selectedTicket?.maintain_code_order,
            } as TicketType);
          }}
        />
      </div> */}

      <InputField
        type='number'
        name='user_count'
        id='user_count'
        icon={<></>}
        description='User Count'
        placeholder=''
        value={selectedTicket?.user_count.toString()}
        onChange={(e) => {
          if (Number(e.target.value) < 1) {
            e.target.value = '1';
          }
          setSelectedTicket({
            ...selectedTicket,
            user_count: Number(e.target.value),
          } as TicketType);
        }}
      />

      <InputField
        type='text'
        name='category'
        id='Category'
        icon={<></>}
        description='Category'
        placeholder=''
        value={selectedTicket?.category}
        onChange={(e) =>
          setSelectedTicket({ ...selectedTicket, category: e.target.value } as TicketType)
        }
      />
      <button className={styles.cancelButton} onClick={() => setIsOpen(false)}>
        Back
      </button>
    </>
  );
};

export default AdvancedSetting;
