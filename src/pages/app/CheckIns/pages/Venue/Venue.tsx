import { useEffect, useState } from 'react';
import EventHeader from '../../../../../components/EventHeader/EventHeader';
import Glance from '../../../../../components/Glance/Glance';
import Theme from '../../../../../components/Theme/Theme';
import styles from './Venue.module.css';
import { checkInUserVenue, listVenues } from '../../../../../apis/venue';
import { VenueType } from './types';
import Scanner from '../../../../../components/Scanner/Scanner';
import { MdError, MdVerified } from 'react-icons/md';

export type LogType = {
  message: string;
  timestamp: string;
  hasError: boolean;
};

const Venue = () => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [venues, setVenues] = useState<VenueType[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<VenueType | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [scanTrigger, setScanTrigger] = useState(false);

  const [scanLogs, setScanLogs] = useState<LogType[]>([]);

  useEffect(() => {
    listVenues(eventId, setVenues);
  }, [eventId]);

  useEffect(() => {
    if (ticketId.length > 0 && scanTrigger) {
      checkInUserVenue(ticketId, eventId, selectedVenue, setScanLogs);

      setTimeout(() => {
        setTicketId('');
      }, 2000);
    }
  }, [ticketId, scanTrigger]);

  return (
    <Theme>
      <div className={styles.mainContainer}>
        <EventHeader />
        <Glance tab='checkins' />

        <div className={styles.venueListingContainer}>
          <div className={styles.venueListing}>
            {!showScanner ? (
              <>
                <p className={styles.venueHeading}>
                  {venues.length > 0 ? 'Venue Listing' : 'No Venues Available'}
                </p>
                <p className={styles.helperText}>
                  {venues.length > 0
                    ? 'Select a venue to check-in guests'
                    : 'No venues available for check-in'}
                </p>
                <div className={styles.venues}>
                  {venues.length > 0 &&
                    venues.map((venue, index) => (
                      <div
                        key={index}
                        className={styles.venue}
                        onClick={() => {
                          setSelectedVenue(venue);
                          setShowScanner(true);
                        }}
                      >
                        {venue.name}
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
                    {selectedVenue ? `Checking in at ${selectedVenue.name}` : ''}
                  </p>
                </div>
                <Scanner
                  ticketId={ticketId}
                  setTicketId={setTicketId}
                  trigger={scanTrigger}
                  setTrigger={setScanTrigger}
                />

                <div className={styles.logs}>
                  <p className={styles.venueHeading}>
                    {scanLogs.length > 0 ? 'Scan Logs' : 'No Scans Yet'}
                  </p>
                  {scanLogs
                    .slice()
                    .reverse()
                    .map((log) => (
                      <div className={styles.logContainer}>
                        {log.hasError ? (
                          <MdError color='#f04b4b' size={20} />
                        ) : (
                          <MdVerified color='#47c97e' size={20} />
                        )}
                        <p className={styles.logMessage}>{log.message}</p>
                        <p className={styles.logTimestamp}>{log.timestamp}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Theme>
  );
};

export default Venue;
