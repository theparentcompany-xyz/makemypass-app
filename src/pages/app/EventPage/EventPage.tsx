import styles from './EventPage.module.css';
import Theme from '../../../components/Theme/Theme';
import { FiClock } from 'react-icons/fi';
import { IoLocationOutline } from 'react-icons/io5';
import InputFIeld from '../../auth/Login/InputFIeld';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners';
import { getEventId } from '../../../apis/events';
import {
  applyCoupon,
  getEventDatas,
  getFormFields,
  getTickets,
  registerUpdateView,
  submitForm,
  validateRsvp,
} from '../../../apis/publicpage';
import { DiscountData, TicketOptions } from './types';
import { AnimatePresence, motion } from 'framer-motion';

import Select from 'react-select';
import { showRazorpay } from './components/Razorpay';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import { FormData, FormField } from '../../../apis/types';
import { customStyles, discountedTicketPrice, getIcon } from './constants';

const EventPage = () => {
  const { eventTitle } = useParams<{ eventTitle: string }>();
  const [ticketInfo, setTicketInfo] = useState<TicketOptions>();

  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [ticketId, setTicketId] = useState<string>('');
  const [eventData, setEventData] = useState<any>({});
  const [formErrors, setFormErrors] = useState<any>({});
  const [eventId, setEventId] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({});
  const [amount, setAmount] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [formNumber, setFormNumber] = useState<number>(0);

  const [discount, setDiscount] = useState<DiscountData>({
    discount_type: '',
    discount_value: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (eventTitle) getEventId(eventTitle, navigate);

    setTimeout(() => {
      setEventId(JSON.parse(localStorage.getItem('eventData') || '{}').event_id);
      // setEventData(JSON.parse(localStorage.getItem('eventData') || '{}'));
      if (eventId) {
        getTickets(eventId, setTicketInfo);
        getFormFields(eventId, setFormFields);
        getEventDatas(eventId, setEventData);
        registerUpdateView(eventId);
      }
    }, 1000);
  }, [eventTitle, eventId]);

  useEffect(() => {
    if (discount.discount_value > 0) {
      setAmount(discountedTicketPrice(Number(amount), discount).toString());
    } else {
      if (ticketInfo && ticketId) {
        let ticketPrice = 0;
        Object.keys(ticketInfo)?.map((ticketType) => {
          if (ticketInfo[ticketType].id === ticketId) {
            ticketPrice = ticketInfo[ticketType].price;
          }
        });

        setAmount(ticketPrice.toString());
      }
    }
  }, [discount]);

  useEffect(() => {
    ticketInfo &&
      Object.keys(ticketInfo)?.map((ticketType) => {
        if (ticketInfo[ticketType].default_selected) {
          setTicketId(ticketInfo[ticketType].id);
        }
      });
  }, [ticketInfo]);

  useEffect(() => {
    setFormData(
      formFields.reduce((data: any, field: any) => {
        data[field.field_key] = '';
        return data;
      }, {}),
    );
  }, [formFields]);

  const onFieldChange = (fieldName: string, fieldValue: string) => {
    setFormData({
      ...formData,
      [fieldName]: fieldValue,
    });

    if (formErrors[fieldName]) {
      setFormErrors({
        ...formErrors,
        [fieldName]: '',
      });
    }
  };

  return (
    <>
      <Theme>
        {
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className={styles.successMessage}
          >
            {success && (
              <>
                <div className={styles.backgroundBlur}></div>
                <dialog
                  style={{
                    borderBottom: '3px solid #47c97e',
                    background: 'rgba(31, 185, 31, 0.09)',
                  }}
                  open
                  className={styles.onClickModal}
                >
                  <button
                    onClick={() => {
                      setSuccess('');
                    }}
                    className={styles.closeButton}
                  >
                    X
                  </button>
                  <p className={styles.modalSubText}>Registration Successful</p>
                  <p className={styles.modalText}>
                    Your registration for the event has been successful. You will receive a
                    confirmation email shortly.
                  </p>
                  {success && <p className={styles.ticketCode}>You're Ticket Code is: {success}</p>}
                </dialog>
              </>
            )}
          </motion.div>
        }
        {formFields.length > 0 ? (
          <div className={styles.eventPageContainer}>
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className={styles.eventDataContainer}
            >
              <div className={styles.eventTopHeader}>
                <div>
                  <p className={styles.eventTitle}>{eventData.title}</p>
                  <p className={styles.eventDescription}>
                    {eventData.description ||
                      'In50hrs is a weekend Prototyping event, where teams register to build prototypes of solutions for real problems.'}
                  </p>
                </div>
                <div className={styles.headerRightSide}>
                  <img
                    src={eventData.logo || 'https://via.placeholder.com/90'}
                    alt='event'
                    className={styles.eventImage}
                  />
                </div>
              </div>

              <div className={styles.otherDetials}>
                <IoLocationOutline size={20} className={styles.clockIcon} />
                <div className={styles.location}>
                  <p className={styles.mainLocation}>{eventData.location}</p>
                  <p className={styles.subLocation}>{eventData.sub_location}</p>
                </div>
                <FiClock size={20} className={styles.clockIcon} />
                <div className={styles.eventDate}>
                  <p className={styles.date}>{eventData.date}</p>
                  <p className={styles.time}>{eventData.time}</p>
                </div>
              </div>
            </motion.div>
            <div className={styles.formContainer}>
              {formNumber === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className={styles.eventForm}
                >
                  <div>
                    <p className={styles.eventFormTitle}>Registration Form</p>
                    <p className={styles.eventDescription}>
                      Please fill in the form below to register for the event.
                    </p>
                  </div>
                  <div className={styles.formFields}>
                    {formFields?.map((field: any) => {
                      if (
                        field.type === 'text' ||
                        field.type === 'email' ||
                        field.type === 'phonenumber'
                      ) {
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
                                  onChange={(selectedOption: any) =>
                                    onFieldChange(field.field_key, selectedOption.value)
                                  }
                                  value={field.options
                                    ?.map((option: string) => ({
                                      value: option,
                                      label: option,
                                    }))
                                    .filter(
                                      (option: any) => option.value === formData[field.field_key],
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
                </motion.div>
              )}

              {ticketInfo && formNumber === 1 && (
                <>
                  {formFields?.map((field: any) => {
                    return (
                      field.type === 'apicoupon' && (
                        <motion.div
                          initial={{ opacity: 0, y: 35 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.5 }}
                          className={`${styles.row} ${styles.ticketType}`}
                          style={{
                            marginTop: '0rem',
                            border:
                              discount.discount_value > 0
                                ? '2px solid #46BF75'
                                : '2px solid #2A3533',
                          }}
                        >
                          <InputFIeld
                            name={field.field_key}
                            placeholder={field.title}
                            id={field.id}
                            key={field.id}
                            error={formErrors[field.field_key]}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              onFieldChange(field.field_key, e.target.value)
                            }
                            type='text'
                            icon={getIcon(field.field_key)}
                            required={field.required}
                            description={field.description}
                            style={{
                              marginTop: '-1rem',
                              border:
                                discount.discount_value > 0
                                  ? '2px solid #46BF75'
                                  : '2px solid #2A3533',
                            }}
                          />
                          {discount.discount_type && discount.discount_value > 0 ? (
                            <p
                              style={{
                                marginTop: '-1.75rem',
                              }}
                              className={styles.discountText}
                            >
                              {discount.discount_type.toLowerCase() === 'percentage'
                                ? `${discount.discount_value}% discount applied`
                                : `${discount.discount_value} ${ticketInfo[Object.keys(ticketInfo)[0]].currency} discount applied`}
                            </p>
                          ) : (
                            discount.discount_type && (
                              <p
                                style={{
                                  marginTop: '-1.75rem',
                                }}
                                className={styles.discountErrorText}
                              >
                                No discount found for this code.
                              </p>
                            )
                          )}

                          <div>
                            <SecondaryButton
                              onClick={() => {
                                if (formData[field.field_key])
                                  applyCoupon(eventId, formData[field.field_key], setDiscount);
                                else {
                                  setFormErrors({
                                    ...formErrors,
                                    [field.field_key]: 'Please enter a valid coupon code',
                                  });
                                }
                              }}
                              buttonText='Validate Code'
                            />
                          </div>
                        </motion.div>
                      )
                    );
                  })}
                  <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className={styles.ticketTypes}
                  >
                    <div
                      style={{
                        marginLeft: '8px',
                      }}
                    >
                      <p className={styles.ticketTypesTitle}>Ticket Types</p>
                      <p className={styles.eventDescription}>
                        Select a ticket type to register for the event.
                      </p>
                    </div>

                    {Object.keys(ticketInfo)?.map((ticketType) => (
                      <div
                        key={ticketType}
                        onClick={() => {
                          setTicketId(ticketInfo[ticketType].id);
                          if (discount.discount_value > 0)
                            setAmount(
                              discountedTicketPrice(
                                Number(ticketInfo[ticketType].price),
                                discount,
                              ).toString(),
                            );
                          else {
                            setAmount(ticketInfo[ticketType].price.toString());
                          }
                        }}
                        className={styles.ticketType}
                        style={{
                          border:
                            ticketId === ticketInfo[ticketType].id
                              ? '2px solid #FFFFFF'
                              : '2px solid #2A3533',
                        }}
                      >
                        <div className={styles.passText}>
                          <p className={styles.ticketTypeTitle}>{ticketType.toUpperCase()}</p>

                          <div className={styles.perks}>
                            {Object.keys(ticketInfo[ticketType].perks)?.map((perk) => (
                              <div key={perk} className={styles.perk}>
                                {perk}: {ticketInfo[ticketType].perks[perk]}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className={styles.ticketPriceData}>
                          {discount.discount_value > 0 && ticketInfo[ticketType].price > 0 && (
                            <div className={styles.discountData}>
                              <p className={styles.discountAmount}>
                                {discount.discount_type.toLowerCase() === 'percentage'
                                  ? `${discount.discount_value}% off`
                                  : `${ticketInfo[ticketType].currency} ${discount.discount_value} off`}
                              </p>
                              <p className={styles.originalPrice}>
                                <del>
                                  M.R.P. {ticketInfo[ticketType].currency}{' '}
                                  {ticketInfo[ticketType].price}
                                </del>
                              </p>
                            </div>
                          )}
                          <div className={styles.priceData}>
                            <p className={styles.ticketPrice}>
                              {discountedTicketPrice(
                                Number(ticketInfo[ticketType].price),
                                discount,
                              ) === 0
                                ? 'FREE'
                                : `${ticketInfo[ticketType].currency} ${discountedTicketPrice(Number(ticketInfo[ticketType].price), discount)}`}
                            </p>
                            <p className={styles.extraCharges}>
                              {ticketInfo[ticketType].platform_fee_from_user &&
                                Number(ticketInfo[ticketType].price) > 0 &&
                                discountedTicketPrice(
                                  Number(ticketInfo[ticketType].price),
                                  discount,
                                ) !== 0 && (
                                  <p className={styles.extraCharges}>
                                    {ticketInfo[ticketType].platform_fee}% extra charges
                                  </p>
                                )}
                            </p>
                          </div>
                        </div>

                        <p className={styles.cardText}>{eventData.event_name.toUpperCase()}</p>
                      </div>
                    ))}
                  </motion.div>
                </>
              )}
              <div className={styles.buttons}>
                {formNumber > 0 && (
                  <div
                    onClick={() => {
                      setFormNumber((prevState) => {
                        return prevState - 1;
                      });
                    }}
                    className={styles.backButton}
                  >
                    <p>Back</p>
                  </div>
                )}
                <motion.button
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.95 }}
                  type='submit'
                  onClick={() => {
                    if (formNumber === 0) {
                      {
                        validateRsvp(ticketId, formData, setFormNumber, setFormErrors);
                      }
                    } else {
                      if (amount === '0')
                        submitForm(ticketId, formData, '', setSuccess, setFormNumber, setFormData);
                      else if (formData) {
                        showRazorpay(
                          ticketId,
                          formData,
                          setFormErrors,
                          setSuccess,
                          setFormNumber,
                          setFormData,
                        );
                      }
                    }
                  }}
                  className={styles.submitButton}
                >
                  {formNumber === 0 ? 'Next' : 'Register Now'}
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.center}>
            <HashLoader color={'#46BF75'} size={50} />
          </div>
        )}
      </Theme>
    </>
  );
};

export default EventPage;
