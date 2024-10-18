import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { BiSolidError } from 'react-icons/bi';
import { BsFillPeopleFill } from 'react-icons/bs';

import { SubEventType } from '../../../../../apis/types';
import { formatDate, formatTime } from '../../../../../common/commonFunctions';
import type { SelectedSubEventsType } from '../../User/types';
import DatePlace from '../DatePlace/DatePlace';
import styles from './SubEventListing.module.css';

const groupEventsByDateAndTime = (events: SubEventType[]) => {
  return (
    events
      // Sort events by start_time in ascending order (morning events come first)
      .sort((a, b) => {
        const timeA = a.start_time ? new Date(a.start_time).getTime() : 0;
        const timeB = b.start_time ? new Date(b.start_time).getTime() : 0;
        return timeA - timeB;
      })
      // Then group events by date and time
      .reduce((acc: Record<string, Record<string, SubEventType[]>>, event) => {
        const eventDate = event.start_time ? formatDate(event.start_time) : 'No Specific Date';
        const eventTime = event.start_time ? formatTime(event.start_time) : 'No Specific Time';

        if (!acc[eventDate]) {
          acc[eventDate] = {};
        }
        if (!acc[eventDate][eventTime]) {
          acc[eventDate][eventTime] = [];
        }

        acc[eventDate][eventTime].push(event);

        return acc;
      }, {})
  );
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
          <div key={date} className={styles.dayEventsContainer}>
            {/* Display date header */}
            <p className={styles.dateHeader}>{date}</p>
            <div className={styles.timeContainer}>
              {Object.keys(groupedEvents[date]).map((time) => (
                <div key={time}>
                  {/* Display time header */}
                  <p className={styles.timeHeader}>
                    {time == 'No Specific Time' ? '' : 'Events @'} {time}
                  </p>
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
                                  : undefined
                              }`}
                              onClick={() =>
                                !event.conflicting_event &&
                                !event.already_booked &&
                                handleSelectEvent(event)
                              }
                            >
                              <div className={styles.innerCard}>
                                <div
                                  className={`${styles.eventDetails} ${event.conflicting_event && styles.disabledCard}`}
                                >
                                  <div className={styles.eventCardHeader}>
                                    <div className={styles.headingTexts}>
                                      <p className={styles.eventTitle}>
                                        {event?.title.length > 50
                                          ? `${event.title.substring(0, 50)}...`
                                          : event.title}
                                      </p>
                                    </div>
                                    <DatePlace event={event} />
                                  </div>
                                  <div
                                    className='row'
                                    style={{
                                      justifyContent: 'space-between',
                                      alignItems: 'flex-end',
                                    }}
                                  >
                                    {event.capacity_left && (
                                      <div
                                        className='row'
                                        style={{
                                          columnGap: '0.25rem',
                                        }}
                                      >
                                        <BsFillPeopleFill size={18} color='#E5E5E5' />
                                        <span className={styles.capacityText}>
                                          {event.capacity_left} Left
                                        </span>
                                      </div>
                                    )}

                                    <div className='row'>
                                      <motion.button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowDetailedView(event);
                                        }}
                                        className={styles.manage}
                                      >
                                        View More
                                      </motion.button>
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
                                    </div>
                                  </div>
                                </div>

                                {event.conflicting_event && (
                                  <motion.div
                                    className={styles.conflictIcon}
                                    whileHover={{ scale: 1.2 }}
                                    onClick={() => {
                                      toast.error(
                                        `The time of ${event.title} clashes with ${event.conflicting_event}. Kindly unselect ${event.conflicting_event}, to register.`,
                                      );
                                    }}
                                    title={`The time of ${event.title} clashes with ${event.conflicting_event}. Kindly unselect ${event.conflicting_event}, to register.`}
                                  >
                                    <BiSolidError color='#f04b4b' size={20} />
                                  </motion.div>
                                )}
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
