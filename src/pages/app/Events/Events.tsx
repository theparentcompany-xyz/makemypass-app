import Theme from '../../../components/Theme/Theme';
import styles from './Events.module.css';
import { GoPeople } from 'react-icons/go';
import { BsArrowRight } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { getEventData, getEventId, getEvents } from '../../../apis/events';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Events = () => {
  const navigate = useNavigate();

  type Event = {
    id: string;
    title: string;
    members: number;
    logo: string | null;
    date: string;
    day: string;
    name: string;
  };

  const [events, setEvents] = useState([] as Event[]);
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    role: '',
    name: '',
  });

  useEffect(() => {
    getEvents(setEvents);
  }, []);

  const handleClick = (eventName: string) => {
    const currentEvent = localStorage.getItem('eventData');
    if (currentEvent) {
      const eventData = JSON.parse(currentEvent);
      if (eventData.event_name !== eventName?.trim().toLowerCase()) {
        localStorage.removeItem('eventData');
        getEventId(eventName?.toLowerCase());
        localStorage.setItem('eventName', eventName?.toLowerCase());
      }
    } else {
      getEventId(eventName?.toLowerCase());
      localStorage.setItem('eventName', eventName?.toLowerCase());
    }
  };

  const getEventRole = (eventId: string) => {
    getEventData(eventId, setEventData);
  };

  useEffect(() => {
    const eventName = JSON.parse(localStorage.getItem('eventData')!)?.event_name || '';
    console.log(eventName);
    if (eventData.role === 'Admin') {
      navigate(`/${eventName.toLowerCase()}/overview/`);
    } else if (eventData.role === 'Volunteer') {
      navigate(`/${eventName.toLowerCase()}/checkins/`);
    } else if (eventData.role === 'Gamer') {
      navigate(`/${eventName.toLowerCase()}/spinwheel/`);
    }
  }, [eventData]);

  return (
    <>
      <Theme>
        <div className={styles.homeContainer}>
          <div>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={styles.homeHeader}
            >
              {events.length > 0 ? 'Your Events' : 'No Events Currently'}
            </motion.p>
            <div className={styles.eventsContainer}>
              {events.map((event) => (
                <div key={event.id} className={styles.event}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={styles.eventDate}
                  >
                    <p className={styles.date}>{event.date}</p>
                    <p className={styles.day}>{event.day}</p>
                  </motion.div>

                  {/* <motion.img
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={styles.slider}
                    src='/app/slider.webp'
                    alt=''
                  /> */}
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className={styles.eventCard}
                    >
                      <div className={styles.innerCard}>
                        <motion.img
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          src={event.logo || '/maskable.webp'}
                          alt=''
                          className={styles.eventImage}
                        />
                        <div className={styles.eventDetails}>
                          <p className={styles.eventName}>{event.title}</p>
                          <p className={styles.eventGuests}>
                            <span>
                              <GoPeople color='a4a4a4' />
                            </span>
                            {event.members} guests
                          </p>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className={styles.manage}
                            onClick={() => {
                              console.log(event);
                              handleClick(event.name);
                              getEventRole(event.id);
                            }}
                          >
                            Manage
                            <BsArrowRight size={15} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                    {/* <button className={styles.create}>
                      <FaPlus size={15} />
                      Create New Event
                    </button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Theme>
    </>
  );
};

export default Events;
