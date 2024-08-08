import styles from './EventHeader.module.css';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { EventType } from '../../apis/types';
import { getEventInfo } from '../../apis/publicpage';
// import { getEventInfo } from '../../apis/publicpagkwe';
// import { EventType } from '../../apis/types';
// import { useState } from 'react';

const EventHeader = ({ previousPageNavigate }: { previousPageNavigate: string }) => {
  const localEventData = JSON.parse(sessionStorage.getItem('eventData')!);
  const [eventData, setEventData] = useState<EventType>();

  useEffect(() => {
    if (!localEventData) {
      getEventInfo(sessionStorage.getItem('eventId') as string, setEventData);
      console.log(eventData);
    }
  }, []);

  const navigate = useNavigate();

  return (
    <>
      {localEventData && localEventData.title && (
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
                  if (previousPageNavigate === '-1') {
                    navigate(-1);
                  } else {
                    navigate(previousPageNavigate);
                  }
                }}
                className={styles.goBack}
              >
                {'<'}
              </button>
            </div>
            <div className={styles.headerText}>
              {localEventData.logo ? (
                <img
                  className={styles.headerImage}
                  src={localEventData.logo}
                  alt='Event logo for the dashboard'
                />
              ) : (
                <p className={styles.headerImage}>{localEventData.title.charAt(0).toUpperCase()}</p>
              )}
              {localEventData?.title}
            </div>
          </div>
          <div className='row'>
            <p className={styles.date}>{localEventData?.date}</p>
            <img src='/app/live.gif' alt='Live indicator gif' className={styles.gif} />
          </div>
        </motion.div>
      )}
      <hr className={styles.line} />
    </>
  );
};

export default EventHeader;
