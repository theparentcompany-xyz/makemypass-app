import { ConditionType, FormDataType, FormFieldType } from '../../apis/types';

enum ConditionalQuestionOperator {
  EQUAL = '=',
  NOT_EQUAL = '!=',
  IN = 'in',
  NOT_IN = 'not in',
  EMPTY = 'empty',
  NOT_EMPTY = 'not empty',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not contains',
  GREATER = '>',
  GREATER_EQUAL = '>=',
  LESS = '<',
  LESS_EQUAL = '<='
}

function parseInput(userInput: string): number | Date | never {
  // Try parsing as number
  if (!isNaN(parseFloat(userInput)) && isFinite(Number(userInput))) {
    return parseFloat(userInput);
  }

  // Try parsing as datetime
  const dateFormats = ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', 'HH:mm:ss'];
  for (const fmt of dateFormats) {
    const date = parseDate(userInput, fmt);
    if (date) {
      return date;
    }
  }

  // If parsing fails, throw an error
  throw new Error(`Unable to parse input: ${userInput}`);
}

function parseDate(dateStr: string, format: string): Date | null {
  const regexMap: { [key: string]: string } = {
    'YYYY': '(\\d{4})',
    'MM': '(\\d{2})',
    'DD': '(\\d{2})',
    'HH': '(\\d{2})',
    'mm': '(\\d{2})',
    'ss': '(\\d{2})',
  };

  let regexPattern = format;
  for (const key in regexMap) {
    regexPattern = regexPattern.replace(key, regexMap[key]);
  }

  const match = new RegExp(`^${regexPattern}$`).exec(dateStr);
  if (!match) {
    return null;
  }

  const dateParts: { [key: string]: number } = {};
  let index = 1;
  for (const key in regexMap) {
    if (format.includes(key)) {
      dateParts[key] = parseInt(match[index++], 10);
    }
  }

  const year = dateParts['YYYY'] || new Date().getFullYear();
  const month = (dateParts['MM'] || 1) - 1; // Months are zero-based in JS Date
  const day = dateParts['DD'] || 1;
  const hour = dateParts['HH'] || 0;
  const minute = dateParts['mm'] || 0;
  const second = dateParts['ss'] || 0;

  const date = new Date(year, month, day, hour, minute, second);
  return isNaN(date.getTime()) ? null : date;
}

function evaluate(operator: ConditionalQuestionOperator, userInput: string | string[], answer: string | string[]): boolean {
  switch (operator) {
    case ConditionalQuestionOperator.EQUAL:
      if (Array.isArray(userInput)) {
        return userInput.every(item => item === answer);
      }
      return userInput === answer;
    case ConditionalQuestionOperator.NOT_EQUAL:
      if (Array.isArray(userInput)) {
        return userInput.every(item => item !== answer);
      }
      return userInput !== answer;
    case ConditionalQuestionOperator.IN:
      if (Array.isArray(userInput)) {
        return userInput.some(item => Array.isArray(answer) ? answer.includes(item) : item === answer);
      }
      return Array.isArray(answer) ? answer.includes(userInput) : userInput === answer;
    case ConditionalQuestionOperator.NOT_IN:
      if (Array.isArray(userInput)) {
        return userInput.every(item => Array.isArray(answer) ? !answer.includes(item) : item !== answer);
      }
      return Array.isArray(answer) ? !answer.includes(userInput) : userInput !== answer;
    case ConditionalQuestionOperator.EMPTY:
      return userInput === '' || userInput === null || userInput === undefined || (Array.isArray(userInput) && userInput.length === 0);
    case ConditionalQuestionOperator.NOT_EMPTY:
      return !(userInput === '' || userInput === null || userInput === undefined || (Array.isArray(userInput) && userInput.length === 0));
    case ConditionalQuestionOperator.CONTAINS:
      if (!userInput) {
        return false;
      }
      return Array.isArray(userInput) ? userInput.includes(answer as string) : userInput.includes(answer as string);
    case ConditionalQuestionOperator.NOT_CONTAINS:
      if (!userInput) {
        return false;
      }
      return Array.isArray(userInput) ? !userInput.includes(answer as string) : !userInput.includes(answer as string);
    case ConditionalQuestionOperator.GREATER:
    case ConditionalQuestionOperator.GREATER_EQUAL:
    case ConditionalQuestionOperator.LESS:
    case ConditionalQuestionOperator.LESS_EQUAL:
      try {
        const parsedUserInput = parseInput(userInput as string);
        const parsedAnswer = parseInput(answer as string);
        if (operator === ConditionalQuestionOperator.GREATER) {
          return parsedUserInput > parsedAnswer;
        } else if (operator === ConditionalQuestionOperator.GREATER_EQUAL) {
          return parsedUserInput >= parsedAnswer;
        } else if (operator === ConditionalQuestionOperator.LESS) {
          return parsedUserInput < parsedAnswer;
        } else if (operator === ConditionalQuestionOperator.LESS_EQUAL) {
          return parsedUserInput <= parsedAnswer;
        }
      } catch (e) {
        return false;
      }
      break;
    default:
      return false;
  }
  return false;
}

export const validateCondition = (conditions: ConditionType[] | undefined, formData: FormDataType, formFields: FormFieldType[]) => {
  if (conditions) {
    for (let i = 0; i < conditions.length; i++) {
      const condition = conditions[i];
      const fieldName = formFields
        .find((field) => field.id === condition.field)
        ?.field_key.toLowerCase();

      const fieldValue = fieldName ? formData[fieldName] : '';
      if (!evaluate(condition.operator as ConditionalQuestionOperator, fieldValue, condition.value)) {
        return false;
      }
    }
  }
  return true;
};

