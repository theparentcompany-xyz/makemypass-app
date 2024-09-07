import { useEffect,useState } from 'react';
import { Navigate,useParams } from 'react-router-dom';

import { setEventInfoLocal } from '../src/apis/events';
import Loader from '../src/components/Loader.tsx';

interface RoleCheckerProps {
  children: JSX.Element;
  roles: string[];
}

const RoleChecker = ({ children, roles }: RoleCheckerProps) => {
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [readyToRender, setReadyToRender] = useState(false);
  const { eventTitle } = useParams<{ eventTitle: string }>();

  useEffect(() => {
      const eventData = sessionStorage.getItem('eventData');
      const currentTitle = eventData ? JSON.parse(eventData).event_name : null;
      const role = eventData ? JSON.parse(eventData).current_user_role : null;

      if (eventTitle && eventTitle !== currentTitle) {
        setEventInfoLocal(eventTitle).then((data) => {
          setCurrentUserRole(data.current_user_role);
          setReadyToRender(true);
        });
      } else {
        setCurrentUserRole(role);
        setReadyToRender(true);
      }
  }, [eventTitle]);

  if (!readyToRender) {
    return <Loader />;
  }

  return roles.includes(currentUserRole!) ? children : <Navigate to="/" replace={true} />;
};

export default RoleChecker;
