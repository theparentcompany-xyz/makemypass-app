// import { useEffect, useState } from 'react';
import EventHeader from '../../../../../components/EventHeader/EventHeader';
import Theme from '../../../../../components/Theme/Theme';
import styles from './PerkAnalytics.module.css';
// import { getPerkAnalytics } from '../../../../../apis/insights';

const PerkAnalytics = () => {
  // const [perkAnalytics, setPerkAnalytics] = useState([]);
  // const eventId = JSON.parse(sessionStorage.getItem('eventData')!)?.event_id;

  // useEffect(() => {
  //   getPerkAnalytics(eventId, setPerkAnalytics);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  return (
    <Theme>
      <EventHeader previousPageNavigate='-1' />
      <div className={styles.perkAnalyticsContainer}></div>
    </Theme>
  );
};

export default PerkAnalytics;
