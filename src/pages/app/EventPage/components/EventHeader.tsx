import { IoLocationOutline } from 'react-icons/io5';
import { EventDetails } from '../../../../apis/types';
import styles from './EventHeader.module.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { FaExpandAlt } from 'react-icons/fa';
import { getDay, getMonthAbbreviation } from '../constants';

const EventHeader = ({ eventData }: { eventData: EventDetails | undefined }) => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const navigate = useNavigate();
  return (
    <div className={styles.eventHeaderContainer}>
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className={styles.bannerContainer}
        onClick={() => {
          navigate(`/${eventData?.name}`);
        }}
      >
        <div className={styles.eventTopHeader}>
          <img className={styles.bannerImg} src={eventData?.banner} alt='' />
          <div>
            <p className={styles.eventTitle}>{eventData?.title}</p>
            <div className={styles.eventDatePlace}>
              <div className={styles.eventDate}>
                <div className={styles.dateBox}>
                  <p className={styles.eventMonth}>
                    {getMonthAbbreviation(eventData?.start_date ?? '')}
                  </p>
                  <p className={styles.eventDateNum}>{getDay(eventData?.start_date ?? '')}</p>
                </div>
                <div className={styles.eventDateTimeText}>
                  <p className={styles.eventDateText}>{eventData?.start_date}</p>
                  <p className={styles.eventTimeText}>
                    {eventData?.start_time} - {eventData?.end_time}
                    {', '}
                    {eventData?.end_date.substring(eventData?.end_date.indexOf(',') + 1)}
                  </p>
                </div>
              </div>
              <div className={styles.eventPlace}>
                <div className={styles.locationBox}>
                  <IoLocationOutline size={25} className={styles.locationIcon} />
                </div>
                <div className={styles.eventDateTimeText}>
                  <p className={styles.eventDateText}>{eventData?.place}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className={styles.row1} style={showFullDesc ? { flexDirection: 'column' } : {}}>
        <div className={styles.eventDescriptionContainer}>
          {eventData?.description && (
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <p className={styles.eventDescHeading}>About the Event</p>
              <motion.p
                className={styles.eventDescription}
                initial={{ height: 'fit-content' }}
                animate={{ height: showFullDesc ? 'fit-content' : '60px' }}
                transition={{ duration: 0.5 }}
              >
                {showFullDesc ? (
                  <p dangerouslySetInnerHTML={{ __html: eventData.description }}></p>
                ) : (
                  <p
                    dangerouslySetInnerHTML={{
                      __html: eventData.description
                        .substring(0, eventData.description.indexOf('</p>') - 100)
                        .concat('...'),
                    }}
                  ></p>
                )}
              </motion.p>
              <div className={styles.expandIcon}>
                <FaExpandAlt
                  onClick={() => {
                    setShowFullDesc((prev) => !prev);
                  }}
                />
              </div>
            </motion.div>
          )}
        </div>

        <div className={styles.googleContainer}>
          <div className={styles.locationHeader}>
            <IoLocationOutline size={20} className={styles.locationIcon} />
            <p>Location</p>
          </div>
          <iframe
            style={{ width: '100%' }}
            src={`https://maps.google.com/maps?q=${eventData?.location?.lat},${eventData?.location?.lng}&z=16&output=embed`}
          ></iframe>

          <div className={styles.bottomLocationHeader}>
            <div className={styles.eventDateTimeText}>
              <p className={styles.eventDateText}>{eventData?.place}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
