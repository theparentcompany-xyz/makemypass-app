/* eslint-disable react-hooks/exhaustive-deps */
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
import { EventType, FormDataType, TicketType } from '../../../apis/types';
import { discountedTicketPrice } from './constants';
import DynamicForm from '../../../components/DynamicForm/DynamicForm';
import EventHeader from './components/EventHeader/EventHeader';
import SuccessModal from './components/SuccessModal/SuccessModal';
import CouponForm from './components/CouponForm/CouponForm';
import { Helmet } from 'react-helmet';
import { validateCondition } from '../../../components/DynamicForm/condition';

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

  const [discount, setDiscount] = useState<DiscountData>({
    discount_type: '',
    discount_value: 0,
    ticket: [],
  });

  const [coupon, setCoupon] = useState<CouponData>({
    status: '',
    description: '',
    value: '',
    error: '',
  });

  const [eventNotFound, setEventNotFound] = useState<boolean>(false);
  const [directRegister, setDirectRegister] = useState<boolean | string>(false);
  const [ticketConditionalFields, setTicketConditionalFields] = useState<string[]>([]);

  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');

  const location = useLocation();
  const newSearchParams = new URLSearchParams(location.search);

  let formIdToKey: { [key: string]: string } = {};

  useEffect(() => {
    if (eventTitle) getEventInfo(eventTitle, setEventData, setEventNotFound);
  }, [eventTitle]);

  useEffect(() => {
    if (eventData?.form) {
      setFormData(
        eventData?.form.reduce((data: any, field: any) => {
          data[field.field_key] = newSearchParams.get(field.field_key) || '';
          return data;
        }, {}),
      );

      eventData?.form.forEach((field) => {
        formIdToKey = {
          ...formIdToKey,
          [field.id]: field.field_key,
        };
      });
    }

    if (eventData?.tickets) {
      eventData.tickets.forEach((ticket) => {
        ticket.conditions?.forEach((condtion) => {
          setTicketConditionalFields((prevState) => {
            return [...prevState, formIdToKey[condtion.field]];
          });
        });
      });
    }

    // console.log(ticketConditionalFields);

    if (eventData?.coupon) setCoupon(eventData?.coupon);

    checkDirectRegister();
  }, [eventData]);

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
    if (newTickets.length > 0) {
      setTickets(newTickets);
    }
  }, [newTickets]);

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

    console.log('ticketConditionalFields', ticketConditionalFields);
    if (ticketConditionalFields.includes(fieldName)) {
      checkDirectRegister(formData);
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

  const checkDirectRegister = (formData: FormDataType) => {
    const filteredTicket: TicketType[] = [];

    eventData?.tickets.forEach((ticket) => {
      if (ticket.conditions && ticket.conditions.length > 0) {
        console.log(ticket.conditions);

        if (validateCondition(ticket.conditions, formData, eventData.form)) {
          console.log('Workavannae!');
          filteredTicket.push(ticket);
        }
      } else {
        filteredTicket.push(ticket);
      }
    });

    if (
      filteredTicket.length === 1 &&
      filteredTicket[0].price == 0 &&
      !eventData?.select_multi_ticket &&
      filteredTicket[0].entry_date.length == 0
    ) {
      setDirectRegister(filteredTicket[0].id);
      console.log('BLa Bal');
      setTickets([
        {
          ticket_id: filteredTicket[0].id,
          count: 1,
          my_ticket: true,
        },
      ]);
    } else setDirectRegister(false);
  };

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
              style={{
                maxWidth: '32rem',
                margin: 'auto',
                padding: '0 1rem',
              }}
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
                    if (formNumber === 0 && !directRegister) {
                      {
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
                  {formNumber === 0 && !directRegister ? 'Next' : 'Register'}
                </motion.button>
              </div>
            </div>
          </div>
        ) : eventNotFound ? (
          <div className={styles.eventPageContainer}>
            <p className={`${styles.privateEventText} ${styles.center}`}>
              This event does not have any registration form. Please contact the event organizer for
              more information.
            </p>
          </div>
        ) : (
          !(eventData && eventData.title) && (
            <div className={styles.center}>
              <HashLoader color='#46BF75' size={50} />
            </div>
          )
        )}
      </Theme>
    </>
  );
};

export default EventPage;
