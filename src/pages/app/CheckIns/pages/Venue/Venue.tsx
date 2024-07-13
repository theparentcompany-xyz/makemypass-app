import { useEffect, useState } from 'react';
import EventHeader from '../../../../../components/EventHeader/EventHeader';
import Glance from '../../../../../components/Glance/Glance';
import Theme from '../../../../../components/Theme/Theme';
import styles from './Venue.module.css';
import { checkInUserVenue, listVenues } from '../../../../../apis/venue';
import { VenueType } from './types';
import SectionButton from '../../../../../components/SectionButton/SectionButton';
import Scanner from '../../../../../components/Scanner/Scanner';

const Venue = () => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [venues, setVenues] = useState<VenueType[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<VenueType | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [ticketId, setTicketId] = useState('');

  useEffect(() => {
    listVenues(eventId, setVenues);
  }, [eventId]);

  useEffect(() => {
    if (ticketId.length > 0 && showScanner) {
      checkInUserVenue(ticketId, eventId, selectedVenue, setShowScanner);
    }

    if (!showScanner) {
      setTicketId('');
      setSelectedVenue(null);
    }
  }, [ticketId, showScanner]);

  return (
    <Theme>
      <EventHeader />
      <Glance tab='checkins' />

      <div className={styles.venueListingContainer}>
        <div className={styles.venueListing}>
          <p className={styles.venueHeading}>
            {venues.length > 0 ? 'Venue Listing' : 'No Venues Available'}
          </p>
          <p className={styles.helperText}>
            {venues.length > 0
              ? 'Select a venue to check-in guests'
              : 'No venues available for check-in'}
          </p>
          {!showScanner ? (
            <div className={styles.venues}>
              {venues.length > 0 &&
                venues.map((venue) => (
                  <SectionButton
                    buttonText={venue.name}
                    buttonColor='#C33D7B'
                    onClick={() => {
                      setSelectedVenue(venue);
                      setShowScanner(true);
                    }}
                  />
                ))}
            </div>
          ) : (
            <Scanner
              ticketId={ticketId}
              setTicketId={setTicketId}
              trigger={showScanner}
              setTrigger={setShowScanner}
            />
          )}
        </div>
      </div>
    </Theme>
  );
};

export default Venue;
