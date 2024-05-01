import toast from 'react-hot-toast';
import { Roles } from './types';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getEventId } from '../src/apis/events';

const RoleChecker = ({
  redirectPath,
  children,
  roles,
  toastTitle,
  toastDescription,
}: {
  redirectPath?: JSX.Element;
  children: JSX.Element;
  roles: Roles[];
  toastTitle?: string;
  toastDescription?: string;
}) => {
  const currentTitle = JSON.parse(sessionStorage.getItem('eventData')!)?.event_name;
  const currentUserRole = [JSON.parse(sessionStorage.getItem('eventData')!)?.current_user_role];
  const { eventTitle } = useParams();
  const navigate = useNavigate();

  if (eventTitle && eventTitle !== currentTitle) {
    getEventId(eventTitle, navigate);
  }

  const hasRoleNoFetch = (roles: Roles[]) => {
    return roles.some((role) => currentUserRole.includes(role));
  };

  if (hasRoleNoFetch(roles)) {
    console.log('Authorized');
    return children;
  } else {
    return redirectPath ? redirectPath : <Navigate to='/login' replace={true} />;
  }
};

export default RoleChecker;
