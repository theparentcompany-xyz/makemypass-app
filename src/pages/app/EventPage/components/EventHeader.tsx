import { IoLocationOutline } from 'react-icons/io5';
import { EventDetails } from '../../../../apis/types';
import styles from '../EventPage.module.css';
import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router';

const EventHeader = ({ eventData }: { eventData: EventDetails | undefined }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
      className={styles.eventDataContainer}
      onClick={() => {
        navigate(`/${eventData?.name}`);
      }}
    >
      <div className={styles.eventTopHeader}>
        <div>
          <p className={styles.eventTitle}>{eventData?.title}</p>
          <p className={styles.eventDescription}>{eventData?.description}</p>
        </div>
        <div className={styles.headerRightSide}>
          <img src={eventData?.logo} alt='event' className={styles.eventImage} />
        </div>
      </div>

      <div className={styles.otherDetials}>
        <IoLocationOutline size={20} className={styles.clockIcon} />
        <div className={styles.location}>
          <p className={styles.mainLocation}>{eventData?.location}</p>
        </div>
        <FiClock size={20} className={styles.clockIcon} />
        <div className={styles.eventDate}>
          <p className={styles.date}>{eventData?.date}</p>
          <p className={styles.time}>{eventData?.time}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default EventHeader;
