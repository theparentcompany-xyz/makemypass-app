import { EventType, TicketType } from '../../apis/types';
import styles from './SelectDate.module.css';
import DatePicker from 'react-datepicker';
interface SelectDateProps {
  eventData: EventType;
  selectedDate: string | null | undefined;
  handleDateChange: (date: string | null | undefined) => void;
  type?: string;
  value?: string | string[];
  onFieldChange?: (field: string, value: string) => void;
}
const SelectDate = ({
  eventData,
  selectedDate,
  handleDateChange,
  type,
  value,
  onFieldChange,
}: SelectDateProps) => {
  const findMinDate = (eventData: EventType) => {
    let minDate: Date | null = new Date(); // Initialize minDate with current date
    const currentDate = new Date(); // Get current date
    Object.values(eventData.tickets).forEach((ticketInfo: TicketType) => {
      ticketInfo.entry_date.forEach((entry) => {
        const date = new Date(entry.date);
        if (date >= currentDate && (!minDate || (date < minDate && entry.capacity > 0))) {
          minDate = date;
        }
      });
    });
    return minDate;
  };

  const findMaxDate = (eventData: EventType) => {
    let maxDate: Date | null = null; // Initialize maxDate with null
    Object.values(eventData.tickets).forEach((ticketInfo: TicketType) => {
      ticketInfo.entry_date.forEach((entry) => {
        const date = new Date(entry.date);
        if ((!maxDate || date > maxDate) && entry.capacity > 0) {
          maxDate = date;
        }
      });
    });
    return maxDate;
  };

  return (
    <>
      {' '}
      <div
        className={
          type !== 'addGuest' ? styles.selectDateContainer : styles.selectDateContainerAddGuest
        }
      >
        <p className={styles.ticketTypesTitle}>Select Date</p>
        <p className={styles.eventDescription}>Select a date to register for the event.</p>

        <div className={styles.selectionContainer}>
          <DatePicker
            wrapperClassName={styles.datePicker}
            dateFormat='dd MMM yyyy'
            selected={
              value && typeof value === 'string'
                ? new Date(value)
                : selectedDate
                  ? new Date(selectedDate)
                  : null
            }
            onChange={(date) => {
              if (onFieldChange) {
                onFieldChange('entry_date', date?.toISOString().split('T')[0] || '');
              }
              handleDateChange(date?.toString());
            }}
            minDate={findMinDate(eventData)}
            maxDate={findMaxDate(eventData)}
            excludeDates={Object.values(eventData.tickets).flatMap((ticketInfo) =>
              ticketInfo.entry_date
                .filter((entry) => entry.capacity === 0)
                .map((entry) => new Date(entry.date)),
            )}
          />
        </div>

        {type && <hr className={styles.line} />}
      </div>
    </>
  );
};

export default SelectDate;
