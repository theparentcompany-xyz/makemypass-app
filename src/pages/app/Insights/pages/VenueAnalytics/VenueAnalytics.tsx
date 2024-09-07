import { useEffect, useState } from 'react';
import EventHeader from '../../../../../components/EventHeader/EventHeader';
import Theme from '../../../../../components/Theme/Theme';
import styles from './VenueAnalytics.module.css';
import { getVenueAnalytics } from '../../../../../apis/insights';

const VenueAnalytics = () => {
  const [venueAnalytics, setVenueAnalytics] = useState([]);
  const eventId = JSON.parse(sessionStorage.getItem('eventData')!)?.event_id;

  useEffect(() => {
    getVenueAnalytics(eventId, setVenueAnalytics);
    console.log(venueAnalytics);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Theme>
      <div className={styles.detailedVenueAnalyticsContainer}>
        <EventHeader previousPageNavigate='-1' />
      </div>
    </Theme>
  );
};

export default VenueAnalytics;
