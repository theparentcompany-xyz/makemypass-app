import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Select from 'react-select';

import { checkInUserSubEvent, listCheckInSubEvents } from '../../../../../apis/subevents';
import { formatDate, formatTime } from '../../../../../common/commonFunctions';
import EventHeader from '../../../../../components/EventHeader/EventHeader';
import Scanner from '../../../../../components/Scanner/Scanner';
import Theme from '../../../../../components/Theme/Theme';
import { customStyles } from '../../../EventPage/constants';
import DatePlace from '../../../SubEvents/components/DatePlace/DatePlace';
import ScanLogs from '../../components/ScanLogs/ScanLogs';
import ScannerResponseModal from '../../components/ScannerResponseModal/ScannerResponseModal';
import { LogType } from '../Venue/Venue';
import styles from './SubEvent.module.css';
import type { SubEventListType } from './types';

const groupEventsByDateAndTime = (events: SubEventListType[], place?: string, title?: string) => {
  return events
    .filter((event) => !place || event.place === place)
    .filter((event) => !title || event.title.toLowerCase().includes(title.toLowerCase()))
    .sort((a, b) => {
      const timeA = a.start_time ? new Date(a.start_time).getTime() : 0;
      const timeB = b.start_time ? new Date(b.start_time).getTime() : 0;
      return timeA - timeB;
    })
    .reduce((acc: Record<string, Record<string, SubEventListType[]>>, event) => {
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

const SubEvent = () => {
  const [subEvents, setSubEvents] = useState<SubEventListType[]>([]);
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [groupedEvents, setGroupedEvents] = useState<
    Record<string, Record<string, SubEventListType[]>>
  >(groupEventsByDateAndTime(subEvents));
  const [selectedSubEvent, setSelectedSubEvent] = useState<SubEventListType | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [scanTrigger, setScanTrigger] = useState(false);

  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [scanLogs, setScanLogs] = useState<LogType[]>([]);

  const [message, setMessage] = useState<string>('');

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
    if (subEvents.length > 0 && Object.keys(expandedTimes).length === 0 && groupedEvents) {
      const firstDate = Object.keys(groupedEvents)[0];
      const firstTime = groupedEvents[firstDate] ? Object.keys(groupedEvents[firstDate])[0] : '';
      if (firstDate && firstTime) {
        setExpandedTimes({ [`${firstDate}-${firstTime}`]: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subEvents, selectedLocation, searchTitle]);

  useEffect(() => {
    listCheckInSubEvents(eventId, setSubEvents);
  }, [eventId]);

  useEffect(() => {
    setMessage(scanLogs.length > 0 ? scanLogs[scanLogs.length - 1].message : '');
    // setIsError(scanLogs.length > 0 ? scanLogs[scanLogs.length - 1].hasError : false);
  }, [scanLogs]);

  useEffect(() => {
    if (ticketId.length > 0 && scanTrigger) {
      checkInUserSubEvent(ticketId, eventId, selectedSubEvent, setScanLogs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId, scanTrigger]);

  return (
    <Theme>
      <div className={styles.mainContainer}>
        <EventHeader previousPageNavigate='-1' />
        <ScannerResponseModal
          message={message}
          setMessage={setMessage}
          setTicketId={setTicketId}
          setTrigger={setScanTrigger}
        />
        <div className={styles.subEventListingContainer}>
          <div className={styles.subEventListing}>
            {!showScanner ? (
              <>
                <div className={styles.subEventListingHeader}>
                  <div>
                    <p className={styles.subEventHeading}>
                      {subEvents.length > 0 ? 'Sub Event Listing' : 'No SubEvent Available'}
                    </p>
                    <p className={styles.helperText}>
                      {subEvents.length > 0
                        ? 'Select a sub-event to check-in guests'
                        : 'No subEvents available for check-in'}
                    </p>
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
                      options={availableLocations.map((location) => ({
                        value: location,
                        label: location,
                      }))}
                      value={
                        selectedLocation
                          ? { value: selectedLocation, label: selectedLocation }
                          : null
                      }
                      onChange={(newValue) =>
                        setSelectedLocation(newValue ? newValue.value : undefined)
                      }
                      styles={customStyles}
                      placeholder='Filter by Location'
                    />
                  </div>
                </div>
                <div className={styles.subEvents}>
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
                                {expandedTimes[`${date}-${time}`] ? (
                                  <FaChevronUp />
                                ) : (
                                  <FaChevronDown />
                                )}
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
                                        <div className={`${styles.eventCard} `}>
                                          <div className={styles.innerCard}>
                                            <div className={`${styles.eventDetails}`}>
                                              <div className={styles.eventCardHeader}>
                                                <div className={styles.headingTexts}>
                                                  <p className={styles.eventTitle}>
                                                    {event?.title.length > 50
                                                      ? `${event.title.substring(0, 50)}...`
                                                      : event.title}
                                                  </p>
                                                </div>
                                                <DatePlace event={event} />
                                                <div
                                                  className='row'
                                                  style={{
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-end',
                                                  }}
                                                >
                                                  <div className='row'>
                                                    <p className={styles.checkInCount}>
                                                      {event.total_checkins}/
                                                      {event.total_registrations}
                                                    </p>
                                                    <p className={styles.checkInText}>Check-ins</p>
                                                  </div>

                                                  <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    className={styles.cardPrimaryButton}
                                                    onClick={() => {
                                                      setSelectedSubEvent(event);
                                                      setShowScanner(true);
                                                    }}
                                                  >
                                                    Select
                                                  </motion.button>
                                                </div>
                                              </div>
                                            </div>
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
              </>
            ) : (
              <div className={styles.scannerContainer}>
                <div className={styles.rowContainer}>
                  <button
                    className={styles.closeButton}
                    onClick={() => {
                      setShowScanner(false);
                      setTicketId('');
                      setScanTrigger(false);
                    }}
                  >
                    {'<'}
                  </button>
                  <p className={styles.checkInHeader}>
                    {selectedSubEvent ? `Checking in at ${selectedSubEvent.title}` : ''}
                  </p>
                </div>
                <Scanner
                  ticketId={ticketId}
                  setTicketId={setTicketId}
                  trigger={scanTrigger}
                  setTrigger={setScanTrigger}
                />

                <ScanLogs scanLogs={scanLogs} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Theme>
  );
};

export default SubEvent;
