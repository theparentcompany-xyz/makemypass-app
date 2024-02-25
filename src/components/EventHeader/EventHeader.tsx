import { useEffect, useState } from 'react';
import styles from './EventHeader.module.css';
import { getEventData, getEventId } from '../../apis/events';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const EventHeader = () => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    role: '',
    name: '',
    logo: '',
  });
  const [eventId, setEventId] = useState<string>('');
  const { eventTitle } = useParams<{ eventTitle: string }>();

  useEffect(() => {
    let eventData = JSON.parse(localStorage.getItem('eventData') as string);

    if (!eventData)
      setTimeout(() => {
        eventData = JSON.parse(localStorage.getItem('eventData') as string);

        if (eventData) {
          if (eventData.event_name !== eventTitle) {
            localStorage.removeItem('eventData');
            getEventId(eventTitle ?? '');
          } else {
            setEventId(eventData.event_id);
          }
        }
      }, 2000);

    setEventId(eventData?.event_id);
  }, [eventTitle]);

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
              <img className={styles.headerImage} src={eventData.logo} alt='' />
              {eventData?.title}
            </p>
          </div>
          <div className='row'>
            <p className={styles.date}>{eventData?.date}</p>
            <img src='/app/live.gif' alt='' className={styles.gif} />
          </div>
        </motion.div>
      )}
      <hr className={styles.line} />
    </>
  );
};

export default EventHeader;
