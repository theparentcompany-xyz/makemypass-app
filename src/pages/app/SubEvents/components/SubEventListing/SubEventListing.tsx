import { motion } from 'framer-motion';

import { SubEventType } from '../../../../../apis/types';
import { formatDate, formatTime } from '../../../../../common/commonFunctions';
import type { SelectedSubEventsType } from '../../User/types';
import DatePlace from '../DatePlace/DatePlace';
import styles from './SubEventListing.module.css';

const groupEventsByDateAndTime = (events: SubEventType[]) => {
  return events.reduce((acc: Record<string, Record<string, SubEventType[]>>, event) => {
    const eventDate = formatDate(event.start_time);
    const eventTime = formatTime(event.start_time);
    if (!acc[eventDate]) {
      acc[eventDate] = {};
    }
    if (!acc[eventDate][eventTime]) {
      acc[eventDate][eventTime] = [];
    }
    acc[eventDate][eventTime].push(event);
    return acc;
  }, {});
};

const SubEventListing = ({
  subEvents,
  selectedEventsIds,
  handleSelectEvent,
  setShowDetailedView,
  setSubEventToRemove,
}: {
  subEvents: SubEventType[];
  selectedEventsIds: SelectedSubEventsType[];
  handleSelectEvent: (event: SubEventType) => void;
  setShowDetailedView: (event: SubEventType | null) => void;
  setSubEventToRemove: (id: string | null) => void;
}) => {
  const groupedEvents = groupEventsByDateAndTime(subEvents);
  return (
    <div className={styles.subEventsListingContainer}>
      {subEvents &&
        Object.keys(groupedEvents).map((date) => (
          <div key={date}>
            {/* Display date header */}
            <p className={styles.dateHeader}>{date}</p>
            <div className={styles.timeContaianer}>
              {Object.keys(groupedEvents[date]).map((time) => (
                <div key={time}>
                  {/* Display time header */}
                  <p className={styles.timeHeader}>Events @ {time}</p>
                  <div className={styles.eventsContainer}>
                    {groupedEvents[date][time].map((event) => (
                      <>
                        <div key={event.id} className={styles.event}>
                          {event.already_booked && <p className={styles.registedTag}>Registered</p>}
                          <div>
                            <div
                              className={`${styles.eventCard} ${
                                selectedEventsIds.find(
                                  (e) => e.id === event.id && !event.already_booked,
                                )
                                  ? styles.selectedCard
                                  : event.conflicting_event && styles.disabledCard
                              }`}
                              onClick={() => !event.conflicting_event && handleSelectEvent(event)}
                            >
                              <div className={styles.innerCard}>
                                <div className={styles.eventDetails}>
                                  <div className={styles.headingTexts}>
                                    <p className={styles.eventTitle}>{event?.title}</p>
                                  </div>

                                  <DatePlace event={event} />

                                  <div className='row'>
                                    {!event.conflicting_event && (
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        className={styles.cardPrimaryButton}
                                        onClick={() => {
                                          if (event.already_booked) setSubEventToRemove(event.id);
                                          else handleSelectEvent(event);
                                        }}
                                      >
                                        {event.already_booked
                                          ? 'Withdraw'
                                          : selectedEventsIds.find((e) => e.id === event.id)
                                            ? 'Deselect'
                                            : 'Select'}
                                      </motion.button>
                                    )}
                                    <motion.button
                                      onClick={() => setShowDetailedView(event)}
                                      className={styles.manage}
                                    >
                                      View More
                                    </motion.button>
                                  </div>

                                  {event.conflicting_event && (
                                    <p className={styles.conflictingMessage}>
                                      Kindly unselect {event.conflicting_event}, to register.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default SubEventListing;
