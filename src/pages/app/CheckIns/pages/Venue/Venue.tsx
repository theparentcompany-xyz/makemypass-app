import { useEffect, useState } from 'react';
import EventHeader from '../../../../../components/EventHeader/EventHeader';
import Theme from '../../../../../components/Theme/Theme';
import styles from './Venue.module.css';
import { checkInUserVenue, listVenues } from '../../../../../apis/venue';
import { VenueType } from './types';
import Scanner from '../../../../../components/Scanner/Scanner';
import ScanLogs from '../../components/ScanLogs/ScanLogs';
import ScannerResponseModal from '../../components/ScannerResponseModal/ScannerResponseModal';

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

  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    listVenues(eventId, setVenues);
  }, [eventId]);

  useEffect(() => {
    setMessage(scanLogs.length > 0 ? scanLogs[scanLogs.length - 1].message : '');
    setIsError(scanLogs.length > 0 ? scanLogs[scanLogs.length - 1].hasError : false);
  }, [scanLogs]);

  useEffect(() => {
    if (ticketId.length > 0 && scanTrigger) {
      checkInUserVenue(ticketId, eventId, selectedVenue, setScanLogs);

      setTimeout(() => {
        setTicketId('');
      }, 5000);
    }
  }, [ticketId, scanTrigger]);

  return (
    <Theme>
      <div className={styles.mainContainer}>
        <EventHeader />
        <ScannerResponseModal
          message={message}
          setMessage={setMessage}
          isError={isError}
          setIsError={setIsError}
        />
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

                <ScanLogs scanLogs={scanLogs} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Theme>
  );
};

export default Venue;
