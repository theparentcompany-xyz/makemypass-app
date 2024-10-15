import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { checkInUserSubEvent, listCheckInSubEvents } from '../../../../../apis/subevents';
import EventHeader from '../../../../../components/EventHeader/EventHeader';
import Scanner from '../../../../../components/Scanner/Scanner';
import Theme from '../../../../../components/Theme/Theme';
import DatePlace from '../../../SubEvents/components/DatePlace/DatePlace';
import ScanLogs from '../../components/ScanLogs/ScanLogs';
import ScannerResponseModal from '../../components/ScannerResponseModal/ScannerResponseModal';
import { LogType } from '../Venue/Venue';
import styles from './SubEvent.module.css';
import type { SubEventListType } from './types';

const SubEvent = () => {
  const [subEvents, setSubEvents] = useState<SubEventListType[]>([]);
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);

  const [selectedSubEvent, setSelectedSubEvent] = useState<SubEventListType | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [scanTrigger, setScanTrigger] = useState(false);

  const [scanLogs, setScanLogs] = useState<LogType[]>([]);

  const [message, setMessage] = useState<string>('');

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
                <p className={styles.subEventHeading}>
                  {subEvents.length > 0 ? 'SubEvent Listing' : 'No SubEvent Available'}
                </p>
                <p className={styles.helperText}>
                  {subEvents.length > 0
                    ? 'Select a sub-event to check-in guests'
                    : 'No subEvents available for check-in'}
                </p>
                <div className={styles.subEvents}>
                  {subEvents.length > 0 &&
                    subEvents.map((subevent, index) => (
                      <div
                        key={index}
                        className={styles.subevent}
                        onClick={() => {
                          setSelectedSubEvent(subevent);
                          setShowScanner(true);
                        }}
                      >
                        <div className={styles.event}>
                          <div>
                            <div className={styles.eventCard}>
                              <div className={styles.innerCard}>
                                <div className={styles.eventDetails}>
                                  <div className={styles.headingTexts}>
                                    <p className={styles.eventTitle}>{subevent?.title}</p>
                                  </div>

                                  <DatePlace event={subevent} />

                                  <div className='row'>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      className={styles.cardPrimaryButton}
                                    >
                                      Select
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
