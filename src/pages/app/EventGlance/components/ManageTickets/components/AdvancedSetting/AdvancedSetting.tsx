import React from 'react';
// import Slider from '../../../../../../../components/SliderButton/Slider';
import styles from './AdvancedSetting.module.css';
import { TicketType } from '../../../../../../../apis/types';
import InputField from '../../../../../../auth/Login/InputField';
import Slider from '../../../../../../../components/SliderButton/Slider';
// import SelectMultipleDates from './components/SelectMultipleDates';
import { MdDelete } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

type Props = {
  selectedTicket: TicketType;
  setSelectedTicket: React.Dispatch<React.SetStateAction<TicketType | undefined>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdvancedSetting = ({ selectedTicket, setSelectedTicket, setIsOpen }: Props) => {
  return (
    <>
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

      <div className={styles.ticketSlider}>
        <p className={styles.perksLabel}>Perks</p>
        <Slider
          checked={selectedTicket?.perks.length > 0}
          onChange={() => {
            if (selectedTicket) {
              setSelectedTicket({
                ...selectedTicket,
                perks:
                  selectedTicket.perks.length > 0 ? [] : [{ id: uuidv4(), name: '', count: 1 }],
              } as TicketType);
            }
          }}
        />
      </div>

      {selectedTicket && selectedTicket.perks.length > 0 && (
        <div className={styles.perksList}>
          {selectedTicket.perks.map((perk, index) => (
            <div key={index} className={styles.perkItem}>
              <input
                type='text'
                placeholder='Perk Name'
                value={perk.name}
                onChange={(e) => {
                  setSelectedTicket((prevTicket) => {
                    if (prevTicket) {
                      const updatedPerks = [...prevTicket.perks];
                      updatedPerks[index].name = e.target.value;
                      return { ...prevTicket, perks: updatedPerks } as TicketType;
                    }
                    return prevTicket;
                  });
                }}
                className={styles.perkNameInput}
              />
              <input
                type='number'
                placeholder='Perk Count'
                value={perk.count}
                onChange={(e) => {
                  setSelectedTicket((prevTicket) => {
                    if (prevTicket) {
                      const updatedPerks = [...prevTicket.perks];
                      updatedPerks[index].count = Number(e.target.value);
                      return { ...prevTicket, perks: updatedPerks } as TicketType;
                    }
                    return prevTicket;
                  });
                }}
                className={styles.perkCountInput}
              />

              <MdDelete
                size={22}
                color='rgb(147, 149, 151)'
                onClick={() => {
                  setSelectedTicket((prevTicket) => {
                    if (prevTicket) {
                      const updatedPerks = [...prevTicket.perks];
                      updatedPerks.splice(index, 1);
                      return { ...prevTicket, perks: updatedPerks } as TicketType;
                    }
                    return prevTicket;
                  });
                }}
              />
            </div>
          ))}

          <button
            className={styles.addPerkButton}
            onClick={() => {
              setSelectedTicket((prevTicket) => {
                if (prevTicket) {
                  const updatedPerks = [...prevTicket.perks];
                  const lastPerk = updatedPerks[updatedPerks.length - 1];
                  if (lastPerk.name && lastPerk.count) {
                    updatedPerks.push({ id: uuidv4(), name: '', count: 1 });
                  } else {
                    toast.error('Please fill the previous perk');
                  }
                  return { ...prevTicket, perks: updatedPerks } as TicketType;
                }
                return prevTicket;
              });
            }}
          >
            + Add Perk
          </button>
        </div>
      )}

      {/* <SelectMultipleDates selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket} /> */}

      <button
        className={styles.cancelButton}
        onClick={() => {
          setIsOpen(false);
        }}
      >
        Back
      </button>
    </>
  );
};

export default AdvancedSetting;
