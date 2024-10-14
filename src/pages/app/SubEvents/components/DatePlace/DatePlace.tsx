import { IoLocationOutline } from 'react-icons/io5';

import { SubEventType } from '../../../../../apis/types';
import { getDay, getMonthAbbreviation } from '../../../EventPage/constants';
import styles from './DatePlace.module.css';

const DatePlace = ({ event }: { event: SubEventType }) => {
  return (
    <div className={styles.eventDatePlace}>
      <div className={styles.eventDate}>
        {event?.start_time && (
          <>
            <div className={styles.dateBox}>
              <p className={styles.eventMonth}>{getMonthAbbreviation(event?.start_time)}</p>
              <p className={styles.eventDateNum}>{getDay(event?.start_time)}</p>
            </div>
            <div className={styles.eventDateTimeText}>
              <p className={styles.eventDateText}>
                {new Date(event?.start_time).toLocaleDateString([], {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                }) ?? ''}
              </p>
              <p className={styles.eventTimeText}>
                {new Date(event?.start_time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                -{' '}
                {event?.end_time && (
                  <>
                    {new Date(event?.end_time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {', '}
                    {new Date(event?.end_time).toLocaleDateString([], {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </>
                )}
              </p>
            </div>
          </>
        )}
      </div>
      <div className={styles.eventPlace}>
        {event?.place && (
          <>
            <div className={styles.locationBox}>
              <IoLocationOutline size={25} className={styles.locationIcon} />
            </div>
            <div className={styles.eventDateTimeText}>
              <p className={styles.eventDateText}>{event?.place}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DatePlace;
