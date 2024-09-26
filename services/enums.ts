export enum Roles {
  OWNER = 'Owner',
  ADMIN = 'Admin',
  EDITOR = 'Editor',
  VIEWER = 'Viewer',
  VOLUNTEER = 'Volunteer',
  DEVICE = 'Device',
}

export const TillRoles = {
  OWNER: [Roles.OWNER],
  ADMIN: [Roles.OWNER, Roles.ADMIN],
  EDITOR: [Roles.OWNER, Roles.ADMIN, Roles.EDITOR],
  VIEWER: [Roles.OWNER, Roles.ADMIN, Roles.EDITOR, Roles.VIEWER],
  VOLUNTEER: [Roles.OWNER, Roles.ADMIN, Roles.EDITOR, Roles.VIEWER, Roles.VOLUNTEER],
  DEVICE: [Roles.OWNER, Roles.ADMIN, Roles.EDITOR, Roles.VIEWER, Roles.VOLUNTEER, Roles.DEVICE],
};

export enum ConditionalQuestionOperator {
  EQUALS = '=',
  NOT_EQUALS = '!=',
  IN = 'in',
  NOT_IN = 'not in',
  EMPTY = 'empty',
  NOT_EMPTY = 'not empty',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not contains',
  GREATER_THAN = '>',
  GREATER_THAN_OR_EQUAL = '>=',
  LESS_THAN = '<',
  LESS_THAN_OR_EQUAL = '<=',
}
