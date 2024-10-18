import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BiSolidError } from 'react-icons/bi';
import { BsFillPeopleFill } from 'react-icons/bs';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Select from 'react-select';

import { SubEventType } from '../../../../../apis/types';
import { formatDate, formatTime } from '../../../../../common/commonFunctions';
import { customStyles } from '../../../EventPage/constants';
import type { SelectedSubEventsType } from '../../User/types';
import DatePlace from '../DatePlace/DatePlace';
import styles from './SubEventListing.module.css';

const groupEventsByDateAndTime = (events: SubEventType[], place?: string, title?: string) => {
  return events
    .filter((event) => !place || event.place === place)
    .filter((event) => !title || event.title.toLowerCase().includes(title.toLowerCase()))
    .sort((a, b) => {
      const timeA = a.start_time ? new Date(a.start_time).getTime() : 0;
      const timeB = b.start_time ? new Date(b.start_time).getTime() : 0;
      return timeA - timeB;
    })
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
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [groupedEvents, setGroupedEvents] = useState<
    Record<string, Record<string, SubEventType[]>>
  >(groupEventsByDateAndTime(subEvents));
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [expandedTimes, setExpandedTimes] = useState<Record<string, boolean>>({});

  const toggleTimeExpansion = (date: string, time: string) => {
    setExpandedTimes((prev) => {
      const newExpandedTimes: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        newExpandedTimes[key] = false;
      });
      newExpandedTimes[`${date}-${time}`] = !prev[`${date}-${time}`];
      return newExpandedTimes;
    });
  };

  useEffect(() => {
    const locations = subEvents.map((event) => event.place);
    setAvailableLocations([...new Set(locations)]);
    setGroupedEvents(groupEventsByDateAndTime(subEvents, selectedLocation, searchTitle));
    if (subEvents.length > 0 && Object.keys(expandedTimes).length === 0) {
      const firstDate = Object.keys(groupedEvents)[0];
      const firstTime = Object.keys(groupedEvents[firstDate])[0];
      setExpandedTimes({ [`${firstDate}-${firstTime}`]: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subEvents, selectedLocation, searchTitle]);

  return (
    <div className={styles.subEventsListingContainer}>
      <div className={styles.subEventsListingHeader}>
        <div>
          <p className={styles.subEventHeading}>Sub Events @ IEDC Summit 2024</p>
          <p className={styles.helperText}>Select the events you want to participate in.</p>
        </div>
        <div
          className='row'
          style={{
            columnGap: '0.5rem',
          }}
        >
          <input
            type='text'
            placeholder='Search by Title'
            className={styles.searchInput}
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <Select
            options={availableLocations.map((location) => ({ value: location, label: location }))}
            value={selectedLocation ? { value: selectedLocation, label: selectedLocation } : null}
            onChange={(newValue) => setSelectedLocation(newValue ? newValue.value : undefined)}
            styles={customStyles}
            placeholder='Filter by Location'
          />
        </div>
      </div>

      {subEvents && groupedEvents && Object.keys(groupedEvents).length > 0 ? (
        Object.keys(groupedEvents).map((date) => (
          <div key={date} className={styles.dayEventsContainer}>
            <p className={styles.dateHeader}>{date}</p>
            <div className={styles.timeContainer}>
              {Object.keys(groupedEvents[date]).map((time) => (
                <div key={time} className={styles.timeBlock}>
                  <div
                    className={styles.timeHeaderContainer}
                    onClick={() => toggleTimeExpansion(date, time)}
                  >
                    <p className={styles.timeHeader}>
                      {time === 'No Specific Time' ? '' : 'Events at'} {time}
                    </p>
                    {expandedTimes[`${date}-${time}`] ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  <AnimatePresence>
                    {expandedTimes[`${date}-${time}`] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={styles.eventsContainer}
                      >
                        {groupedEvents[date][time].map((event) => (
                          <div key={event.id} className={styles.event}>
                            {event.already_booked && (
                              <p className={styles.registedTag}>Registered</p>
                            )}
                            <div
                              className={`${styles.eventCard} ${
                                selectedEventsIds.find(
                                  (e) => e.id === event.id && !event.already_booked,
                                )
                                  ? styles.selectedCard
                                  : undefined
                              }`}
                              onClick={() => {
                                if (
                                  !event.conflicting_event &&
                                  !event.already_booked &&
                                  (event.capacity_left > 0 || event.capacity_left === null)
                                ) {
                                  handleSelectEvent(event);
                                }
                              }}
                            >
                              <div className={styles.innerCard}>
                                <div
                                  className={`${styles.eventDetails} ${(event.conflicting_event || !(event.capacity_left > 0 || event.capacity_left === null)) && styles.disabledCard}`}
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
                                    {event.capacity_left != null && (
                                      <div
                                        className='row'
                                        style={{
                                          columnGap: '0.25rem',
                                        }}
                                      >
                                        <BsFillPeopleFill size={18} color='#E5E5E5' />
                                        <span className={styles.capacityText}>
                                          {event.capacity_left >= 0 ? event.capacity_left : 0} Left
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
                                      {!event.conflicting_event &&
                                        (event.capacity_left > 0 ||
                                          event.capacity_left === null ||
                                          event.already_booked) && (
                                          <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            className={styles.cardPrimaryButton}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (event.already_booked)
                                                setSubEventToRemove(event.id);
                                              else if (
                                                event.capacity_left > 0 ||
                                                event.capacity_left === null
                                              )
                                                handleSelectEvent(event);
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

                                {!event.already_booked &&
                                  (event.conflicting_event ||
                                    (event.capacity_left !== null && event.capacity_left <= 0)) && (
                                    <motion.div
                                      className={styles.conflictIcon}
                                      whileHover={{ scale: 1.2 }}
                                      onClick={() => {
                                        if (event.capacity_left <= 0) {
                                          toast.error(
                                            'This event is fully booked. No more capacity left.',
                                          );
                                        } else {
                                          toast.error(
                                            `The time of this event clashes with ${event.conflicting_event}. Kindly unselect it to register.`,
                                          );
                                        }
                                      }}
                                      title={
                                        event.capacity_left <= 0
                                          ? 'This event is fully booked. No more capacity left.'
                                          : `The time of this event clashes with ${event.conflicting_event}. Kindly reorder to register.`
                                      }
                                    >
                                      <BiSolidError color='#f04b4b' size={20} />
                                    </motion.div>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className={styles.noEventsContainer}>
          <p className={styles.noEventsText}>No Events Found</p>
        </div>
      )}
    </div>
  );
};

export default SubEventListing;
