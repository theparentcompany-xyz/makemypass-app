import styles from './EventPage.module.css';
import Theme from '../../../components/Theme/Theme';
import { FiClock } from 'react-icons/fi';
import { IoLocationOutline } from 'react-icons/io5';
import InputFIeld from '../../auth/Login/InputFIeld';
import { GoPerson } from 'react-icons/go';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';

const EventPage = () => {
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
            <InputFIeld
              type='text'
              name='name'
              id='name'
              placeholder='Name'
              icon={<GoPerson size={15} />}
            />
            <InputFIeld
              type='email'
              name='email'
              id='email'
              placeholder='Email'
              icon={<GoPerson size={15} />}
            />
            <InputFIeld
              type='number'
              name='phone'
              id='phone'
              placeholder='Phone'
              icon={<GoPerson size={15} />}
            />
            <InputFIeld
              type='text'
              name='company'
              id='company'
              placeholder='Company'
              icon={<GoPerson size={15} />}
            />
          </div>

          <div className={styles.ticketTypes}>
            <p className={styles.ticketTypesTitle}>Ticket Types</p>
            <p className={styles.eventDescription}>
              Select a ticket type to register for the event.
            </p>
            <div className={styles.ticketType}>
              <p className={styles.ticketName}>Golden Pass</p>
              <p className={styles.ticketPrice}>$50</p>
            </div>
            <div className={styles.ticketType}>
              <p className={styles.ticketName}>Diamond Pass</p>
              <p className={styles.ticketPrice}>$100</p>
            </div>
            <div className={styles.ticketType}>
              <p className={styles.ticketName}>Sliver Pass</p>
              <p className={styles.ticketPrice}>$200</p>
            </div>
          </div>

          <button className={styles.submitButton}>Register Now</button>
        </div>
      </Theme>
    </>
  );
};

export default EventPage;
