import DatePicker from 'react-datepicker';

import { findMaxDate, findMinDate } from '../../common/commonFunctions';
import { FormEventData } from '../../pages/app/Guests/types';
import styles from './SelectDate.module.css';

interface SelectDateProps {
  eventFormData: FormEventData;
  selectedDate: string | null | undefined;
  handleDateChange: (date: string | null | undefined) => void;
  type?: string;
  value?: string | string[];
  onFieldChange?: (field: string, value: string) => void;
}
const SelectDate = ({
  eventFormData,
  selectedDate,
  handleDateChange,
  type,
  value,
  onFieldChange,
}: SelectDateProps) => {
  return (
    <>
      {' '}
      <div
        className={
          type !== 'addGuest' ? styles.selectDateContainer : styles.selectDateContainerAddGuest
        }
      >
        {
          <>
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
                minDate={findMinDate(eventFormData)}
                maxDate={findMaxDate(eventFormData)}
                excludeDates={Object.values(eventFormData.tickets).flatMap((ticketInfo) =>
                  ticketInfo.entry_date
                    .filter((entry) => entry.capacity === 0)
                    .map((entry) => new Date(entry.date)),
                )}
              />
            </div>
            {type && <hr className={styles.line} />}
          </>
        }
      </div>
    </>
  );
};

export default SelectDate;
