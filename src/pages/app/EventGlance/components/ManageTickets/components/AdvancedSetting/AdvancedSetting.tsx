import React from 'react';
// import Slider from '../../../../../../../components/SliderButton/Slider';
import styles from './AdvancedSetting.module.css';
import { TicketType } from '../../../../../../../apis/types';
type Props = {
  selectedTicket: TicketType;
  setSelectedTicket: React.Dispatch<React.SetStateAction<TicketType | undefined>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdvancedSetting = ({ selectedTicket, setSelectedTicket, setIsOpen }: Props) => {
  return (
    <>
      <div className={styles.advancedOptions}>
        <label className={styles.optionLabel}>Code Prefix</label>
        <input
          className={styles.optionInput}
          placeholder='Eg, PS123'
          value={selectedTicket?.code_prefix}
          onChange={(e) =>
            setSelectedTicket({ ...selectedTicket, code_prefix: e.target.value } as TicketType)
          }
        />
      </div>

      <div className={styles.advancedOptions}>
        <label className={styles.optionLabel}>No of digits</label>
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
        />
      </div>
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
      <div className={styles.advancedOptions}>
        <label className={styles.optionLabel}>User Count</label>
        <input
          type='number'
          className={styles.optionInput}
          placeholder=''
          value={selectedTicket?.user_count}
          onChange={(e) => {
            console.log(Number(e.target.value));
            Number(e.target.value) > 0 &&
              setSelectedTicket({
                ...selectedTicket,
                user_count: Number(e.target.value),
              } as TicketType);
          }}
        />
      </div>
      <button className={styles.cancelButton} onClick={() => setIsOpen(false)}>
        Back
      </button>
    </>
  );
};

export default AdvancedSetting;
