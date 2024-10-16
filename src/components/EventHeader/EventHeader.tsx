import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import styles from './EventHeader.module.css';

const EventHeader = ({
  previousPageNavigate,
  isLive,
}: {
  previousPageNavigate?: string;
  isLive?: boolean;
}) => {
  const localEventData = JSON.parse(sessionStorage.getItem('eventData')!);

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
          <div className='row'>
            {previousPageNavigate && (
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
            )}
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
            {isLive && <img src='/app/live.gif' alt='Live indicator gif' className={styles.gif} />}
          </div>
        </motion.div>
      )}
      <hr className={styles.line} />
    </>
  );
};

export default EventHeader;
