import { ConditionType, FormDataType, FormFieldType } from '../../apis/types';

export const validateCondition = (
  conditions: ConditionType[] | undefined,
  formData: FormDataType,
  formFields: FormFieldType[],
) => {
  let valid = true;

  if (conditions) {
    // console.log('conditions', conditions);
    // console.log('formData', formData);
    // console.log('formFields', formFields);

    conditions.forEach(
      (condition: { field: string; operator: string; value: string | string[] }) => {
        const fieldName = formFields
          .find((field) => field.id === condition.field)
          ?.field_key.toLowerCase();

        const fieldValue = fieldName ? formData[fieldName] : undefined;

        if (condition.operator === 'empty' && !fieldValue) {
          valid = true;
        } else if (fieldValue) {
          switch (condition.operator) {
            case '=':
              valid = valid && fieldValue === condition.value;
              break;
            case '!=':
              valid = valid && fieldValue !== condition.value;
              break;
            case '>=':
              valid = valid && Number(fieldValue) >= Number(condition.value);
              break;
            case '>':
              valid = valid && Number(fieldValue) > Number(condition.value);
              break;
            case '<':
              valid = valid && Number(fieldValue) < Number(condition.value);
              break;
            case '<=':
              valid = valid && Number(fieldValue) <= Number(condition.value);
              break;
            case 'in':
              if (typeof condition.value === 'string')
                if (Array.isArray(fieldValue)) {
                  valid = fieldValue?.includes(condition.value);
                } else valid = valid && condition.value?.includes(fieldValue);
              break;
            case 'not in':
              if (typeof condition.value === 'string')
                if (Array.isArray(fieldValue)) {
                  valid = valid && !fieldValue?.includes(condition.value);
                } else valid = valid && !condition.value?.includes(fieldValue);
              break;
            case 'empty':
              valid = valid && fieldValue === '';
              break;
            case 'not empty':
              valid = valid && fieldValue !== '';
              break;
            case 'contains':
              if (typeof fieldValue === 'string' && typeof condition.value === 'string')
                valid =
                  valid &&
                  fieldValue.toLocaleLowerCase()?.includes(condition.value.toLocaleLowerCase());
              break;
            case 'not contains':
              if (typeof fieldValue === 'string' && typeof condition.value === 'string')
                valid =
                  valid &&
                  !fieldValue.toLocaleLowerCase()?.includes(condition.value.toLocaleLowerCase());
              break;
            default:
              valid = true;
              break;
          }
        } else {
          valid = false;
        }

        // if (!valid) {
        //   const currentField = field.field_key;
        //   delete formData[currentField];
        // }
      },
    );
  }

  return valid;
};
