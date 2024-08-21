import { Dispatch, useEffect, useState } from 'react';
import {
  CouponData,
  DiscountData,
  Tickets,
  SuccessModalProps,
  ClaimCodeExceedType,
} from '../../types';
import styles from '../../EventPage.module.css';
import { submitForm, validateRSVPData } from '../../../../../apis/publicpage';
import { EventType, FormDataType, TicketType } from '../../../../../apis/types';
import { motion } from 'framer-motion';
import DynamicForm from '../../../../../components/DynamicForm/DynamicForm';
import CouponForm from '../CouponForm/CouponForm';
import { validateCondition } from '../../../../../components/DynamicForm/condition';
import { useLocation } from 'react-router';
import { FormEventData, SelectedGuest } from '../../../Guests/types';
import { PropagateLoader } from 'react-spinners';
import VoiceInput from './components/VoiceInput';
import { addGuest } from '../../../../../apis/guest';
import { MdError } from 'react-icons/md';

const EventForm = ({
  eventFormData,
  setSuccess,
  setEventData,
  eventTitle,
  type,
  claimCode,
  ticketCode,
  setSelectedGuestId,
  claimCodeExceed,
  isCashInHand,
}: {
  eventFormData: FormEventData;
  eventTitle: string | undefined;
  setEventData?: Dispatch<React.SetStateAction<EventType | undefined>>;
  setSuccess?: Dispatch<React.SetStateAction<SuccessModalProps>>;
  type?: string;
  claimCode?: string | null;
  ticketCode?: string | null;
  setSelectedGuestId?: Dispatch<React.SetStateAction<SelectedGuest | null>>;
  claimCodeExceed?: ClaimCodeExceedType;
  isCashInHand?: boolean;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataType>({});
  const [formNumber, setFormNumber] = useState<number>(eventFormData.show_ticket_first ? 1 : 0);
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
    status: eventFormData?.coupon.status,
    description: eventFormData?.coupon.description ?? '',
    value: eventFormData?.coupon.value ?? '',
    error: '',
  });

  let formIdToKey: { [key: string]: string } = {};

  const location = useLocation();
  const newSearchParams = new URLSearchParams(location.search);

  useEffect(() => {
    if (eventFormData?.form) {
      setFormData(
        eventFormData?.form.reduce((data: any, field: any) => {
          data[field.field_key] = newSearchParams.get(field.field_key) || '';
          return data;
        }, {}),
      );

      eventFormData?.form.forEach((field) => {
        formIdToKey = {
          ...formIdToKey,
          [field.id]: field.field_key,
        };
      });

      if (eventFormData?.tickets) {
        setTicketConditionalFields([]);
        eventFormData.tickets.forEach((ticket) => {
          ticket.conditions?.forEach((condition) => {
            setTicketConditionalFields((prevState) => {
              return [...prevState, formIdToKey[condition.field]];
            });
          });
        });
        checkDirectRegister();
      }
    }

    if (claimCode) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        claim_code: claimCode,
      }));
    }

    if (eventFormData?.coupon) setCoupon(eventFormData?.coupon);
  }, [eventFormData]);

  useEffect(() => {
    if (ticketConditionalFields.some((field) => field in formData)) {
      checkDirectRegister();
    }
  }, [formData]);

  const checkDirectRegister = () => {
    const filteredTicket: TicketType[] = [];

    if (claimCode && eventFormData.claim_ticket_id) {
      setDirectRegister(eventFormData.claim_ticket_id);
      setTickets([
        {
          ticket_id: eventFormData.claim_ticket_id,
          count: 1,
          my_ticket: true,
        },
      ]);
      return;
    }

    eventFormData?.tickets.forEach((ticket) => {
      if (ticket.conditions && ticket.conditions.length > 0) {
        if (validateCondition(ticket.conditions, formData, eventFormData.form)) {
          filteredTicket.push(ticket);
        }
      } else {
        filteredTicket.push(ticket);
      }
    });

    if (
      filteredTicket.length === 1 &&
      filteredTicket[0].price == 0 &&
      !eventFormData?.select_multi_ticket &&
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

  return (
    <>
      {claimCodeExceed?.exceeded && (
        <div className={styles.claimCodeExccededMessage}>
          <MdError color='#F04B4B' />
          <span>{claimCodeExceed?.message}</span>
        </div>
      )}

      {formNumber === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className={!type ? styles.eventForm : undefined}
        >
          <div className={styles.eventFormInnerContainer} id='formFields'>
            {!type && (
              <div>
                <p className={styles.eventFormTitle}>Register for the event</p>
                <p className={styles.eventHeaderDescription}>
                  Please fill in the form below to register for the event.
                </p>
              </div>
            )}
            {formData && eventFormData && (
              <div className={styles.formFields}>
                {eventFormData.parse_audio && (
                  <VoiceInput
                    eventFormData={eventFormData}
                    formData={formData}
                    setFormData={setFormData}
                  />
                )}
                <DynamicForm
                  formFields={eventFormData.form}
                  formErrors={formErrors}
                  formData={formData}
                  onFieldChange={onFieldChange}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}

      {(eventFormData.tickets || eventFormData.select_multi_ticket) && formNumber === 1 && (
        <CouponForm
          setTickets={setTickets}
          tickets={tickets}
          discount={discount}
          setDiscount={setDiscount}
          eventFormData={eventFormData}
          setCoupon={setCoupon}
          coupon={coupon}
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
          formData={formData}
        />
      )}

      <div className={styles.buttons}>
        {((formNumber === 0 && eventFormData.show_ticket_first) ||
          (formNumber === 1 && !eventFormData.show_ticket_first)) && (
          <div
            onClick={() => {
              if (eventFormData.show_ticket_first) {
                setFormNumber(1);
              } else {
                setFormNumber(0);
              }
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
            if (
              (formNumber === 0 && !directRegister) ||
              (eventFormData.show_ticket_first && formNumber === 0)
            ) {
              validateRSVPData(
                eventFormData.id,
                eventFormData.show_ticket_first,
                formData,
                setFormNumber,
                setFormErrors,
                selectedDate,
              ).then(() => {
                if (eventFormData.show_ticket_first)
                  submitForm({
                    eventId: eventFormData.id,
                    isCouponFirst: eventFormData.show_ticket_first,
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
                    setLoading,
                    setCoupon,
                    ticketCode,
                  });
              });
            } else if (formNumber === 1 && eventFormData.show_ticket_first) {
              setFormNumber(0);
            } else {
              if (type === 'addGuest' && setSelectedGuestId) {
                addGuest(
                  eventFormData.id,
                  tickets,
                  formData,
                  setFormErrors,
                  setSelectedGuestId,
                  selectedDate,
                  ticketCode,
                  isCashInHand,
                );
              } else {
                console.log('hereeasdfe');

                submitForm({
                  eventId: eventFormData.id,
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
                  setLoading,
                  setCoupon,
                  ticketCode,
                });
              }
            }
          }}
          className={styles.submitButton}
        >
          {loading ? (
            <PropagateLoader
              color={'#fff'}
              loading={loading}
              size={10}
              style={{
                padding: '0.75rem 1.5rem',
                paddingTop: '0.5rem',
              }}
            />
          ) : formNumber === 0 && !directRegister ? (
            eventFormData.show_ticket_first ? (
              'Submit'
            ) : (
              'Next'
            )
          ) : formNumber === 1 && eventFormData.show_ticket_first ? (
            'Next'
          ) : (
            'Submit'
          )}
        </motion.button>
      </div>
    </>
  );
};

export default EventForm;
