import { Dispatch, useEffect, useState } from 'react';
import { CouponData, DiscountData, Tickets } from '../../types';
import styles from '../../EventPage.module.css';
import { postAudio, submitForm, validateRsvp } from '../../../../../apis/publicpage';
import { EventType, FormDataType, TicketType } from '../../../../../apis/types';
import { motion } from 'framer-motion';
import AudioRecorder from '../../../../../components/DynamicForm/components/AudioRecorder/AudioRecorder';
import DynamicForm from '../../../../../components/DynamicForm/DynamicForm';
import CouponForm from '../CouponForm/CouponForm';
import { validateCondition } from '../../../../../components/DynamicForm/condition';
import { useLocation } from 'react-router';

const EventForm = ({
  eventData,
  setSuccess,
  setEventData,
  eventTitle,
  type,
}: {
  eventData: EventType;
  setSuccess: Dispatch<React.SetStateAction<string>>;
  setEventData: Dispatch<React.SetStateAction<EventType | undefined>>;
  eventTitle: string | undefined;
  type?: string;
}) => {
  const [formData, setFormData] = useState<FormDataType>({});
  const [formNumber, setFormNumber] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string | null>();
  const [formErrors, setFormErrors] = useState<any>({});
  const [tickets, setTickets] = useState<Tickets[]>([]);
  const [discount, setDiscount] = useState<DiscountData>({
    discount_type: '',
    discount_value: 0,
    ticket: [],
  });
  const [directRegister, setDirectRegister] = useState<boolean | string>(false);
  const [ticketConditionalFields, setTicketConditionalFields] = useState<string[]>([]);
  const [coupon, setCoupon] = useState<CouponData>({
    status: eventData?.coupon.status ? true : false,
    description: eventData?.coupon.description ?? '',
    value: eventData?.coupon.value ?? '',
    error: '',
  });

  let formIdToKey: { [key: string]: string } = {};

  const location = useLocation();
  const newSearchParams = new URLSearchParams(location.search);

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

      if (eventData?.tickets) {
        setTicketConditionalFields([]);
        eventData.tickets.forEach((ticket) => {
          ticket.conditions?.forEach((condition) => {
            setTicketConditionalFields((prevState) => {
              return [...prevState, formIdToKey[condition.field]];
            });
          });
        });
        checkDirectRegister();
      }
    }

    if (eventData?.coupon) setCoupon(eventData?.coupon);
  }, [eventData]);

  useEffect(() => {
    if (ticketConditionalFields.some((field) => field in formData)) {
      checkDirectRegister();
    }
  }, [formData]);

  const checkDirectRegister = () => {
    const filteredTicket: TicketType[] = [];

    eventData?.tickets.forEach((ticket) => {
      if (ticket.conditions && ticket.conditions.length > 0) {
        if (validateCondition(ticket.conditions, formData, eventData.form)) {
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
      setTickets([
        {
          ticket_id: filteredTicket[0].id,
          count: 1,
          my_ticket: true,
        },
      ]);
    } else setDirectRegister(false);
  };

  const handleAudioSubmit = (recordedBlob: Blob | null) => {
    if (recordedBlob && eventData?.id && formData && setFormData) {
      postAudio(eventData?.id, recordedBlob, formData, setFormData);
    }
  };

  const onFieldChange = (fieldName: string, fieldValue: string | string[]) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: fieldValue,
    }));

    if (formErrors[fieldName]) {
      setFormErrors({
        ...formErrors,
        [fieldName]: '',
      });
    }
  };

  let localEventId = '';
  if (sessionStorage.getItem('eventData') !== null)
    localEventId = JSON.parse(sessionStorage.getItem('eventData')!).event_id;

  return (
    <>
      {formNumber === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className={styles.eventForms}
        >
          <div className={styles.eventFormInnerContainer} id='formFields'>
            <div>
              <p className={styles.eventFormTitle}>
                {type ? 'Add Guest' : 'Register for the event'}
              </p>
              <p className={styles.eventHeaderDescription}>
                {type
                  ? 'Please add the guest details'
                  : 'Please fill in the form below to register for the event.'}
              </p>
            </div>
            {formData && eventData && (
              <div className={styles.formFields}>
                <AudioRecorder handleSubmit={handleAudioSubmit} />
                <DynamicForm
                  formFields={eventData.form}
                  formErrors={formErrors}
                  formData={formData}
                  onFieldChange={onFieldChange}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}

      {(eventData.tickets || eventData.select_multi_ticket) && formNumber === 1 && (
        <CouponForm
          setTickets={setTickets}
          tickets={tickets}
          discount={discount}
          setDiscount={setDiscount}
          eventData={eventData}
          setCoupon={setCoupon}
          coupon={coupon}
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
          formData={formData}
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
                  eventData.id || localEventId,
                  formData,
                  setFormNumber,
                  setFormErrors,
                  selectedDate,
                );
              }
            } else {
              submitForm({
                eventId: eventData.id || localEventId,
                tickets,
                formData,
                coupon,
                setSuccess,
                setFormNumber,
                setFormData,
                setFormErrors,
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
    </>
  );
};

export default EventForm;
