import { ErrorMessages, FormDataType, FormFieldType } from '../../apis/types';
import { customStyles, getIcon } from '../../pages/app/EventPage/constants';
import InputField from '../../pages/auth/Login/InputField.tsx';
import styles from './DynamicForm.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import Select, { MultiValue } from 'react-select';
import { validateCondition } from './condition';
import ValidateInput from '../ValidateInput/ValidateInput.tsx';
import toast from 'react-hot-toast';
import React from 'react';

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
  return (
    <div
      style={{
        marginBottom: '1rem',
      }}
    >
      <p className={styles.formLabel}>{title}</p>
      <p className={styles.formDescription}>{description}</p>
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
}: {
  formFields: FormFieldType[];
  formErrors: ErrorMessages;
  formData: FormDataType;
  onFieldChange: (fieldName: string, fieldValue: string | string[]) => void;
}) => {
  const fileRef = React.useRef<HTMLInputElement>(null);

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
                  icon={getIcon(field.field_key)}
                  required={field.required}
                  description={field.description}
                />
              </CommonRenderStructure>
            ) : (
              <CommonRenderStructure formErrors={formErrors} field={field}>
                <InputField
                  name={field.field_key}
                  placeholder={field?.title}
                  id={field.id}
                  key={field.id}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onFieldChange(field.field_key, e.target.value)
                  }
                  error={['']}
                  value={formData[field.field_key] || ''}
                  type={field.type}
                  icon={getIcon(field.field_key)}
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
                    type='number'
                    id={field.field_key}
                    name={field?.title}
                    value={formData[field.field_key]}
                    placeholder={field?.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onFieldChange(field.field_key, e.target.value)
                    }
                    className={styles.numberInput}
                    accept=''
                    pattern='^\d{10}$'
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
                  placeholder={`Enter your ${field?.title}`}
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
          } else if (field.type === 'file') {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <input
                  type='file'
                  id={field.field_key}
                  accept={
                    field.property?.extension_types
                      ? field.property?.extension_types.join(',') ?? ''
                      : ''
                  }
                  ref={fileRef}
                  name={field?.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    let withinSize = true;
                    Array.from(e.target.files || []).forEach((file) => {
                      console.log(file);

                      if (file.size <= (field.property?.max_size ?? 0) * 1024) {
                        withinSize = withinSize && true;
                      } else {
                        withinSize = false;
                      }
                    });

                    if (e.target.files && withinSize)
                      onFieldChange(field.field_key, e.target.files as any);
                    else {
                      toast.error('File size is too large');
                      if (fileRef.current) fileRef.current.value = '';
                    }
                  }}
                  className={styles.fileInput}
                  multiple={field.property?.is_multiple}
                />
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
                  placeholder={field?.title}
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
          }
        })}
      </div>
    </>
  );
};

export default DynamicForm;
