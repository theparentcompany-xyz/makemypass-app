import styles from './EventPage.module.css';
import Theme from '../../../components/Theme/Theme';
import { FiClock } from 'react-icons/fi';
import { IoLocationOutline } from 'react-icons/io5';
import InputFIeld from '../../auth/Login/InputFIeld';
import { GoPerson } from 'react-icons/go';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getEventId } from '../../../apis/events';
import { applyCoupon, getFormFields, getTickets, submitForm } from '../../../apis/publicpage';
import { TicketOptions } from './types';

import Select from 'react-select';
import { showRazorpay } from './components/Razorpay';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';

const EventPage = () => {
  const { eventTitle } = useParams<{ eventTitle: string }>();
  const [ticketInfo, setTicketInfo] = useState<TicketOptions>();
  const [formFields, setFormFields] = useState<any>([]);
  const [ticketId, setTicketId] = useState<string>('');
  const [eventData, setEventData] = useState<any>({});
  const [formErrors, setFormErrors] = useState<any>({});

  let eventId: string = '';

  const [formData, setFormData] = useState<any>({});
  const [amount, setAmount] = useState<string>('');

  // const [discount, setDiscount] = useState<{
  //   coupon_code: string;
  //   coupon_type: string;
  // }>();

  useEffect(() => {
    if (eventTitle) getEventId(eventTitle);

    setTimeout(() => {
      eventId = JSON.parse(localStorage.getItem('eventData') || '{}').event_id;
      setEventData(JSON.parse(localStorage.getItem('eventData') || '{}'));
      if (eventId) {
        getTickets(eventId, setTicketInfo);
        getFormFields(eventId, setFormFields);
      }
    }, 1000);
  }, [eventTitle, eventId]);

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

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      border: 'none',
      backgroundColor: '#2A3533',
      fontFamily: 'Inter, sans-serif',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '0.9rem',
    }),

    group: (provided: any) => ({
      ...provided,
      paddingTop: 0,
    }),

    singleValue: (base: any) => ({
      ...base,
      color: '#fff',
    }),
    option: (provided: any) => ({
      ...provided,
      fontFamily: 'Inter, sans-serif',
      color: '#000',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '0.9rem',
    }),
  };

  const onFieldChange = (fieldName: string, fieldValue: string) => {
    setFormData({
      ...formData,
      [fieldName]: fieldValue,
    });
  };

  return (
    <>
      <Theme>
        <form className={styles.eventPageContainer}>
          <div className={styles.eventDataContainer}>
            <p className={styles.eventTitle}>{eventData.event_name}</p>
            <p className={styles.eventDescription}>{eventData.description}</p>
            <div className={styles.otherDetials}>
              <FiClock size={25} className={styles.clockIcon} />
              <div className={styles.eventDate}>
                <p className={styles.date}>{eventData.date}</p>
                <p className={styles.time}>{eventData.time}</p>
              </div>
              <IoLocationOutline size={25} className={styles.clockIcon} />
              <div className={styles.location}>
                <p className={styles.mainLocation}>{eventData.location}</p>
                {/* <p className={styles.subLocation}>Eiffel Tower, 5th Floor</p> */}
              </div>
            </div>
          </div>
          <div className={styles.eventForm}>
            <p className={styles.eventFormTitle}>Registration Form</p>
            <p className={styles.eventDescription}>
              Please fill in the form below to register for the event.
            </p>
            {formFields?.map((field: any) => {
              if (field.type === 'text') {
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
                    type={field.type}
                    icon={
                      <GoPerson
                        size={20}
                        style={{
                          color: '#9E9E9E',
                        }}
                      />
                    }
                    required={field.required}
                  />
                );
              } else if (field.type === 'dropdown' || field.type === 'checkbox') {
                return (
                  <>
                    <p className={styles.formLabel}>{field.title}</p>
                    <div className={styles.dropdown}>
                      <Select
                        options={field.options?.map((option: string) => ({
                          value: option,
                          label: option,
                        }))}
                        styles={customStyles}
                        onChange={(selectedOption: any) =>
                          onFieldChange(field.field_key, selectedOption.value)
                        }
                        placeholder={`Select your ${field.title}`}
                        isSearchable={false}
                      />
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <div className={styles.row}>
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
                        icon={
                          <GoPerson
                            size={20}
                            style={{
                              color: '#9E9E9E',
                            }}
                          />
                        }
                        required={field.required}
                      />

                      <SecondaryButton
                        onClick={() => {
                          applyCoupon(eventId, formData[field.field_key], setAmount);
                        }}
                        buttonText='Validate Code'
                      />
                    </div>
                  </>
                );
              }
            })}
          </div>
          {ticketInfo && (
            <div className={styles.ticketTypes}>
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
                    setAmount(ticketInfo[ticketType].price.toString());
                  }}
                  className={styles.ticketType}
                  style={{
                    border:
                      ticketId === ticketInfo[ticketType].id
                        ? '2px solid #FFFFFF'
                        : '2px solid #2A3533',
                  }}
                >
                  <div className={styles.ticketHeader}>
                    <div className={styles.passText}>
                      <p className={styles.ticketTypeTitle}>{ticketType}</p>
                      <p className={styles.ticketPrice}>
                        {Number(ticketInfo[ticketType].price) === 0
                          ? 'Free'
                          : `Rs.${ticketInfo[ticketType].price}`}
                      </p>
                    </div>

                    {ticketInfo[ticketType].limit && (
                      <div className={styles.ticketCount}>
                        <p className={styles.ticketCountText}>
                          {ticketInfo[ticketType].slots_left} tickets left
                        </p>
                        {ticketInfo[ticketType].platform_fee_from_user &&
                          Number(ticketInfo[ticketType].price) > 0 && (
                            <p className={styles.extraCharges}>
                              {ticketInfo[ticketType].platform_fee}% extra charges
                            </p>
                          )}
                      </div>
                    )}
                  </div>
                  <div className={styles.ticketBody}>
                    <p className={styles.ticketPerksTitle}>Ticket Perks</p>
                    <div className={styles.ticketPerks}>
                      <ul className={styles.perkList}>
                        {Object.keys(ticketInfo[ticketType].perks)?.map((perk) => (
                          <li key={perk} className={styles.perk}>
                            {perk}: {ticketInfo[ticketType].perks[perk]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            type='submit'
            onClick={(e) => {
              e.preventDefault();
              if (amount === '0') submitForm(ticketId, formData);
              else showRazorpay(formData.name, ticketId, formData, setFormErrors);
            }}
            className={styles.submitButton}
          >
            Submit Form
          </button>
        </form>
      </Theme>
    </>
  );
};

export default EventPage;
