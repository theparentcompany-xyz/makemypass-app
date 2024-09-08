import { Roles } from '../../../../../../services/enums';

const roleOptions = [
  { value: Roles.ADMIN, label: Roles.ADMIN },
  { value: Roles.OWNER, label: Roles.OWNER },
  { value: Roles.EDITOR, label: Roles.EDITOR },
  { value: Roles.VIEWER, label: Roles.VIEWER },
  { value: Roles.VOLUNTEER, label: Roles.VOLUNTEER },
];

export default roleOptions;
