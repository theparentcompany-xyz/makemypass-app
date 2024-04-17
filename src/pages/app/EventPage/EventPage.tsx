import styles from './EventPage.module.css';
import Theme from '../../../components/Theme/Theme';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners';
// import { getEventId } from '../../../apis/events';
import { getEventInfo, submitForm, validateRsvp } from '../../../apis/publicpage';
import { CouponData, DiscountData } from './types';
import { motion } from 'framer-motion';
// import { showRazorpay } from './components/Razorpay';
import { EventType, FormDataType } from '../../../apis/types';
import { discountedTicketPrice } from './constants';
import DynamicForm from '../../../components/DynamicForm/DynamicForm';
import EventHeader from './components/EventHeader/EventHeader';
import SuccessModal from './components/SuccessModal/SuccessModal';
import CouponForm from './components/CouponForm/CouponForm';
import { GlobalContext } from '../../../contexts/globalContext';
import { Helmet } from 'react-helmet';
import FourNotFour from '../../FourNotFour/FourNotFour';

const EventPage = () => {
  const { eventTitle } = useParams<{ eventTitle: string }>();

  const [ticketIds, setTicketIds] = useState<string[]>([]);
  const [eventData, setEventData] = useState<EventType>();
  const [formErrors, setFormErrors] = useState<any>({});
  // const [eventId, setEventId] = useState<string>('');

  const [formData, setFormData] = useState<FormDataType>({});
  const [amount, setAmount] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [formNumber, setFormNumber] = useState<number>(0);
  // const [hasEvent, setHasEvent] = useState<boolean>(true);

  const [discount, setDiscount] = useState<DiscountData>({
    discount_type: '',
    discount_value: 0,
  });

  const { eventId, setEventId, hasEvent } = useContext(GlobalContext);
  if (!setEventId) {
    throw new Error('setEventId is undefined');
  }

  console.log(eventId, hasEvent);

  const [hasZeroPriceTicket, setHasZeroPriceTicket] = useState(false);

  const [coupon, setCoupon] = useState<CouponData>({
    status: '',
    description: '',
    value: '',
    error: '',
  });

  useEffect(() => {
    setTimeout(() => {
      setEventId(JSON.parse(localStorage.getItem('eventData') || '{}').event_id);
      if (eventId) {
        getEventInfo(eventId, setEventData);
      }
    }, 1000);
  }, [eventTitle, eventId]);

  useEffect(() => {
    if (eventData?.coupon) setCoupon(eventData?.coupon);
  }, [eventData]);

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
      if (eventData?.tickets && ticketIds) {
        let ticketPrice = 0;
        Object.keys(eventData?.tickets)?.map((ticketType) => {
          if (ticketIds.includes(eventData?.tickets[ticketType].id)) {
            ticketPrice += eventData?.tickets[ticketType].price;
          }
        });

        setAmount(ticketPrice.toString());
      }
    }
  }, [discount]);

  useEffect(() => {
    if (eventData?.tickets) {
      Object.keys(eventData?.tickets)?.map((ticketType) => {
        if (eventData?.tickets[ticketType].default_selected) {
          setTicketIds([eventData?.tickets[ticketType].id]);
          setAmount(eventData?.tickets[ticketType].price.toString());
        }
      });

      const responseKeys = Object.keys(eventData?.tickets);
      if (responseKeys.length === 1) {
        const ticketKey = responseKeys[0];
        const ticket = eventData?.tickets[ticketKey];
        if (ticket.price === 0) {
          setHasZeroPriceTicket(true);
        }
      }
    }
  }, [eventData?.tickets]);

  useEffect(() => {
    setFormData(
      eventData?.form.reduce((data: any, field: any) => {
        data[field.field_key] = '';
        return data;
      }, {}),
    );
  }, [eventData?.form]);

  const onFieldChange = (fieldName: string, fieldValue: string | string[]) => {
    console.log('fieldName', fieldName, fieldValue);
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
  console.log(ticketIds, amount);
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
            {eventData?.err_message && (
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className={styles.center}
              >
                <EventHeader eventData={eventData} />
                <p className={styles.privateEventText}>{eventData?.err_message}</p>
              </motion.div>
            )}

            {eventData && eventData?.form?.length > 0 ? (
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
                        {formData && eventData && (
                          <DynamicForm
                            formFields={eventData.form}
                            formErrors={formErrors}
                            formData={formData}
                            onFieldChange={onFieldChange}
                            eventData={eventData}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}

                  {(eventData.tickets || eventData.select_multi_ticket) && formNumber === 1 && (
                    <CouponForm
                      ticketInfo={eventData.tickets}
                      setTicketIds={setTicketIds}
                      ticketIds={ticketIds}
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
                          submitForm({
                            eventId,
                            ticketIds,
                            formData,
                            coupon,
                            setSuccess,
                            setFormNumber,
                            setFormData,
                            setAmount,
                            setFormErrors,
                            setCoupon,
                          });
                        }
                      }}
                      className={styles.submitButton}
                    >
                      {formNumber === 0 && !(hasZeroPriceTicket || eventData?.select_multi_ticket)
                        ? 'Next'
                        : 'Register Now'}
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
