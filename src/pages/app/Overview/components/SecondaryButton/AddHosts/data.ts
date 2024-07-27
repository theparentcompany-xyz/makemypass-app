import { roles } from '../../../../../../../services/enums';

const roleOptions = [
  { value: roles.ADMIN, label: roles.ADMIN },
  { value: roles.OWNER, label: roles.OWNER },
  { value: roles.EDITOR, label: roles.EDITOR },
  { value: roles.VIEWER, label: roles.VIEWER },
  { value: roles.VOLUNTEER, label: roles.VOLUNTEER },
];

export default roleOptions;
