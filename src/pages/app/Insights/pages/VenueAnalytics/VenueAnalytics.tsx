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
  }, []);
  return (
    <Theme>
      <EventHeader previousPageNavigate='-1' />
      <div className={styles.detailedVenueAnalyticsContainer}></div>
    </Theme>
  );
};

export default VenueAnalytics;
