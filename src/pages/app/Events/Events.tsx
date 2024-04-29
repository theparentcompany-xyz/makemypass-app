import Theme from '../../../components/Theme/Theme';
import styles from './Events.module.css';
import { GoPeople } from 'react-icons/go';
import { BsArrowRight } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { getEventId, getEvents } from '../../../apis/events';

import { motion } from 'framer-motion';

import { useContext } from 'react';
import { GlobalContext } from '../../../contexts/globalContext';
import { useNavigate } from 'react-router';

const Events = () => {
  const { setEventId } = useContext(GlobalContext);
  // let { currentUserRole } = useContext(GlobalContext);
  const navigate = useNavigate();

  type Event = {
    id: string;
    title: string;
    members: number;
    logo: string | null;
    date: string;
    day: string;
    name: string;
    start_day: string;
    start_date: string;
  };

  const [events, setEvents] = useState([] as Event[]);

  useEffect(() => {
    getEvents(setEvents);
  }, []);

  const handleClick = (eventName: string) => {
    getEventId(eventName?.toLowerCase(), navigate);
  };

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
                    <p className={styles.date}>{event?.start_date}</p>
                  </motion.div>

                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className={styles.eventCard}
                    >
                      <div className={styles.innerCard}>
                        {event.logo ? (
                          <motion.img
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            src={event.logo}
                            alt='event logo depicting event information'
                            className={styles.eventImage}
                          />
                        ) : (
                          <div className={styles.eventImage}>
                            {event.title.charAt(0).toUpperCase()}
                          </div>
                        )}
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
                              handleClick(event.name);

                              if (setEventId) {
                                setEventId(event.id);
                              }
                            }}
                          >
                            Manage
                            <BsArrowRight size={15} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
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
