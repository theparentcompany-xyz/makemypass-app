import styles from './EventPage.module.css';
import Theme from '../../../components/Theme/Theme';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners';
// import { getEventId } from '../../../apis/events';
import { getEventInfo, submitForm, validateRsvp } from '../../../apis/publicpage';
import { CouponData, DiscountData, Tickets } from './types';
import { motion } from 'framer-motion';
// import { showRazorpay } from './components/Razorpay';
import { EventType, FormDataType } from '../../../apis/types';
import { discountedTicketPrice } from './constants';
import DynamicForm from '../../../components/DynamicForm/DynamicForm';
import EventHeader from './components/EventHeader/EventHeader';
import SuccessModal from './components/SuccessModal/SuccessModal';
import CouponForm from './components/CouponForm/CouponForm';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';

const EventPage = () => {
  const { eventTitle } = useParams<{ eventTitle: string }>();
  const [noTickets, setNoTickets] = useState<boolean>(false);

  const [tickets, setTickets] = useState<Tickets[]>([]);

  const [eventData, setEventData] = useState<EventType>();
  const [formErrors, setFormErrors] = useState<any>({});

  const [newTickets, setNewTickets] = useState<Tickets[]>([]);

  const [formData, setFormData] = useState<FormDataType>({});
  const [amount, setAmount] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [formNumber, setFormNumber] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string | null>();
  // const [hasEvent, setHasEvent] = useState<boolean>(true);

  const [discount, setDiscount] = useState<DiscountData>({
    discount_type: '',
    discount_value: 0,
    ticket: [],
  });

  const [hasZeroPriceTicket, setHasZeroPriceTicket] = useState(false);

  const [coupon, setCoupon] = useState<CouponData>({
    status: '',
    description: '',
    value: '',
    error: '',
  });

  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');

  useEffect(() => {
    if (eventTitle) getEventInfo(eventTitle, setEventData);
  }, [eventTitle]);

  useEffect(() => {
    if (eventData?.coupon) setCoupon(eventData?.coupon);
  }, [eventData]);

  const location = useLocation();
  const newSearchParams = new URLSearchParams(location.search);

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };

    scrollToTop();
  }, [success]);

  useEffect(() => {
    if (discount.discount_value > 0) {
      //* Does all the ticket prices are added
      setAmount(discountedTicketPrice(Number(amount), discount, tickets[0].ticket_id).toString());
    } else {
      if (eventData?.tickets && tickets) {
        let ticketPrice = 0;
        Object.keys(eventData?.tickets)?.map((ticketType) => {
          if (tickets.find((ticket) => ticket.ticket_id === eventData?.tickets[ticketType].id)) {
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
          setTickets([{ ticket_id: eventData?.tickets[ticketType].id, count: 1, my_ticket: true }]);
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
        data[field.field_key] = newSearchParams.get(field.field_key) || '';
        return data;
      }, {}),
    );
  }, [eventData?.form]);

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

  const updateTicketCount = (ticketId: string, increment: boolean) => {
    let newTicket = true;

    const updatedTickets = tickets.map((ticket) => {
      if (ticket.ticket_id === ticketId && ticket.count >= 0) {
        newTicket = false;
        return {
          ...ticket,
          count: increment ? ticket.count + 1 : ticket.count > 0 ? ticket.count - 1 : 0,
        };
      }
      return ticket;
    });

    if (newTicket) {
      updatedTickets.push({ ticket_id: ticketId, count: 1, my_ticket: false });
    }
    if (updatedTickets.length > 0) {
      setNewTickets(updatedTickets);
    }
  };

  useEffect(() => {
    if (newTickets.length > 0) {
      setTickets(newTickets);
    }
  }, [newTickets]);

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>{eventData?.title}</title>
        <link rel='shortcut icon' href={eventData?.logo ?? '/favicon.ico'} type='image/x-icon' />
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
          <>
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className={styles.eventPageContainer}
            >
              <EventHeader eventData={eventData} />
            </motion.div>
            <p className={styles.privateEventText}>{eventData?.err_message}</p>
          </>
        )}

        {eventData && eventData?.form?.length > 0 ? (
          <div className={styles.eventPageContainer}>
            {typeParam !== 'embed' && (
              <div className={styles.eventHeaderContainer}>
                <EventHeader eventData={eventData} />
              </div>
            )}
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
                  setTickets={setTickets}
                  tickets={tickets}
                  eventId={eventData.id}
                  discount={discount}
                  setDiscount={setDiscount}
                  setAmount={setAmount}
                  eventData={eventData}
                  setCoupon={setCoupon}
                  coupon={coupon}
                  setSelectedDate={setSelectedDate}
                  selectedDate={selectedDate}
                  updateTicketCount={updateTicketCount}
                  formData={formData}
                  setNoTickets={setNoTickets}
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
                        console.log('event id', eventData.id);
                        validateRsvp(
                          eventData.id,
                          formData,
                          setFormNumber,
                          setFormErrors,
                          selectedDate,
                        );
                      }
                    } else {
                      submitForm({
                        eventId: eventData.id,
                        tickets,
                        formData,
                        coupon,
                        setSuccess,
                        setFormNumber,
                        setFormData,
                        setAmount,
                        setFormErrors,
                        setCoupon,
                        setEventData,
                        eventTitle,
                        selectedDate,
                        setDiscount,
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
          !(eventData && eventData.title) && (
            <div className={styles.center}>
              <HashLoader color={'#46BF75'} size={50} />
            </div>
          )
        )}
      </Theme>
    </>
  );
};

export default EventPage;
