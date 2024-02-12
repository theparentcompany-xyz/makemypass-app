import styles from './EventPage.module.css';
import Theme from '../../../components/Theme/Theme';
import { FiClock } from 'react-icons/fi';
import { IoLocationOutline } from 'react-icons/io5';
import InputFIeld from '../../auth/Login/InputFIeld';
import { GoPerson } from 'react-icons/go';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getEventId } from '../../../apis/events';
import { getFormFields, getTickets, submitForm } from '../../../apis/publicpage';
import { TicketOptions } from './types';

import Select from 'react-select';
import Razorpay from './components/Razorpay';

const EventPage = () => {
  const { eventTitle } = useParams<{ eventTitle: string }>();
  const [ticketInfo, setTicketInfo] = useState<TicketOptions>();
  const [formFields, setFormFields] = useState<any>([
    {
      id: 'f3a54a2f-7f0d-4f38-a6c1-84c49d3c6c1d',
      type: 'SmallText',
      title: 'Name',
      unique: false,
      options: [],
      required: true,
      field_key: 'name',
    },
    {
      id: 'a2b5e5e6-4a69-48f3-823a-3a9bbd2a6c8f',
      type: 'SmallText',
      title: 'Email',
      unique: false,
      options: [],
      required: true,
      field_key: 'email',
    },
    {
      id: 'c0f47e51-9b64-4b18-bf8a-1c9b0a7cc3ea',
      type: 'SmallText',
      title: 'Phone Number',
      unique: false,
      options: [],
      required: true,
      field_key: 'phone_number',
    },
    {
      id: 'd8e37a91-6d63-4c1f-9a3b-82d5c2e7bax3',
      type: 'Dropdown',
      title: 'District',
      unique: false,
      options: [
        'Thiruvananthapuram',
        'Kollam',
        'Pathanamthitta',
        'Alappuzha',
        'Kottayam',
        'Idukki',
        'Ernakulam',
        'Thrissur',
        'Palakkad',
        'Malappuram',
        'Kozhikode',
        'Wayanad',
        'Kannur',
        'Kasaragod',
      ],
      required: true,
      field_key: 'district',
    },
    {
      id: 'e32ab742-ee2b-4cb4-90b0-071aeb446f58',
      type: 'Dropdown',
      title: 'Category',
      unique: false,
      options: [
        'Student',
        'Startup',
        'Local Business/SME',
        'Working Professional',
        'NRE or Gulf Returnees',
        'Other',
      ],
      required: true,
      field_key: 'category',
    },
    {
      id: '3a2c14b3-7cf2-42e5-8c2d-6faedaae2e25',
      type: 'SmallText',
      title: 'Company / Organization',
      unique: false,
      options: [],
      required: false,
      field_key: 'organization',
    },
  ]);
  const [ticketId, setTicketId] = useState<string>('');

  let eventId: string = '';

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (eventTitle) getEventId(eventTitle);

    setTimeout(() => {
      eventId = JSON.parse(localStorage.getItem('eventData') || '{}').event_id;
      if (eventId) {
        getTickets(eventId, setTicketInfo);
        getFormFields(eventId, setFormFields);
      }
    }, 100);
  }, [eventTitle]);

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
        <div className={styles.eventPageContainer}>
          <div className={styles.eventDataContainer}>
            <p className={styles.eventTitle}>ScaleUp Conclave 2024</p>
            <p className={styles.eventDescription}>
              ScaleUp Conclave is an annual event that brings together the best minds in the
              industry to discuss the latest trends and innovations.
            </p>
            <div className={styles.otherDetials}>
              <FiClock size={25} className={styles.clockIcon} />
              <div className={styles.eventDate}>
                <p className={styles.date}>Tuesday, 20 February</p>
                <p className={styles.time}>19:00 - 21:00 GMT+1</p>
              </div>
              <IoLocationOutline size={25} className={styles.clockIcon} />
              <div className={styles.location}>
                <p className={styles.mainLocation}>Paris, Île-de-France</p>
                <p className={styles.subLocation}>Eiffel Tower, 5th Floor</p>
              </div>
            </div>
          </div>
          <div className={styles.eventForm}>
            <p className={styles.eventFormTitle}>Registration Form</p>
            <p className={styles.eventDescription}>
              Please fill in the form below to register for the event.
            </p>
            {formFields?.map((field: any) =>
              field.type === 'text' ? (
                <InputFIeld
                  name={field.field_key}
                  placeholder={field.title}
                  id={field.id}
                  key={field.id}
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
                />
              ) : (
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
              ),
            )}
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
                      <p className={styles.ticketTypeTitle}>{ticketType} Pass</p>
                      <p className={styles.ticketPrice}>Rs.{ticketInfo[ticketType].price}</p>
                    </div>

                    {ticketInfo[ticketType].limit && (
                      <div className={styles.ticketCount}>
                        <p className={styles.ticketCountText}>
                          {ticketInfo[ticketType].slots_left}/{ticketInfo[ticketType].limit} tickets
                          left
                        </p>
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
          <button onClick={() => submitForm(ticketId, formData)} className={styles.submitButton}>
            Submit Form
          </button>
          <Razorpay />
        </div>
      </Theme>
    </>
  );
};

export default EventPage;
