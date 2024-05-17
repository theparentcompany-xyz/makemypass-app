import styles from './SelectDate.module.css';
import DatePicker from 'react-datepicker';
interface SelectDateProps {
  selectedDate: string | null | undefined;
  handleDateChange: (date: string | null | undefined) => void;
  type?: string;
  value?: string | string[];
  onFieldChange?: (field: string, value: string) => void;
}
const SelectDate = ({
  selectedDate,
  handleDateChange,
  type,
  value,
  onFieldChange,
}: SelectDateProps) => {
  console.log('selectedDate', selectedDate);
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
            // minDate={findMinDate(eventData)}~
            // maxDate={findMaxDate(eventData)}
            // excludeDates={
            //   eventData?.remaining_tickets &&
            //   Object.keys(eventData?.remaining_tickets).reduce((acc, date) => {
            //     if (eventData?.remaining_tickets[date] <= 0 || new Date(date) < new Date()) {
            //       acc.push(new Date(date));
            //     }
            //     return acc;
            //   }, [] as Date[])
            // }
          />
        </div>

        {type && <hr className={styles.line} />}
      </div>
    </>
  );
};

export default SelectDate;
