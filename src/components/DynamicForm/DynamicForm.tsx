import { AnimatePresence, motion } from 'framer-motion';
import Select, { MultiValue } from 'react-select';

import { ErrorMessages, FormDataType, FormFieldType } from '../../apis/types';
import UploadAttachement from '../../pages/app/EventGlance/components/MailModals/UpdateMail/components/UploadAttachement/UploadAttachements.tsx';
import type { previewType } from '../../pages/app/EventGlance/components/MailModals/UpdateMail/types.ts';
import {
  customStyles,
  dynamicFormCustomStyles,
  getIcon,
} from '../../pages/app/EventPage/constants';
import InputField from '../../pages/auth/Login/InputField.tsx';
import ValidateInput from '../ValidateInput/ValidateInput.tsx';
import { validateCondition } from './condition';
import styles from './DynamicForm.module.css';

const variants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const ErrorComponent = ({
  formErrors,
  field,
  variants,
}: {
  formErrors: ErrorMessages;
  field: FormFieldType;
  variants: {
    initial: { opacity: number; y: number };
    animate: { opacity: number; y: number };
    exit: { opacity: number; y: number };
  };
}) => {
  return (
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
  );
};

const CommonRenderStructure = ({
  formErrors,
  field,
  children,
  title,
  description,
}: {
  formErrors: ErrorMessages;
  field: FormFieldType;
  children: JSX.Element;
  title?: string;
  description?: string;
}) => {
  const fields = ['phone', 'radio', 'checkbox', 'file'];
  return (
    <div
      style={{
        marginBottom: fields.includes(field.type) ? '16px' : '8px',
      }}
    >
      {/* FIX: This is repetative, some inputs are using the Input Container's Label and Title */}
      {title && <p className={styles.formLabel}>{title}</p>}
      {description && <p className={styles.formDescription}>{description}</p>}
      {children}
      <ErrorComponent formErrors={formErrors} field={field} variants={variants} />
    </div>
  );
};

