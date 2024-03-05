import styles from './EventPage.module.css';
import Theme from '../../../components/Theme/Theme';
import InputFIeld from '../../auth/Login/InputFIeld';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners';
import { getEventId } from '../../../apis/events';
import {
  applyCoupon,
  getCouponInfo,
  getEventDatas,
  getFormFields,
  getTickets,
  registerUpdateView,
  submitForm,
  validateRsvp,
} from '../../../apis/publicpage';
import { CouponData, DiscountData, TicketOptions } from './types';
import { motion } from 'framer-motion';
import { showRazorpay } from './components/Razorpay';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import { EventDetails, FormData, FormField } from '../../../apis/types';
import { discountedTicketPrice, getIcon } from './constants';
import DynamicForm from '../../../components/DynamicForm/DynamicForm';
import EventHeader from './components/EventHeader';

const EventPage = () => {
  const { eventTitle } = useParams<{ eventTitle: string }>();
  const [ticketInfo, setTicketInfo] = useState<TicketOptions>();

  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [ticketId, setTicketId] = useState<string>('');
  const [eventData, setEventData] = useState<EventDetails>();
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

  const [coupon, setCoupon] = useState<CouponData>({
    coupon: '',
    description: '',
  });

  const navigate = useNavigate();

  const [hasZeroPriceTicket, setHasZeroPriceTicket] = useState(false);

  useEffect(() => {
    if (eventTitle) getEventId(eventTitle, navigate);

    setTimeout(() => {
      setEventId(JSON.parse(localStorage.getItem('eventData') || '{}').event_id);
      if (eventId) {
        getCouponInfo(eventId, setCoupon);
        getTickets(eventId, setTicketInfo);
        getFormFields(eventId, setFormFields);
        getEventDatas(eventId, setEventData);
        registerUpdateView(eventId);
      }
    }, 1000);
  }, [eventTitle, eventId]);

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };

    scrollToTop();
  }, [success]);

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
    if (ticketInfo) {
      Object.keys(ticketInfo)?.map((ticketType) => {
        if (ticketInfo[ticketType].default_selected) {
          setTicketId(ticketInfo[ticketType].id);
        }
      });

      const responseKeys = Object.keys(ticketInfo);
      if (responseKeys.length === 1) {
        const ticketKey = responseKeys[0];
        const ticket = ticketInfo[ticketKey];
        if (ticket.price === 0) {
          setHasZeroPriceTicket(true);
        }
      }
    }
  }, [ticketInfo]);

  useEffect(() => {
    setFormData(
      formFields.reduce((data: any, field: any) => {
        data[field.field_key] = '';
        return data;
      }, {}),
    );
  }, [formFields]);

  const onFieldChange = (fieldName: string, fieldValue: string | string[]) => {
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
      <Theme type='eventForms'>
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
                  {success && !eventData?.shortlist && (
                    <p className={styles.ticketCode}>You're Ticket Code is: {success}</p>
                  )}
                </dialog>
              </>
            )}
          </motion.div>
        }
        {eventData?.is_private && (
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className={styles.center}
          >
            <EventHeader eventData={eventData} />
            <p className={styles.privateEventText}>
              This is a private event. Please contact the event organizer for more details.
            </p>
          </motion.div>
        )}

        {!eventData?.is_private && formFields.length > 0 ? (
          <div className={styles.eventPageContainer}>
            <div className={styles.eventHeaderContainer}>
              <EventHeader eventData={eventData} />
            </div>
            <div className={styles.formContainer}>
              {formNumber === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className={styles.eventForm}
                >
                  <div className={styles.eventFormInnerContainer} id='formFields'>
                    <div>
                      <p className={styles.eventFormTitle}>Registration Form</p>
                      <p className={styles.eventHeaderDescription}>
                        Please fill in the form below to register for the event.
                      </p>
                    </div>
                    {formData && (
                      <DynamicForm
                        formFields={formFields}
                        formErrors={formErrors}
                        formData={formData}
                        onFieldChange={onFieldChange}
                      />
                    )}
                  </div>
                </motion.div>
              )}

              {ticketInfo && formNumber === 1 && (
                <>
                  {coupon.coupon && (
                    <motion.div
                      initial={{ opacity: 0, y: 35 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className={`${styles.row} ${styles.ticketType}`}
                      style={{
                        marginTop: '0rem',
                        border:
                          discount.discount_value > 0 ? '2px solid #46BF75' : '2px solid #2A3533',
                      }}
                    >
                      <InputFIeld
                        name='coupon_code'
                        placeholder='Coupon Code'
                        id='coupon_code'
                        key='coupon_code'
                        error={[coupon.error ?? '']}
                        onChange={(e) => {
                          setCoupon({
                            ...coupon,
                            error: '',
                            value: e.target.value,
                          });
                        }}
                        type='text'
                        icon={getIcon('coupon_code')}
                        required={true}
                        description={coupon.description}
                        style={{
                          marginTop: '-1rem',
                          border:
                            discount.discount_value > 0 ? '2px solid #46BF75' : '2px solid #2A3533',
                        }}
                      />
                      {discount.discount_type && discount.discount_value > 0 && (
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
                      )}

                      <div>
                        <SecondaryButton
                          onClick={() => {
                            if (coupon.value)
                              applyCoupon(eventId, coupon.value, setDiscount, setCoupon);
                            else {
                              setCoupon({
                                ...coupon,
                                error: 'Please enter a coupon code',
                              });
                            }
                          }}
                          buttonText='Validate Code'
                        />
                      </div>
                    </motion.div>
                  )}

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
                          <p className={styles.ticketTypeTitle}>{ticketType?.toUpperCase()}</p>

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

                        <p className={styles.cardText}>{eventData?.title?.toUpperCase()}</p>
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
                    if (formNumber === 0 && !hasZeroPriceTicket) {
                      {
                        validateRsvp(ticketId, formData, setFormNumber, setFormErrors);
                      }
                    } else {
                      if (amount === '0' || hasZeroPriceTicket)
                        submitForm({
                          ticketId,
                          formData,
                          coupon,
                          setSuccess,
                          setFormNumber,
                          setFormData,
                          setAmount,
                          setFormErrors,
                          setCoupon,
                        });
                      else if (formData) {
                        showRazorpay(
                          ticketId,
                          formData,
                          coupon,
                          setFormErrors,
                          setSuccess,
                          setFormNumber,
                          setFormData,
                          setAmount,
                          setCoupon,
                        );
                      }
                    }
                  }}
                  className={styles.submitButton}
                >
                  {formNumber === 0 && !hasZeroPriceTicket ? 'Next' : 'Register Now'}
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
