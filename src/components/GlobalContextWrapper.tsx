import { Outlet, useParams } from 'react-router';
import { getEventId } from '../apis/events';
import { GlobalContext } from '../contexts/globalContext';
import React, { Suspense, useEffect } from 'react';
import Loader from './Loader';

const GlobalContextWrapper = () => {
  const [eventId, setEventId] = React.useState<string>('');
  const { eventTitle } = useParams<{ eventTitle: string }>();

  useEffect(() => {
    if (!eventTitle) return;
    let eventData = JSON.parse(localStorage.getItem('eventData') as string);

    if (eventData) {
      if (eventData.event_name !== eventTitle) {
        localStorage.removeItem('eventData');
        getEventId(eventTitle ?? '');
        setTimeout(() => {
          eventData = JSON.parse(localStorage.getItem('eventData') as string);
          setEventId(eventData?.event_id);
        }, 100);
      } else {
        setEventId(eventData.event_id);
      }
    } else {
      getEventId(eventTitle ?? '');
      setTimeout(() => {
        eventData = JSON.parse(localStorage.getItem('eventData') as string);
        setEventId(eventData?.event_id);
      }, 100);
    }
  }, [eventTitle]);

  return (
    <GlobalContext.Provider value={{ eventId, setEventId }}>
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </GlobalContext.Provider>
  );
};

export default GlobalContextWrapper;
