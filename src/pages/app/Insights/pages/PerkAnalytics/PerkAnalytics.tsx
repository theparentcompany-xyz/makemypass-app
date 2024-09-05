import EventHeader from '../../../../../components/EventHeader/EventHeader';
import Theme from '../../../../../components/Theme/Theme';
import styles from './PerkAnalytics.module.css';

const PerkAnalytics = () => {
  return (
    <Theme>
      <EventHeader previousPageNavigate='-1' />
      <div className={styles.perkAnalyticsContainer}></div>
    </Theme>
  );
};

export default PerkAnalytics;
