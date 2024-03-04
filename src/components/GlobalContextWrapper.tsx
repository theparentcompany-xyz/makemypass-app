import { getEventId } from '../apis/events';
import { GlobalContext } from '../contexts/globalContext';
import React, { useEffect } from 'react';

const GlobalContextWrapper = ({ children }: { children: React.ReactNode }) => {
  const [eventId, setEventId] = React.useState<string>('');
  let url = window.location.href;

  let parts = url.split('/');
  let eventTitle = parts[3];

  useEffect(() => {
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
    <GlobalContext.Provider value={{ eventId, setEventId }}>{children}</GlobalContext.Provider>
  );
};

export default GlobalContextWrapper;
