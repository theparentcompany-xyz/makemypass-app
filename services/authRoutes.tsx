import { FC, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Roles } from './types';
import { Navigate } from 'react-router-dom';

interface AuthRoutesProps {
  redirectPath?:any;
  children: JSX.Element;
  roles: Roles[];
  toastTitle?: string;
  toastDescription?: string;
}

let localRoles = 'Viewer';

export const refreshRoles = () => {
  localRoles = localStorage.getItem('role') || '';
  return localRoles;
};
function SecureAuthRoutes() {
  const hasRoleNoFetch = (roles: Roles[]) => {
    localRoles = refreshRoles();
    return roles.some((role) => localRoles.includes(role));
  };
  const func: FC<AuthRoutesProps> = ({
    redirectPath,
    children,
    roles,
    toastTitle,
    toastDescription,
  }): JSX.Element => {
    if (hasRoleNoFetch(roles)) {
      return children;
    } else {
      useEffect(() => {
        if (toast) {
          toast.error(`${toastTitle || 'Unauthorized'}: ${toastDescription || 'You are not authorized to view this page'}`);
        }
      }, [toast]);

      return redirectPath ? (
        redirectPath
    ) : (
        <Navigate to="/login" replace={true} />
    );
    }
  };

  return func;
}
export default SecureAuthRoutes;
