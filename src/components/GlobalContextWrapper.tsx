import { Outlet, useNavigate, useParams } from 'react-router';
import { getEventId } from '../apis/events';
import { GlobalContext } from '../contexts/globalContext';
import React, { Suspense, useEffect } from 'react';
import Loader from './Loader';

const GlobalContextWrapper = () => {
  const [eventId, setEventId] = React.useState<string>('');
  const { eventTitle } = useParams<{ eventTitle: string }>();

  const [currentUserRole, setCurrentUserRole] = React.useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!eventTitle) return;

    const eventData = JSON.parse(localStorage.getItem('eventData') as string);

    if (eventData) {
      if (eventData.event_name !== eventTitle) {
        localStorage.removeItem('eventData');
        getEventId(eventTitle, navigate, setEventId, setCurrentUserRole);
        console.log('Event Data Mismatch at GCW');
      } else {
        setEventId(eventData.event_id);
        setCurrentUserRole([eventData?.current_user_role]);
        console.log('GCW Role: ', eventData?.current_user_role);
        console.log('Event Data Match at GCW');
      }
    } else {
      getEventId(eventTitle, navigate, setEventId, setCurrentUserRole);
      console.log('No Event Data at GCW');
    }
  }, [eventTitle]);

  return (
    <GlobalContext.Provider value={{ eventId, setEventId, currentUserRole }}>
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </GlobalContext.Provider>
  );
};

export default GlobalContextWrapper;
