import { useEffect, useState } from 'react';
import styles from './SelectMultipleDates.module.css';
import DatePicker from 'react-datepicker';
import { TicketType } from '../../../../../../../../apis/types';
interface SelectDateProps {
  selectedTicket: TicketType;
  setSelectedTicket: React.Dispatch<React.SetStateAction<TicketType | undefined>>;
}
const SelectMultipleDates = ({ selectedTicket, setSelectedTicket }: SelectDateProps) => {
  const getDatesArray = () => {
    return selectedTicket.allowed_dates?.map((dateStr: string) => new Date(dateStr));
  };

  useEffect(() => {
    setSelectedDates(getDatesArray());
  }, [selectedTicket]);

  const [selectedDates, setSelectedDates] = useState<Date[] | null | undefined>([]);
  // useEffect(() => {
  //   console.log(selectedDates);
  // }, [selectedDates]);
  return (
    <>
      {' '}
      <div className={styles.selectDateContainerAddGuest}>
        {
          <>
            <div className={styles.selectionContainer}>
              <DatePicker
                wrapperClassName={styles.datePicker}
                selectedDates={selectedDates || undefined}
                onChange={(dates) => {
                  setSelectedDates(dates);
                  setSelectedTicket({
                    ...selectedTicket,
                    allowed_dates: dates?.map((date) => date.toISOString().split('T')[0]),
                  } as TicketType);
                }}
                dateFormat={'yyyy-MM-dd'}
                selectsMultiple={true}
                shouldCloseOnSelect={false}
                disabledKeyboardNavigation
              />
            </div>
          </>
        }
      </div>
    </>
  );
};

export default SelectMultipleDates;
