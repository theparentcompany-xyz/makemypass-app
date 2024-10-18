import { motion } from 'framer-motion';
import { Dispatch, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdError } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router';
import { PropagateLoader } from 'react-spinners';

import { addGuest } from '../../../../../apis/guest';
import { submitForm, validateRSVPData } from '../../../../../apis/publicpage';
import { EventType, FormDataType, FormFieldType, TicketType } from '../../../../../apis/types';
import { validateCondition } from '../../../../../components/DynamicForm/condition';
import DynamicForm from '../../../../../components/DynamicForm/DynamicForm';
import type { previewType } from '../../../EventGlance/components/MailModals/UpdateMail/types';
import { FormEventData, SelectedGuest } from '../../../Guests/types';
import styles from '../../EventPage.module.css';
import type {
  ClaimCodeExceedType,
  CouponData,
  DiscountData,
  SuccessModalProps,
  Tickets,
} from '../../types';
import CouponForm from '../CouponForm/CouponForm';
import VoiceInput from './components/VoiceInput';

const EventForm = ({
  formNumber,
  setFormNumber,
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
  utmData,
}: {
  formNumber: number;
  setFormNumber: Dispatch<React.SetStateAction<number>>;
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
  utmData?: {
    source: string | null;
    medium: string | null;
    campaign: string | null;
    term: string | null;
    content: string | null;
  };
}) => {
  const [previews, setPreviews] = useState<previewType[]>([]);
  const [attachements, setAttachements] = useState<{
    field_key: string;
    fieldAttachements: File[];
  }>({
    field_key: '',
    fieldAttachements: [],
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormDataType>({});
  const [selectedDate, setSelectedDate] = useState<string | null>();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string[] }>({});
  const [formIdToKey, setFormIdToKey] = useState<{ [key: string]: string }>({});
  const [tickets, setTickets] = useState<Tickets[]>([]);
  const [isFormSubmitable, setIsFormSubmitable] = useState<boolean>(false);
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
  const [accessCode, setAccessCode] = useState('');

  const navigate = useNavigate();

  const location = useLocation();
  const newSearchParams = new URLSearchParams(location.search);

  useEffect(() => {
    setFormData(
      eventFormData?.form.reduce((data: FormDataType, field: FormFieldType) => {
        data[field.field_key] = newSearchParams.get(field.field_key) || '';
        return data;
      }, {}),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const accessCodeParam = newSearchParams.get('access_code');
    if (accessCodeParam) {
      setAccessCode(accessCodeParam);
    }
    if (eventFormData?.form) {
      eventFormData?.form.forEach((field) => {
        setFormIdToKey((prevState) => {
          return { ...prevState, [field.id]: field.field_key };
        });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventFormData]);

  useEffect(() => {
    if (ticketConditionalFields.some((field) => field in formData)) {
      checkDirectRegister();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        [fieldName]: [],
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: FormFieldType) => {
    let withinSize = true;
    let isWithinFileCount = true;
    Array.from(event.target.files || []).forEach((file) => {
      if (file.size <= (field.property?.max_size ?? 0) * 1024) {
        withinSize = withinSize && true;
      } else {
        withinSize = false;
      }
    });

    if (field.property?.max_no_of_files) {
      isWithinFileCount =
        attachements.fieldAttachements.length + Array.from(event.target.files || []).length <=
        field.property?.max_no_of_files;
    }

    if (event.target.files && withinSize && isWithinFileCount) {
      const newAttachments = [
        ...attachements.fieldAttachements,
        ...Array.from(event.target.files || []),
      ];
      onFieldChange(field.field_key, newAttachments as unknown as string[]);
      setAttachements({
        field_key: field.field_key,
        fieldAttachements: newAttachments,
      });
      setPreviews([
        ...previews,
        ...Array.from(event.target.files || []).map((file) => {
          return {
            previewURL: URL.createObjectURL(file),
            previewExtension: file.type,
            previewName: file.name,
          };
        }),
      ]);
    } else {
      if (!withinSize) {
        setFormErrors &&
          setFormErrors({
            ...formErrors,
            [field.field_key]: [`File size should be less than ${field.property?.max_size} KB`],
          });
      } else {
        if (!isWithinFileCount) {
          setFormErrors &&
            setFormErrors({
              ...formErrors,
              [field.field_key]: [`You can only upload ${field.property?.max_no_of_files} files`],
            });
        }
      }
    }
  };

  const handleDeleteAttachment = (index: number) => {
    const newAttachements = attachements.fieldAttachements.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    onFieldChange(attachements.field_key, newAttachements as unknown as string[]);

    setAttachements({
      field_key: attachements.field_key,
      fieldAttachements: newAttachements,
    });

    setPreviews(newPreviews);
  };

  //write the function to check whether the all the required filed in the form are filled or not with proper validation
  useEffect(() => {
    let isSubmitable = true;

    eventFormData.form.forEach((field) => {
      if (
        (field.required && !formData[field.field_key]) ||
        (Array.isArray(formData[field.field_key]) && formData[field.field_key].length === 0)
      ) {
        isSubmitable = false;
      }
    });
    setIsFormSubmitable(isSubmitable);
  }, [formData, eventFormData.form]);

  useEffect(() => {
    if (previews.length === 0) {
      eventFormData.form.forEach((field) => {
        if (field.type === 'file' && formData[field.field_key]) {
          setPreviews([
            ...previews,
            ...Array.from(formData[field.field_key] as unknown as string[]).map((file: string) => {
              const fileName = file.split('/').pop() || 'file';
              const fileExtension = file.split('.').pop();
              const fileType =
                fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png'
                  ? `image/${fileExtension}`
                  : fileExtension === 'mp3'
                    ? 'audio/mp3'
                    : fileExtension === 'mp4'
                      ? 'video/mp4'
                      : fileExtension === 'pdf'
                        ? 'application/pdf'
                        : 'application/octet-stream';
              return {
                previewURL: file,
                previewExtension: fileType,
                previewName: fileName,
              };
            }),
          ]);

          setAttachements({
            field_key: field.field_key,
            fieldAttachements: formData[field.field_key] as unknown as File[],
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  return (
    <>
      {claimCodeExceed?.exceeded && (
        <div className={styles.claimCodeExccededMessage}>
          <MdError color='#F04B4B' size={25} />
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
                  previews={previews}
                  handleFileChange={handleFileChange}
                  handleDeleteAttachment={handleDeleteAttachment}
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
          animate={{
            opacity: 1,
            y: 0,
            background: isFormSubmitable
              ? 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)'
              : 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.04) 100%)',
            color: isFormSubmitable ? '#000' : '#fff)',
          }}
          transition={{ duration: 0.6 }}
          whileTap={{ scale: 0.95 }}
          type='submit'
          disabled={loading}
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
                setLoading,
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
                    utmData,
                    navigate,
                    accessCode,
                  });
              });
            } else if (formNumber === 1 && eventFormData.show_ticket_first) {
              if (tickets.some((ticket) => ticket.count > 0)) setFormNumber(0);
              else {
                toast.error('Please select at least one ticket');
              }
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
                  setLoading,
                );
              } else {
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
                  utmData,
                  navigate,
                  accessCode,
                });
              }
            }
          }}
          className={styles.submitButton}
        >
          {loading ? (
            <PropagateLoader
              color={isFormSubmitable ? '#272727' : 'ffffff'}
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
