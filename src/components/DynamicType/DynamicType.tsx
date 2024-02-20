import { Dispatch } from 'react';
import { ErrorMessages, FormData, FormField } from '../../apis/types';
import { customStyles, getIcon } from '../../pages/app/EventPage/constants';
import { TicketOptions } from '../../pages/app/EventPage/types';
import InputFIeld from '../../pages/auth/Login/InputFIeld';
import styles from './DynamicType.module.css';
import { motion, AnimatePresence } from 'framer-motion';

import Select from 'react-select';

const DynamicType = ({
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
  onFieldChange: (fieldName: string, fieldValue: string) => void;
  ticketInfo?: TicketOptions;
  setTicketId?: Dispatch<React.SetStateAction<string>>;
  ticketId?: string;
}) => {
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
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={styles.dropdown}
            >
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
                value={formData[field.field_key]}
                type={field.type}
                icon={getIcon(field.field_key)}
                required={field.required}
              />
            );
          } else if (field.type === 'dropdown' || field.type === 'checkbox') {
            return (
              <>
                <div
                  style={{
                    marginBottom: '1rem',
                  }}
                >
                  <p className={styles.formLabel}>
                    {field.title}
                    {field.required && '*'}
                  </p>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
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
                      isSearchable={false}
                    />
                  </motion.div>
                  <AnimatePresence>
                    {formErrors[field.field_key] && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
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
                <p className={styles.formLabel}>
                  {field.title}
                  {field.required && '*'}
                </p>
                <motion.textarea
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
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
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={styles.errorText}
                    >
                      {formErrors[field.field_key][0]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          }
        })}
      </div>
    </>
  );
};

export default DynamicType;
