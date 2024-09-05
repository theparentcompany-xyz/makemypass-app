import EventHeader from '../../../../../components/EventHeader/EventHeader';
import Theme from '../../../../../components/Theme/Theme';
import styles from './VenueAnalytics.module.css';

const VenueAnalytics = () => {
  return (
    <Theme>
      <EventHeader previousPageNavigate='-1' />
      <div className={styles.detailedVenueAnalyticsContainer}></div>
    </Theme>
  );
};

export default VenueAnalytics;
