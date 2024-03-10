import { Dispatch } from 'react';
import { ErrorMessages, FormData, FormField } from '../../apis/types';
import { customStyles, getIcon } from '../../pages/app/EventPage/constants';
import { TicketOptions } from '../../pages/app/EventPage/types';
import InputFIeld from '../../pages/auth/Login/InputFIeld';
import styles from './DynamicForm.module.css';
import { motion, AnimatePresence } from 'framer-motion';

import Select, { MultiValue } from 'react-select';

const DynamicForm = ({
  formFields,
  formErrors,
  formData,
  onFieldChange,
  ticketInfo,
  setTicketId,
  ticketId,
}: {
  formFields: FormField[];
  formErrors: ErrorMessages;
  formData: FormData;
  onFieldChange: (fieldName: string, fieldValue: string | string[]) => void;
  ticketInfo?: TicketOptions;
  setTicketId?: Dispatch<React.SetStateAction<string>>;
  ticketId?: string;
}) => {
  const variants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const validateCondition = (field: FormField) => {
    let valid = true;

    if (field.condition) {
      field.condition.forEach((condition) => {
        const fieldName = formFields
          .find((field) => field.id === condition.field)
          ?.field_key.toLowerCase();

        const fieldValue = fieldName ? formData[fieldName] : undefined;

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
            case 'in':
              if (Array.isArray(fieldValue)) {
                valid = fieldValue.includes(condition.value);
              } else valid = condition.value.includes(fieldValue);
              break;
            case 'not in':
              if (Array.isArray(fieldValue)) {
                valid = !fieldValue.includes(condition.value);
              } else valid = !condition.value.includes(fieldValue);
              break;
            case 'empty':
              valid = fieldValue === '';
              break;
            case 'not empty':
              valid = fieldValue !== '';
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
      });
    }

    return valid;
  };

  return (
    <>
      <div className={styles.formFields}>
        {ticketInfo && (
          <div
            style={{
              marginBottom: '1rem',
            }}
          >
            <p className={styles.formLabel}>Ticket Type</p>
            <motion.div className={styles.dropdown}>
              <Select
                options={Object.keys(ticketInfo).map((key) => ({
                  value: ticketInfo[key].id,
                  label: key,
                }))}
                styles={customStyles}
                onChange={(selectedOption: { value: string } | null) =>
                  setTicketId && setTicketId(selectedOption?.value || '')
                }
                value={
                  ticketInfo &&
                  Object.keys(ticketInfo)
                    .map((key) => ({
                      value: ticketInfo[key].id,
                      label: key,
                    }))
                    .filter((option: { value: string }) => option.value === ticketId)
                }
                placeholder={`Select an option`}
                isSearchable={false}
              />
            </motion.div>
          </div>
        )}
        {formFields?.map((field: FormField) => {
          const fieldTitle = field.title + (field.required ? '*' : '');
          if (!validateCondition(field)) return null;
          if (field.type === 'text' || field.type === 'email' || field.type === 'phonenumber') {
            return (
              <InputFIeld
                name={field.field_key}
                placeholder={field.title}
                id={field.id}
                key={field.id}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onFieldChange(field.field_key, e.target.value)
                }
                error={formErrors[field.field_key]}
                value={formData[field.field_key] || ''}
                type={field.type}
                icon={getIcon(field.field_key)}
                required={field.required}
              />
            );
          } else if (field.type === 'singleselect') {
            return (
              <>
                <div
                  style={{
                    marginBottom: '1rem',
                  }}
                >
                  <p className={styles.formLabel}>{fieldTitle}</p>
                  <motion.div
                    variants={variants}
                    transition={{
                      duration: 0.2,
                    }}
                    className={styles.dropdown}
                  >
                    <Select
                      options={field.options?.map((option: string) => ({
                        value: option,
                        label: option,
                      }))}
                      styles={customStyles}
                      onChange={(selectedOption: { value: string } | null) =>
                        onFieldChange(field.field_key, selectedOption?.value || '')
                      }
                      value={field.options
                        ?.map((option: string) => ({
                          value: option,
                          label: option,
                        }))
                        .filter(
                          (option: { value: string }) => option.value === formData[field.field_key],
                        )}
                      placeholder={`Select an option`}
                      isSearchable={true}
                    />
                  </motion.div>
                  <AnimatePresence>
                    {formErrors[field.field_key] && (
                      <motion.p
                        variants={variants}
                        transition={{
                          duration: 0.2,
                        }}
                        className={styles.errorText}
                      >
                        {formErrors[field.field_key][0]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </>
            );
          } else if (field.type === 'textarea') {
            return (
              <div
                style={{
                  marginBottom: '1rem',
                }}
              >
                <p className={styles.formLabel}>{fieldTitle}</p>
                <motion.textarea
                  variants={variants}
                  transition={{
                    duration: 0.2,
                  }}
                  rows={4}
                  className={styles.textarea}
                  value={formData[field.field_key]}
                  placeholder={`Enter your ${field.title}`}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    onFieldChange(field.field_key, e.target.value)
                  }
                />
                <AnimatePresence>
                  {formErrors[field.field_key] && (
                    <motion.p
                      variants={variants}
                      transition={{
                        duration: 0.2,
                      }}
                      className={styles.errorText}
                    >
                      {formErrors[field.field_key][0]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          } else if (field.type === 'multiselect') {
            const selectValues =
              field.options?.map((option: string) => ({
                value: option,
                label: option,
              })) ?? [];
            return (
              <>
                <div
                  style={{
                    marginBottom: '1rem',
                  }}
                >
                  <p className={styles.formLabel}>{fieldTitle}</p>
                  <Select
                    isMulti
                    styles={customStyles}
                    name='colors'
                    value={
                      formData[field.field_key]
                        ? selectValues.filter((option) =>
                            formData[field.field_key].includes(option.value),
                          )
                        : []
                    }
                    options={selectValues}
                    className='basic-multi-select'
                    classNamePrefix='select'
                    onChange={(selectedOption: MultiValue<{ value: string }>) =>
                      onFieldChange(
                        field.field_key,
                        selectedOption.map((option) => option.value),
                      )
                    }
                  />
                </div>
              </>
            );
          } else if (field.type === 'radio') {
            return (
              <div
                style={{
                  marginBottom: '1rem',
                }}
              >
                <p className={styles.formLabel}>{fieldTitle}</p>
                <div className={styles.radioContainer}>
                  {field.options?.map((option: string) => (
                    <div key={option} className={styles.radio}>
                      <input
                        type='radio'
                        id={option}
                        name={field.field_key}
                        value={option}
                        checked={formData[field.field_key] === option}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onFieldChange(field.field_key, e.target.value)
                        }
                        className={styles.radioInput}
                      />
                      <label htmlFor={option}>{option}</label>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        })}
      </div>
    </>
  );
};

export default DynamicForm;
