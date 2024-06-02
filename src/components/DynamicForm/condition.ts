import { FormDataType, FormFieldType, TicketType } from '../../apis/types';

export const validateCondition = (
  field: FormFieldType | TicketType,
  formData: FormDataType,
  formFields: FormFieldType[],
) => {
  let valid = true;

  if (field.conditions) {
    field.conditions.forEach(
      (condition: { field: string; operator: string; value: string | string[] }) => {
        const fieldName = formFields
          .find((field) => field.id === condition.field)
          ?.field_key.toLowerCase();

        console.log('fieldName', fieldName);

        const fieldValue = fieldName ? formData[fieldName] : undefined;

        console.log('fieldValue', fieldValue);
        console.log('condition', fieldValue === condition.value);

        if (condition.operator === 'empty' && !fieldValue) {
          valid = true;
        } else if (fieldValue) {
          switch (condition.operator) {
            case '=':
              valid = fieldValue === condition.value;
              break;
            case '!=':
              valid = fieldValue !== condition.value;
              break;
            case '>=':
              valid = Number(fieldValue) >= Number(condition.value);
              break;
            case '>':
              valid = Number(fieldValue) > Number(condition.value);
              break;
            case '<':
              valid = Number(fieldValue) < Number(condition.value);
              break;
            case '<=':
              valid = Number(fieldValue) <= Number(condition.value);
              break;
            case 'in':
              if (typeof condition.value === 'string')
                if (Array.isArray(fieldValue)) {
                  valid = fieldValue?.includes(condition.value);
                } else valid = condition.value?.includes(fieldValue);
              break;
            case 'not in':
              if (typeof condition.value === 'string')
                if (Array.isArray(fieldValue)) {
                  valid = !fieldValue?.includes(condition.value);
                } else valid = !condition.value?.includes(fieldValue);
              break;
            case 'empty':
              valid = fieldValue === '';
              break;
            case 'not empty':
              valid = fieldValue !== '';
              break;
            case 'contains':
              if (typeof fieldValue === 'string' && typeof condition.value === 'string')
                valid = fieldValue
                  .toLocaleLowerCase()
                  ?.includes(condition.value.toLocaleLowerCase());
              break;
            case 'not contains':
              if (typeof fieldValue === 'string' && typeof condition.value === 'string')
                valid = !fieldValue
                  .toLocaleLowerCase()
                  ?.includes(condition.value.toLocaleLowerCase());
              break;
            default:
              valid = true;
              break;
          }
        } else {
          valid = false;
        }

        if (!valid) {
          const currentField = field.field_key;
          delete formData[currentField];
        }
      },
    );
  }

  return valid;
};
