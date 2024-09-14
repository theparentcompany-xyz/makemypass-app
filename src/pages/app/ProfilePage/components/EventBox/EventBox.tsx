import toast from 'react-hot-toast';
import { IoLocationOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';

import { Event } from '../../../../../apis/types';
import { getDay, getMonthAbbreviation } from '../../../EventPage/constants';
import styles from './EventBox.module.css';

type Props = {
  eventData: Event;
};

const EventBox = ({ eventData }: Props) => {
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.eventGlance}>
        <div className={styles.bannerContainer}>
          {eventData?.banner ? (
            <img src={eventData?.banner} alt='' className={styles.banner} />
          ) : (
            <svg height='250' width='100%' className={styles.banner}>
              {eventData?.title && (
                <>
                  <rect width='100%' height='100%' className={styles.banner} />
                  <text x='40%' y='50%' fill='white' className={styles.svgText}>
                    No Banner.
                  </text>
                  <text x='10%' y='60%' fill='white' className={styles.svgText}>
                    Please Edit Event Details to add a banner
                  </text>
                </>
              )}
            </svg>
          )}
        </div>
        <div className={styles.eventDetailsContainer}>
          <div className={styles.headingTexts}>
            <p className={styles.eventTitle}>{eventData?.title}</p>
          </div>

          <div className={styles.eventDatePlace}>
            <div className={styles.eventDate}>
              {eventData?.event_start_date && (
                <>
                  <div className={styles.dateBox}>
                    <p className={styles.eventMonth}>
                      {getMonthAbbreviation(eventData?.event_start_date)}
                    </p>
                    <p className={styles.eventDateNum}>{getDay(eventData?.event_start_date)}</p>
                  </div>
                  <div className={styles.eventDateTimeText}>
                    <p className={styles.eventDateText}>
                      {new Date(eventData?.event_start_date).toLocaleDateString([], {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      }) ?? ''}
                    </p>
                    <p className={styles.eventTimeText}>
                      {new Date(eventData?.event_start_date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {eventData?.event_end_date && (
                        <>
                          {new Date(eventData?.event_end_date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {', '}
                          {new Date(eventData?.event_end_date).toLocaleDateString([], {
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
              {eventData?.place && (
                <>
                  <div className={styles.locationBox}>
                    <IoLocationOutline size={25} className={styles.locationIcon} />
                  </div>
                  <div className={styles.eventDateTimeText}>
                    <p className={styles.eventDateText}>{eventData?.place}</p>
                  </div>
                </>
              )}
            </div>
            <div className={styles.buttons}>
              <button
                onClick={() => {
                  const eventLink = `https://makemypass.com/${eventData?.name}`;
                  navigator.clipboard.writeText(eventLink);
                  toast.success('Event link copied to clipboard');
                }}
                className={styles.editEventButton}
              >
                Share Event
              </button>
              <button
                onClick={() => navigate(`/${eventData?.name}/manage/edit-event`)}
                className={styles.editEventButton}
              >
                Edit Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventBox;
