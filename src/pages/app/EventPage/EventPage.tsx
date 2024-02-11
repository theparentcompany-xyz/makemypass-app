import styles from './EventPage.module.css';
import Theme from '../../../components/Theme/Theme';
import { FiClock } from 'react-icons/fi';
import { IoLocationOutline } from 'react-icons/io5';
import InputFIeld from '../../auth/Login/InputFIeld';
import { GoPerson } from 'react-icons/go';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getEventId } from '../../../apis/events';
import { getTickets } from '../../../apis/publicpage';
import { TicketOptions } from './types';

const EventPage = () => {
  const { eventTitle } = useParams<{ eventTitle: string }>();
  const [ticketInfo, setTicketInfo] = useState<TicketOptions>();

  useEffect(() => {
    if (eventTitle) getEventId(eventTitle);

    setTimeout(() => {
      const eventId = JSON.parse(localStorage.getItem('eventData') || '{}').event_id;
      if (eventId) {
        getTickets(eventId, setTicketInfo);
      } else {
        console.log('Event not found');
      }
    }, 100);
  }, [eventTitle]);

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
          <div className={styles.ticketTypes}>
            <p className={styles.ticketTypesTitle}>Ticket Types</p>
            <p className={styles.eventDescription}>
              Select a ticket type to register for the event.
            </p>
            {ticketInfo &&
              Object.keys(ticketInfo).map((ticketType) => (
                <div key={ticketType} className={styles.ticketType}>
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
                        {Object.keys(ticketInfo[ticketType].perks).map((perk) => (
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
        </div>
      </Theme>
    </>
  );
};

export default EventPage;
