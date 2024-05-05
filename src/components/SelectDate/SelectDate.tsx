import styles from './SelectDate.module.css';
import DatePicker from 'react-datepicker';
import { EventType } from '../../apis/types';

interface SelectDateProps {
  eventData: EventType;
  selectedDate: string | null | undefined;
  handleDateChange: (date: string | null | undefined) => void;
  remainingTickets: number;
}

const findMaxDate = (eventData: EventType) => {
  let maxDate: Date | null = null;

  if (eventData && eventData.event_end_date) {
    const maxDateReducer = (maxDate: Date | null, date: string) => {
      const remainingTickets = eventData.remaining_tickets[date];
      if (remainingTickets > 0) {
        const currentDate = new Date(date);
        if (!maxDate || currentDate > maxDate) {
          maxDate = currentDate;
        }
      }
      return maxDate;
    };

    maxDate = Object.keys(eventData.remaining_tickets).reduce(maxDateReducer, null);

    return maxDate || new Date();
  }
  return new Date();
};

const SelectDate = ({
  eventData,
  selectedDate,
  handleDateChange,
  remainingTickets,
}: SelectDateProps) => {
  return (
    <>
      {' '}
      <div className={styles.selectDateContainer}>
        <p className={styles.ticketTypesTitle}>Select Date</p>
        <p className={styles.eventDescription}>Select a date to register for the event.</p>

        <div className={styles.selectionContainer}>
          <DatePicker
            wrapperClassName={styles.datePicker}
            dateFormat='dd MMM yyyy'
            selected={selectedDate ? new Date(selectedDate) : null}
            onChange={(date) => handleDateChange(date?.toString())}
            minDate={eventData.event_start_date ? new Date(eventData.event_start_date) : new Date()}
            maxDate={findMaxDate(eventData)}
          />
        </div>
        {selectedDate && (
          <p className={styles.remainingTickets}>
            {remainingTickets > 0 ? `${remainingTickets} tickets left` : 'No tickets left'}
          </p>
        )}
      </div>
    </>
  );
};

export default SelectDate;
