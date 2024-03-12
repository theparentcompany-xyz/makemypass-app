import styles from './EventPage.module.css';
import Theme from '../../../components/Theme/Theme';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners';
import { getEventId } from '../../../apis/events';
import {
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
import { EventDetails, FormDataType, FormField } from '../../../apis/types';
import { discountedTicketPrice } from './constants';
import DynamicForm from '../../../components/DynamicForm/DynamicForm';
import EventHeader from './components/EventHeader/EventHeader';
import SuccessModal from './components/SuccessModal/SuccessModal';
import CouponForm from './components/CouponForm/CouponForm';

import { Helmet } from 'react-helmet';
import FourNotFour from '../../FourNotFour/FourNotFour';

const EventPage = () => {
  const { eventTitle } = useParams<{ eventTitle: string }>();
  const [ticketInfo, setTicketInfo] = useState<TicketOptions>();

  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [ticketId, setTicketId] = useState<string>('');
  const [eventData, setEventData] = useState<EventDetails>();
  const [formErrors, setFormErrors] = useState<any>({});
  const [eventId, setEventId] = useState<string>('');

  const [formData, setFormData] = useState<FormDataType>({});
  const [amount, setAmount] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [formNumber, setFormNumber] = useState<number>(0);
  const [hasEvent, setHasEvent] = useState<boolean>(true);

  const [discount, setDiscount] = useState<DiscountData>({
    discount_type: '',
    discount_value: 0,
  });

  const [coupon, setCoupon] = useState<CouponData>({
    coupon: '',
    description: '',
  });

  const [hasZeroPriceTicket, setHasZeroPriceTicket] = useState(false);

  useEffect(() => {
    if (eventTitle) getEventId(eventTitle, setHasEvent);

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
      {hasEvent ? (
        <>
          <Helmet>
            <meta charSet='utf-8' />
            <title>{eventData?.title}</title>
            <link
              rel='shortcut icon'
              href={eventData?.logo ?? '/favicon.ico'}
              type='image/x-icon'
            />
            <meta name='title' content={eventData?.title} />
            <meta
              name='description'
              content={
                eventData?.description
                  ? eventData?.description
                  : 'Don not miss out! Register now for this event to learn, network and more. Click the link below to get started.'
              }
            />
          </Helmet>
          <Theme type='eventForm'>
            <SuccessModal
              success={success}
              setSuccess={setSuccess}
              hasShortlisting={eventData?.shortlist}
            />
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
                    <CouponForm
                      ticketInfo={ticketInfo}
                      setTicketId={setTicketId}
                      ticketId={ticketId}
                      eventId={eventId}
                      discount={discount}
                      setDiscount={setDiscount}
                      setAmount={setAmount}
                      eventData={eventData}
                      setCoupon={setCoupon}
                      coupon={coupon}
                    />
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
                            validateRsvp(eventId, formData, setFormNumber, setFormErrors);
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
      ) : (
        <FourNotFour />
      )}
    </>
  );
};

export default EventPage;