const DynamicForm = ({
  formFields,
  formErrors,
  formData,
  onFieldChange,
  previews,
  handleFileChange,
  handleDeleteAttachment,
}: {
  formFields: FormFieldType[];
  formErrors: ErrorMessages;
  formData: FormDataType;
  onFieldChange: (fieldName: string, fieldValue: string | string[]) => void;
  previews?: previewType[];
  handleFileChange?: (event: React.ChangeEvent<HTMLInputElement>, field: FormFieldType) => void;
  handleDeleteAttachment?: (index: number) => void;
}) => {
  return (
    <>
      <div className={styles.formFields}>
        {formFields?.map((field: FormFieldType) => {
          const fieldTitle = field?.title + (field.required ? '*' : '');
          if (!validateCondition(field.conditions, formData, formFields) || field.hidden)
            return null;

          if (field.type === 'text' || field.type === 'email') {
            return field.validate ? (
              <CommonRenderStructure formErrors={formErrors} field={field}>
                <ValidateInput
                  name={field.field_key}
                  placeholder={field?.title}
                  id={field.id}
                  key={field.id}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onFieldChange(field.field_key, e.target.value)
                  }
                  value={formData[field.field_key] || ''}
                  type={field.type}
                  icon={getIcon(field.type)}
                  required={field.required}
                  description={field.description}
                />
              </CommonRenderStructure>
            ) : (
              <CommonRenderStructure formErrors={formErrors} field={field}>
                <InputField
                  name={field.field_key}
                  title={field?.title}
                  id={field.id}
                  key={field.id}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onFieldChange(field.field_key, e.target.value)
                  }
                  error={['']}
                  value={formData[field.field_key] || ''}
                  type={field.type}
                  icon={getIcon(field.type)}
                  required={field.required}
                  description={field.description}
                />
              </CommonRenderStructure>
            );
          } else if (field.type === 'phone') {
            return (
              <>
                <CommonRenderStructure
                  formErrors={formErrors}
                  field={field}
                  title={fieldTitle}
                  description={field.description}
                >
                  <input
                    type='text'
                    id={field.field_key}
                    name={field?.title}
                    value={formData[field.field_key]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (!/^\d*$/.test(e.target.value)) return;
                      onFieldChange(field.field_key, e.target.value);
                    }}
                    className={styles.numberInput}
                  />
                </CommonRenderStructure>
              </>
            );
          } else if (field.type === 'singleselect') {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
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
                    styles={dynamicFormCustomStyles}
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
              </CommonRenderStructure>
            );
          } else if (field.type === 'textarea') {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <motion.textarea
                  variants={variants}
                  transition={{
                    duration: 0.2,
                  }}
                  rows={4}
                  className={styles.textarea}
                  value={formData[field.field_key] || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    onFieldChange(field.field_key, e.target.value)
                  }
                />
              </CommonRenderStructure>
            );
          } else if (field.type === 'multiselect') {
            const selectValues =
              field.options?.map((option: string) => ({
                value: option,
                label: option,
              })) ?? [];
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <Select
                  isMulti
                  styles={customStyles}
                  name='colors'
                  value={
                    Array.isArray(formData[field.field_key])
                      ? selectValues.filter((option) =>
                          (formData[field.field_key] as string[])?.includes(option.value),
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
              </CommonRenderStructure>
            );
          } else if (field.type === 'radio') {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
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
              </CommonRenderStructure>
            );
          } else if (field.type === 'date') {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <input
                  type='date'
                  id={field.field_key}
                  name={field?.title}
                  value={formData[field.field_key]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onFieldChange(field.field_key, e.target.value)
                  }
                  className={styles.dateInput}
                />
              </CommonRenderStructure>
            );
          } else if (field.type === 'datetime') {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <input
                  type='datetime-local'
                  id={field.field_key}
                  name={field?.title}
                  value={formData[field.field_key]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onFieldChange(field.field_key, e.target.value)
                  }
                  className={styles.dateInput}
                />
              </CommonRenderStructure>
            );
          } else if (field.type === 'time') {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <input
                  type='time'
                  id={field.field_key}
                  name={field?.title}
                  value={formData[field.field_key]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onFieldChange(field.field_key, e.target.value)
                  }
                  className={styles.dateInput}
                />
              </CommonRenderStructure>
            );
          } else if (field.type === 'number') {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <input
                  type='number'
                  id={field.field_key}
                  name={field?.title}
                  value={formData[field.field_key]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onFieldChange(field.field_key, e.target.value)
                  }
                  className={styles.numberInput}
                />
              </CommonRenderStructure>
            );
          } else if (field.type === 'rating') {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <>
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className={`pointer ${styles.star} ${index < Number(formData[field.field_key]) ? styles.selected : ''}`}
                      onClick={() => onFieldChange(field.field_key, String(index + 1))}
                    >
                      {index < Number(formData[field.field_key]) ? '★' : '☆'}
                    </span>
                  ))}
                </>
              </CommonRenderStructure>
            );
          } else if (field.type === 'checkbox') {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <div className={styles.checkboxContainer}>
                  {field.options?.map((option: string) => (
                    <>
                      <div key={option} className={styles.checkbox}>
                        <input
                          type='checkbox'
                          id={option}
                          name={field.field_key}
                          value={option}
                          checked={(formData[field.field_key] as string[])?.includes(option)}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value;
                            if ((formData[field.field_key] as string[])?.includes(value)) {
                              const newValues = (formData[field.field_key] as string[]).filter(
                                (val) => val !== value,
                              );

                              onFieldChange(field.field_key, newValues);
                            } else {
                              onFieldChange(field.field_key, [
                                ...(formData[field.field_key] as string[]),
                                value,
                              ]);
                            }
                          }}
                          className={styles.checkboxInput}
                        />
                        <label htmlFor={option}>{option}</label>
                      </div>
                    </>
                  ))}
                </div>
              </CommonRenderStructure>
            );
          } else if (
            field.type === 'file' &&
            handleFileChange &&
            handleDeleteAttachment &&
            previews
          ) {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <UploadAttachement
                  previews={previews}
                  handleFileChange={(event) => handleFileChange(event, field)}
                  handleDeleteAttachment={handleDeleteAttachment}
                  allowedFileTypes={field.property?.extension_types}
                />
              </CommonRenderStructure>
            );
          }
        })}
      </div>
    </>
  );
};

export default DynamicForm;
