import Theme from '../../../components/Theme/Theme';
import styles from './Events.module.css';
import { GoPeople } from 'react-icons/go';
import { BsArrowRight, BsThreeDots } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { getEventId, getEvents } from '../../../apis/events';

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import RightClickMenu from './RightClickMenu';
// import RightClickMenu from './Menu';

const Events = () => {
  interface Position {
    x: number;
    y: number;
  }

  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<Position>({ x: 0, y: 0 });

  const handleButtonClick = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    setIsMenuOpen(true);
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isMenuClicked = target.closest('.right-click-menu');
      if (!isMenuClicked) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
                          <div className={styles.eventDetailsHeader}>
                            <p className={styles.eventName}>{event.title}</p>
                            <BsThreeDots
                              onClick={(e: React.MouseEvent<SVGElement, MouseEvent>) => {
                                handleButtonClick(e);
                              }}
                              size={15}
                              color='#ffffff'
                            />
                          </div>
                          <RightClickMenu
                            isOpen={isMenuOpen}
                            position={menuPosition}
                            onClose={handleMenuClose}
                          />
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
