import {
  IoAlertCircleOutline,
  IoContract,
  IoLocationOutline,
  IoMapOutline,
  IoPodiumOutline,
} from 'react-icons/io5';
import { EventHosts, EventType } from '../../../../../apis/types';
import styles from './EventHeader.module.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { FaExpandAlt } from 'react-icons/fa';
import { getDay, getMonthAbbreviation } from '../../constants';

const EventHeader = ({ eventData }: { eventData: EventType | undefined }) => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [timer, setTimer] = useState({
    days: 0 as number | string,
    hours: 0 as number | string,
    minutes: 0 as number | string,
    seconds: 0 as number | string,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const eventDate = new Date(eventData?.event_start_date ?? '');
      const currentDate = new Date();
      const diff = eventDate.getTime() - currentDate.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimer({
        days: days < 10 ? `0${days}` : days,
        hours: hours < 10 ? `0${hours}` : hours,
        minutes: minutes < 10 ? `0${minutes}` : minutes,
        seconds: seconds < 10 ? `0${seconds}` : seconds,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [eventData]);

  const navigate = useNavigate();
  return (
    <div className={`styles.eventHeaderContainer ${eventData?.err_message && styles.closedEvent}`}>
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
          {eventData?.banner && (
            <img
              className={styles.bannerImg}
              src={eventData?.banner}
              alt='banner image depecting event information'
            />
          )}
          <div
            style={{
              width: '100%',
              position: 'relative',
            }}
          >
            <p className={styles.eventTitle}>{eventData?.title}</p>
            {eventData?.hosts && eventData?.hosts.length > 0 && (
              <div className={styles.hostedBy}>
                <span>Hosted By:</span>
                {eventData.hosts.map((eventHost: EventHosts) => {
                  return (
                    <div className={styles.eventHost}>
                      {eventHost.profile_pic && (
                        <img
                          src={eventHost.profile_pic}
                          alt='host logo'
                          className={styles.hostLogo}
                        />
                      )}
                      <p className={styles.hostName}>{eventHost.name}</p>
                    </div>
                  );
                })}
              </div>
            )}
            <div className={styles.eventDatePlace}>
              <div className={styles.eventDate}>
                {eventData?.event_start_date && (
                  <>
                    <div className={styles.dateBox}>
                      <p className={styles.eventMonth}>
                        {getMonthAbbreviation(eventData?.event_start_date)}
                      </p>
                      <p className={styles.eventDateNum}>{getDay(eventData?.event_start_date)}</p>
                    </div>
                    <div className={styles.eventDateTimeText}>
                      <p className={styles.eventDateText}>
                        {new Date(eventData?.event_start_date).toLocaleDateString([], {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        }) ?? ''}
                      </p>
                      <p className={styles.eventTimeText}>
                        {new Date(eventData?.event_start_date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {eventData?.event_end_date && (
                          <>
                            {new Date(eventData?.event_end_date).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {', '}
                            {new Date(eventData?.event_end_date).toLocaleDateString([], {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </>
                        )}
                      </p>
                    </div>
                  </>
                )}
              </div>
              {eventData?.place && (
                <div className={styles.eventPlace}>
                  <div className={styles.locationBox}>
                    <IoLocationOutline size={25} className={styles.locationIcon} />
                  </div>
                  <div className={styles.eventDateTimeText}>
                    <p className={styles.eventDateText}>
                      {eventData?.place?.substring(0, eventData.place.indexOf(' , '))}
                    </p>
                    <p className={styles.eventTimeText}>
                      {eventData?.place?.substring(eventData.place.indexOf(' , ') + 2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {eventData?.event_start_date && new Date() < new Date(eventData.event_start_date) && (
              <div className={styles.eventTimer}>
                <div className={styles.timerBox}>
                  <p className={styles.starsin}>
                    <span>Stars in</span>
                  </p>
                  <div className={styles.timer}>
                    <div className={styles.timerBox}>
                      <p className={styles.timerNum}>{timer.days}</p>
                      <p className={styles.timerText}>Days</p>
                    </div>
                    <div className={styles.timerBox}>
                      <p className={styles.timerNum}>{timer.hours}</p>
                      <p className={styles.timerText}>Hrs</p>
                    </div>
                    <div className={styles.timerBox}>
                      <p className={styles.timerNum}>{timer.minutes}</p>
                      <p className={styles.timerText}>Mins</p>
                    </div>
                    <div className={styles.timerBox}>
                      <p className={styles.timerNum}>{timer.seconds}</p>
                      <p className={styles.timerText}>Secs</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {eventData && eventData?.form?.length > 0 && (
              <a href='#formFields'>
                <button className={styles.registerButton}>Register Now!</button>
              </a>
            )}
          </div>
        </div>
      </motion.div>

      <div className={styles.row1} style={showFullDesc ? { flexDirection: 'column' } : {}}>
        {eventData?.description && eventData?.description.length > 0 && (
          <div className={styles.eventDescriptionContainer}>
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%' }}
            >
              <p className={styles.eventDescHeading}>
                <IoAlertCircleOutline color='white' size={25} />
                <span>About the Event</span>
              </p>
              <hr className={styles.line} />
              <motion.p
                className={styles.eventDescription}
                initial={{ height: 'fit-content' }}
                transition={{ duration: 0.5 }}
              >
                {showFullDesc ? (
                  <p dangerouslySetInnerHTML={{ __html: eventData.description }}></p>
                ) : (
                  <p
                    dangerouslySetInnerHTML={
                      eventData.description.length > 275
                        ? {
                            __html: eventData?.description?.substring(0, 275).concat('...'),
                          }
                        : { __html: eventData.description }
                    }
                  ></p>
                )}
              </motion.p>
              {eventData.description.length > 275 && (
                <div className={styles.expandIcon}>
                  {!showFullDesc ? (
                    <FaExpandAlt
                      onClick={() => {
                        setShowFullDesc((prev) => !prev);
                      }}
                    />
                  ) : (
                    <IoContract
                      size={20}
                      onClick={() => {
                        setShowFullDesc((prev) => !prev);
                      }}
                    />
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {eventData?.location && (
          <div className={styles.googleContainer}>
            <div className={styles.locationHeader}>
              <IoMapOutline size={20} className={styles.locationIcon} />
              <p>View In Map</p>
            </div>
            <iframe
              style={{ width: '100%' }}
              src={`https://maps.google.com/maps?q=${eventData?.location?.lat},${eventData?.location?.lng}&z=16&output=embed`}
            ></iframe>

            <div className={styles.bottomLocationHeader}>
              <div className={styles.eventDateTimeText}>
                <p className={styles.eventDateText}>
                  {' '}
                  {eventData?.place?.substring(0, eventData.place.indexOf(' , '))}
                </p>
                <p className={styles.eventTimeText}>
                  {eventData?.place?.substring(eventData.place.indexOf(' , ') + 2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {eventData?.speakers && eventData?.speakers.length > 0 && (
        <div className={styles.row1}>
          <div className={styles.speakersContainer}>
            <p className={styles.speakersHeading}>
              <IoPodiumOutline color='white' />
              <span>Our Speakers</span>
            </p>
            <hr className={styles.line} />
            <div className={styles.speakersListing}>
              {eventData.speakers.map((speaker) => {
                return (
                  <div className={styles.speakerContainer}>
                    {speaker.image && (
                      <img
                        src={speaker.image}
                        alt='speaker profile'
                        className={styles.speakerProfilePic}
                      />
                    )}
                    <motion.div className={styles.speakerInfo}>
                      <p className={styles.speakerName}>{speaker.name}</p>
                      <p className={styles.speakerPosition}>
                        {speaker.position.length > 30
                          ? `${speaker.position.substring(0, 30)}...`
                          : speaker.position}
                      </p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventHeader;
