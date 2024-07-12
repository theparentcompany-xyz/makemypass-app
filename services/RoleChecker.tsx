// import { Roles } from './types';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getEventId } from '../src/apis/events';

const RoleChecker = ({
  redirectPath,
  children,
  roles,
}: {
  redirectPath?: JSX.Element;
  children: JSX.Element;
  roles: string[];
}) => {
  const currentTitle = JSON.parse(sessionStorage.getItem('eventData')!)?.event_name;
  const currentUserRole = [JSON.parse(sessionStorage.getItem('eventData')!)?.current_user_role];

  const { eventTitle } = useParams<{ eventTitle: string }>();
  const navigate = useNavigate();

  if (eventTitle && eventTitle !== currentTitle) {
    getEventId(eventTitle, navigate, window.location.pathname.slice(1));
  } else {
    const hasRoleNoFetch = (roles: string[]) => {
      return roles.some((role) => currentUserRole.includes(role));
    };

    if (hasRoleNoFetch(roles)) {
      return children;
    } else {
      return redirectPath ? redirectPath : <Navigate to='/login' replace={true} />;
    }
  }
};

export default RoleChecker;
