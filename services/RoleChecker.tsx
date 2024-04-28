import toast from 'react-hot-toast';
import { Roles } from './types';
import { Navigate } from 'react-router-dom';
import { GlobalContext } from '../src/contexts/globalContext';
import { useContext } from 'react';

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
  const { currentUserRole } = useContext(GlobalContext);

  console.log('currentUserRole', currentUserRole);
  const hasRoleNoFetch = (roles: Roles[]) => {
    return roles.some((role) => currentUserRole.includes(role));
  };

  if (hasRoleNoFetch(roles)) {
    return children;
  } else {
    if (toast) {
      toast.error(
        `${toastTitle || 'Unauthorized'}: ${toastDescription || 'You are not authorized to view this page keeta'}`,
      );
    }

    return redirectPath ? redirectPath : <Navigate to='/login' replace={true} />;
  }
};

export default RoleChecker;
