import { useContext, useEffect, useState } from 'react';
import styles from './EventHeader.module.css';
import { getEventData } from '../../apis/events';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlobalContext } from '../../contexts/globalContext';

const EventHeader = () => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    role: '',
    name: '',
    logo: '',
  });

  const { eventId } = useContext(GlobalContext);

  useEffect(() => {
    if (eventId) getEventData(eventId, setEventData);
  }, [eventId]);

  const navigate = useNavigate();

  return (
    <>
      {eventData && eventData.title && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.headerRow}
        >
          <div className={styles.row}>
            <div className={styles.backButton}>
              <button
                onClick={() => {
                  navigate('/events');
                }}
                className={styles.goBack}
              >
                {'<'}
              </button>
            </div>
            <p className={styles.headerText}>
              <img
                className={styles.headerImage}
                src={eventData.logo}
                alt='Event logo for the dashboarod'
              />
              {eventData?.title}
            </p>
          </div>
          <div className='row'>
            <p className={styles.date}>{eventData?.date}</p>
            <img src='/app/live.gif' alt='Live indicator gif' className={styles.gif} />
          </div>
        </motion.div>
      )}
      <hr className={styles.line} />
    </>
  );
};

export default EventHeader;
