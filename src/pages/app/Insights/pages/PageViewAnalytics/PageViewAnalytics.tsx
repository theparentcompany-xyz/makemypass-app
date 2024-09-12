// import { useEffect, useState } from 'react';

// import { getPageViewAnalytics } from '../../../../../apis/insights';
import EventHeader from '../../../../../components/EventHeader/EventHeader';
import Theme from '../../../../../components/Theme/Theme';

const PageViewAnalytics = () => {
  // const [pageViewAnalytics, setPageViewAnalytics] = useState({}); // EventPageViewAnalytics is a type
  // const eventId = JSON.parse(sessionStorage.getItem('eventData')!)?.event_id;

  // useEffect(() => {
  //   getPageViewAnalytics(eventId, setPageViewAnalytics);
  // }, []);

  return (
    <Theme>
      <EventHeader previousPageNavigate='-1' />
    </Theme>
  );
};

export default PageViewAnalytics;
