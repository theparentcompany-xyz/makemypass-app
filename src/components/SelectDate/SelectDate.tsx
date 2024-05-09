import styles from './SelectDate.module.css';
import DatePicker from 'react-datepicker';
import { EventType } from '../../apis/types';

interface SelectDateProps {
  eventData: EventType;
  selectedDate: string | null | undefined;
  handleDateChange: (date: string | null | undefined) => void;
  remainingTickets: number;
  type?: string;
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

const findMinDate = (eventData: EventType) => {
  let minDate: Date | null = null;

  if (eventData && eventData.event_start_date) {
    const minDateReducer = (minDate: Date | null, date: string) => {
      const remainingTickets = eventData.remaining_tickets[date];
      if (remainingTickets > 0) {
        const currentDate = new Date(date);
        if (!minDate || currentDate < minDate) {
          minDate = currentDate;
        }
      }
      return minDate;
    };

    minDate = Object.keys(eventData.remaining_tickets).reduce(minDateReducer, null);

    return minDate || new Date();
  }
  return new Date();
};

const SelectDate = ({
  eventData,
  selectedDate,
  handleDateChange,
  remainingTickets,
  type,
}: SelectDateProps) => {
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
            selected={selectedDate ? new Date(selectedDate) : null}
            onChange={(date) => handleDateChange(date?.toString())}
            minDate={findMinDate(eventData)}
            maxDate={findMaxDate(eventData)}
            excludeDates={Object.keys(eventData.remaining_tickets).reduce((acc, date) => {
              if (eventData.remaining_tickets[date] <= 0) {
                acc.push(new Date(date));
              }
              return acc;
            }, [] as Date[])}
          />
        </div>
        {selectedDate && !type && (
          <p className={styles.remainingTickets}>
            {remainingTickets > 0 ? `${remainingTickets} tickets left` : 'No tickets left'}
          </p>
        )}
      </div>
    </>
  );
};

export default SelectDate;
