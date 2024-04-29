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
      } else {
        setEventId(eventData.event_id);
        setCurrentUserRole([eventData?.current_user_role]);
      }
    } else {
      getEventId(eventTitle, navigate, setEventId, setCurrentUserRole);
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
