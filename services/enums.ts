export enum Roles {
  ADMIN = 'Admin',
  OWNER = 'Owner',
  VOLUNTEER = 'Volunteer',
  GAMER = 'Gamer',
  VIEWER = 'Viewer',
  EDITOR = 'Editor',
}

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
