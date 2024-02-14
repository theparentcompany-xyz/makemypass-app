import { FC } from 'react';
import toast from 'react-hot-toast';
import { Roles } from './types';
import { Navigate } from 'react-router-dom';

interface AuthRoutesProps {
  redirectPath?: JSX.Element;
  children: JSX.Element;
  roles: Roles[];
  toastTitle?: string;
  toastDescription?: string;
}

let localRoles = 'Viewer';

function SecureAuthRoutes() {
  const hasRoleNoFetch = (roles: Roles[]) => {
    localRoles = localStorage.getItem('role') || '';
    return roles.some((role) => localRoles.includes(role));
  };
  const Func: FC<AuthRoutesProps> = ({
    redirectPath,
    children,
    roles,
    toastTitle,
    toastDescription,
  }): JSX.Element => {
    if (hasRoleNoFetch(roles)) {
      return children;
    } else {
      if (toast) {
        toast.error(
          `${toastTitle || 'Unauthorized'}: ${toastDescription || 'You are not authorized to view this page'}`,
        );
      }

      return redirectPath ? redirectPath : <Navigate to='/login' replace={true} />;
    }
  };

  return Func;
}
export default SecureAuthRoutes;
