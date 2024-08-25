import React from 'react';
// import Slider from '../../../../../../../components/SliderButton/Slider';
import styles from './AdvancedSetting.module.css';
import { TicketType } from '../../../../../../../apis/types';
import InputField from '../../../../../../auth/Login/InputField';
import Slider from '../../../../../../../components/SliderButton/Slider';
import { createPerk, deletePerk, updatePerk } from '../../../../../../../apis/perks';
import toast from 'react-hot-toast';
import { MdDelete, MdSave } from 'react-icons/md';
import { perkType } from '../../types';
type Props = {
  selectedTicket: TicketType;
  setSelectedTicket: React.Dispatch<React.SetStateAction<TicketType | undefined>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ticketPerks: perkType[];
  setTicketPerks: React.Dispatch<React.SetStateAction<perkType[]>>;
};

const AdvancedSetting = ({
  selectedTicket,
  setSelectedTicket,
  setIsOpen,
  ticketPerks,
  setTicketPerks,
}: Props) => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData') || '');

  const addNewPerk = () => {
    const lastPerk = ticketPerks[ticketPerks.length - 1];
    if (lastPerk && lastPerk.name && lastPerk.count) {
      if (!lastPerk.id) {
        createPerk(
          eventId,
          selectedTicket?.id as string,
          lastPerk.name,
          lastPerk.count,
          setTicketPerks,
        );
      } else {
        setTicketPerks((prevPerks) => {
          const updatedPerks = [...prevPerks];
          updatedPerks.push({ id: '', name: '', count: 1, ticketId: '' });
          return updatedPerks;
        });
      }
    } else {
      toast.error('Please fill the previous perk details');
    }
  };

  const deletePerkFromList = (perkId: string) => {
    if (perkId) deletePerk(eventId, selectedTicket?.id as string, perkId);

    setTicketPerks((prevPerks) => prevPerks.slice(0, prevPerks.length - 1));
  };

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
          checked={ticketPerks && ticketPerks.length > 0}
          onChange={() => {
            setTicketPerks((prevPerks) =>
              prevPerks.length > 0
                ? []
                : ([{ name: '', count: 1, id: '', ticketId: selectedTicket?.id }] as perkType[]),
            );
          }}
        />
      </div>

      {ticketPerks && ticketPerks.length > 0 && (
        <div className={styles.perksList}>
          {ticketPerks.map((perk, index) => (
            <div key={index} className={styles.perkItem}>
              <input
                type='text'
                placeholder='Perk Name'
                value={perk.name}
                onChange={(e) => {
                  setTicketPerks((prevPerks) => {
                    const updatedPerks = [...prevPerks];
                    updatedPerks[index].name = e.target.value;
                    updatedPerks[index].isEditing = updatedPerks[index].id ? true : false;
                    return updatedPerks;
                  });
                }}
                className={styles.perkNameInput}
              />
              <input
                type='number'
                placeholder='Perk Count'
                value={perk.count}
                onChange={(e) => {
                  setTicketPerks((prevPerks) => {
                    const updatedPerks = [...prevPerks];
                    updatedPerks[index].count = parseInt(e.target.value);
                    updatedPerks[index].isEditing = updatedPerks[index].id ? true : false;
                    return updatedPerks;
                  });
                }}
                className={styles.perkCountInput}
              />

              {perk.isEditing && (
                <MdSave
                  size={22}
                  color='rgb(147, 149, 151)'
                  onClick={() => {
                    updatePerk(
                      eventId,
                      selectedTicket?.id as string,
                      perk.id,
                      perk.name,
                      perk.count,
                      setTicketPerks,
                    );
                  }}
                />
              )}

              <MdDelete
                size={22}
                color='rgb(147, 149, 151)'
                onClick={() => {
                  deletePerkFromList(perk.id);
                }}
              />
            </div>
          ))}

          <button className={styles.addPerkButton} onClick={() => addNewPerk()}>
            + Add Perk
          </button>
        </div>
      )}

      <button
        className={styles.cancelButton}
        onClick={() => {
          setIsOpen(false);
          ticketPerks.forEach((perk) => {
            if (perk.id && perk.isEditing) {
              updatePerk(
                eventId,
                selectedTicket?.id as string,
                perk.id,
                perk.name,
                perk.count,
                setTicketPerks,
              );
            } else if (!perk.id && perk.name && perk.count > 0 && !perk.isEditing) {
              createPerk(
                eventId,
                selectedTicket?.id as string,
                perk.name,
                perk.count,
                setTicketPerks,
              );
            }
          });
        }}
      >
        Back
      </button>
    </>
  );
};

export default AdvancedSetting;
