import { Dispatch, useEffect } from 'react';
import { ErrorMessages, FormDataType, FormFieldType, TicketType } from '../../apis/types';
import { customStyles, getIcon } from '../../pages/app/EventPage/constants';
import InputFIeld from '../../pages/auth/Login/InputFIeld';
import styles from './DynamicForm.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { postAudio } from '../../apis/publicpage';
import Select, { MultiValue } from 'react-select';
import AudioRecorder from './components/AudioRecorder/AudioRecorder';
import { EventType } from '../../apis/types';
import Scanner from '../Scanner/Scanner';
import { SelectedGuest } from '../../pages/app/Guests/types';
import SelectDate from '../SelectDate/SelectDate';
import { Tickets } from '../../pages/app/EventPage/types';
import toast from 'react-hot-toast';
import { findMinDate } from '../../common/commonFunctions';
import { validateCondition } from './condition';
const DynamicForm = ({
  formFields,
  formErrors,
  formData,
  onFieldChange,
  ticketInfo,
  setTickets,
  eventData,
  setCashInHand,
  cashInHand,
  ticketCode,
  setTicketCode,
  showScanner,
  setShowScanner,
  selectedGuestId,
  selectedDate,
  setSelectedDate,
  tickets,
}: {
  formFields: FormFieldType[];
  formErrors: ErrorMessages;
  formData: FormDataType;
  onFieldChange: (fieldName: string, fieldValue: string | string[]) => void;
  setCashInHand?: React.Dispatch<React.SetStateAction<boolean>>;
  cashInHand?: boolean;
  ticketInfo?: { [key: string]: TicketType };
  setTickets?: Dispatch<React.SetStateAction<Tickets[]>>;
  eventData?: EventType;
  ticketCode?: string;
  setTicketCode?: Dispatch<React.SetStateAction<string>>;
  showScanner?: boolean;
  setShowScanner?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedGuestId?: SelectedGuest;
  selectedDate?: string;
  setSelectedDate?: React.Dispatch<React.SetStateAction<string>>;
  tickets?: Tickets[];
}) => {
  const variants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const handleDateChange = (date: string | null | undefined | Date) => {
    let newDate;
    if (date) newDate = new Date(date);
    if (newDate && eventData && setSelectedDate) {
      setSelectedDate(newDate.toISOString().split('T')[0]);
    }
  };

  useEffect(() => {
    if (eventData) handleDateChange(findMinDate(eventData));

  }, [eventData]);

  const handleAudioSubmit = (recordedBlob: Blob | null) => {
    if (recordedBlob && eventData?.id) {
      postAudio(eventData?.id, recordedBlob);
    }
  };
  return (
    <>
      <div className={styles.formFields}>
        {eventData?.parse_audio && <AudioRecorder handleSubmit={handleAudioSubmit} />}

        {ticketInfo && !showScanner && (
          <>
            {eventData && (
              <SelectDate
                eventData={eventData}
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
                type='addGuest'
                value={formData['entry_date']}
                onFieldChange={(fieldName, fieldValue) => onFieldChange(fieldName, fieldValue)}
              />
            )}
            {selectedGuestId?.type !== 'edit' && (
              <>
                <div
                  style={{
                    marginBottom: '1rem',
                  }}
                >
                  <p className={styles.formLabel}>Ticket Type</p>

                  <div className={styles.tickets}>
                    {Object.keys(ticketInfo).map((key) => {
                      return (
                        (ticketInfo[key].entry_date.length === 0 ||
                          (ticketInfo[key].entry_date.find((entry) => entry.date === selectedDate)
                            ?.capacity ?? 0) > 0) && (
                          <div className={styles.ticket}>
                            <p key={key} className={styles.ticketDetails}>
                              {key} - {ticketInfo[key]?.currency}{' '}
                              {ticketInfo[key].entry_date?.find(
                                (entry) => entry.date === selectedDate,
                              )?.price || ticketInfo[key]?.price}
                            </p>

                            <input
                              placeholder='Enter Ticket Count'
                              type='number'
                              className={styles.ticketCountInput}
                              onChange={(event) => {
                                if (event.target.value != '' && Number(event.target.value) < 0) {
                                  toast.error('Ticket count cannot be negative');
                                  event.target.value = '0';
                                  return;
                                }

                                if (
                                  ticketInfo[key].entry_date.length !== 0 &&
                                  event.target.value != '' &&
                                  Number(event.target.value) >
                                    (ticketInfo[key].entry_date.find(
                                      (entry) => entry.date === selectedDate,
                                    )?.capacity ?? 0)
                                ) {
                                  toast.error('Ticket Limit Exceeded');
                                  event.target.value = '0';
                                  return;
                                }

                                const tempTickets = tickets?.map((ticket) => {
                                  if (ticket.ticket_id === ticketInfo[key].id) {
                                    ticket.count = event.target.value
                                      ? Number(event.target.value)
                                      : 0;
                                  }
                                  return ticket;
                                });

                                if (tempTickets)
                                  setTickets &&
                                    setTickets((prevTickets) =>
                                      prevTickets.map((ticket) => {
                                        if (ticket.ticket_id === ticketInfo[key].id) {
                                          ticket.my_ticket = true;
                                          ticket.count = event.target.value
                                            ? Number(event.target.value)
                                            : 0;
                                        }

                                        return ticket;
                                      }),
                                    );
                                else {
                                  event.target.value = '0';
                                  // tempTickets = tempTickets?.map((ticket) => {
                                  //   if (ticket.ticket_id === ticketInfo[key].id) {
                                  //     ticket.count = 0;
                                  //   }
                                  //   return ticket;
                                  // });
                                }

                                const ticketCount = tempTickets?.reduce(
                                  (sum, ticket) => sum + (ticket.count ?? 0),
                                  0,
                                );

                                if (ticketCount && ticketCount > 0 && ticketInfo[key].price > 0) {
                                  setCashInHand && setCashInHand(true);
                                } else {
                                  setCashInHand && setCashInHand(false);
                                }
                              }}
                            />

                            {ticketInfo[key].entry_date.length > 0 && (
                              <p className={styles.ticketCount}>
                                {
                                  ticketInfo[key].entry_date.find(
                                    (entry) => entry.date === selectedDate,
                                  )?.capacity
                                }{' '}
                                tickets left
                              </p>
                            )}
                          </div>
                        )
                      );
                    })}
                  </div>
                </div>
                <div
                  style={{
                    marginBottom: '1rem',
                  }}
                >
                  <p className={styles.formLabel}>Scan Ticket Type</p>
                  <div className={styles.scanTicketCodeContainer}>
                    <input
                      disabled
                      type='text'
                      id='ticket_code'
                      name='ticket_code'
                      value={ticketCode}
                      className={styles.scanTicketCodeInput}
                      placeholder='Enter Ticket Code'
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setTicketCode && setTicketCode(e.target.value);
                      }}
                    />
                    <button
                      onClick={() => {
                        if (setShowScanner) setShowScanner(true);
                      }}
                      className={styles.scanTicketCodeButton}
                    >
                      Scan
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {selectedGuestId?.type !== 'edit' && cashInHand && !showScanner && (
          <div
            style={{
              marginBottom: '1rem',
            }}
          >
            <p className={styles.formLabel}>Cash In Hand*</p>
            <div className={styles.checkboxContainer}>
              <>
                <div className={styles.checkbox}>
                  <input
                    type='radio'
                    id='is_cash_in_hand'
                    name='is_cash_in_hand'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (setCashInHand) setCashInHand(e.target.checked);
                      onFieldChange('is_cash_in_hand', e.target.checked ? 'true' : 'false');
                    }}
                    className={styles.checkboxInput}
                  />
                  <label>Yes</label>
                </div>
                <div className={styles.checkbox}>
                  <input
                    type='radio'
                    id='is_cash_in_hand'
                    name='is_cash_in_hand'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (setCashInHand) setCashInHand(e.target.checked);
                      onFieldChange('is_cash_in_hand', e.target.checked ? 'false' : 'true');
                    }}
                    className={styles.checkboxInput}
                    defaultChecked
                  />
                  <label>No</label>
                </div>
              </>
            </div>
          </div>
        )}
        {/* <hr className={styles.line} /> */}
        {!showScanner &&
          formFields?.map((field: FormFieldType) => {
            const fieldTitle = field?.title + (field.required ? '*' : '');
            if (!validateCondition(field.conditions, formData, formFields) || field.hidden)
              return null;
            if (field.type === 'text' || field.type === 'email' || field.type === 'phonenumber') {
              return (
                <InputFIeld
                  name={field.field_key}
                  placeholder={field?.title}
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
                  description={field.description}
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
                            (option: { value: string }) =>
                              option.value === formData[field.field_key],
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
                  <p className={styles.fieldDescription}>{field.description}</p>
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
            } else if (field.type === 'file') {
              return (
                <div
                  style={{
                    marginBottom: '1rem',
                  }}
                  className={styles.fileInputContainer}
                >
                  <p className={styles.formLabel}>{fieldTitle}</p>
                  <input
                    type='file'
                    id={field.field_key}
                    accept={field.property?.extension_types.join(',') ?? ''}
                    name={field?.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files) onFieldChange(field.field_key, e.target.files as any);
                    }}
                    className={styles.fileInput}
                    multiple
                  />
                </div>
              );
            } else if (field.type === 'date') {
              return (
                <div
                  style={{
                    marginBottom: '1rem',
                  }}
                >
                  <p className={styles.formLabel}>{fieldTitle}</p>
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
                </div>
              );
            } else if (field.type === 'datetime') {
              return (
                <div
                  style={{
                    marginBottom: '1rem',
                  }}
                >
                  <p className={styles.formLabel}>{fieldTitle}</p>
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
                </div>
              );
            } else if (field.type === 'time') {
              return (
                <div
                  style={{
                    marginBottom: '1rem',
                  }}
                >
                  <p className={styles.formLabel}>{fieldTitle}</p>
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
                </div>
              );
            } else if (field.type === 'number') {
              return (
                <div
                  style={{
                    marginBottom: '1rem',
                  }}
                >
                  <p className={styles.formLabel}>{fieldTitle}</p>
                  <input
                    type='number'
                    id={field.field_key}
                    name={field?.title}
                    value={formData[field.field_key]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onFieldChange(field.field_key, e.target.value)
                    }
                    className={styles.dateInput}
                  />
                </div>
              );
            } else if (field.type === 'rating') {
              return (
                <div
                  style={{
                    marginBottom: '1rem',
                  }}
                >
                  <p className={styles.formLabel}>{fieldTitle}</p>
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className={`${styles.star} ${index < Number(formData[field.field_key]) ? styles.selected : ''}`}
                      onClick={() => onFieldChange(field.field_key, String(index + 1))}
                    >
                      {index < Number(formData[field.field_key]) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              );
            } else if (field.type === 'checkbox') {
              return (
                <div
                  style={{
                    marginBottom: '1rem',
                  }}
                >
                  <p className={styles.formLabel}>{fieldTitle}</p>
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
            }
          })}
        {showScanner && (
          <Scanner
            ticketId={ticketCode}
            setTicketId={setTicketCode}
            trigger={true}
            setTrigger={() => {
              if (setShowScanner) setShowScanner(false);
            }}
            scanCount={0}
          />
        )}
      </div>
    </>
  );
};

export default DynamicForm;
