import { Roles } from '../../../../../services/enums';
import { getLoggedInUserRole } from '../../../../common/commonFunctions';

export const checkUserHierarchy = (hostRole: Roles): boolean => {
  const userRole = getLoggedInUserRole() as Roles;

  const userRoleIndex = Object.values(Roles).indexOf(userRole);
  const hostRoleIndex = Object.values(Roles).indexOf(hostRole);

  if (userRole === Roles.OWNER) return true;

  if (userRoleIndex) return userRoleIndex < hostRoleIndex;
  return false;
};
