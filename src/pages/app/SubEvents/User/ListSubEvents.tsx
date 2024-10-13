import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IoLocationOutline } from 'react-icons/io5';
import { useParams } from 'react-router';

import { getEventId } from '../../../../apis/events';
import { getSubEvents } from '../../../../apis/subevents';
import { SubEventType } from '../../../../apis/types';
import { formatDate, formatTime } from '../../../../common/commonFunctions';
import Modal from '../../../../components/Modal/Modal';
import Theme from '../../../../components/Theme/Theme';
import { getDay, getMonthAbbreviation } from '../../EventPage/constants';
import styles from './ListSubEvents.module.css';

const groupEventsByDateAndTime = (events: SubEventType[]) => {
  return events.reduce((acc: Record<string, Record<string, SubEventType[]>>, event) => {
    const eventDate = formatDate(event.start_time);
    const eventTime = formatTime(event.start_time);
    if (!acc[eventDate]) {
      acc[eventDate] = {};
    }
    if (!acc[eventDate][eventTime]) {
      acc[eventDate][eventTime] = [];
    }
    acc[eventDate][eventTime].push(event);
    return acc;
  }, {});
};

const ListSubEvents = () => {
  const [subEvents, setSubEvents] = useState<SubEventType[]>([]);
  const [eventId, setEventId] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [disabledEvents, setDisabledEvents] = useState<string[]>([]);
  const [showDetailedView, setShowDetailedView] = useState<SubEventType | null>(null);

  const { eventTitle, eventRegisterId } = useParams<{
    eventTitle: string;
    eventRegisterId: string;
  }>();

  useEffect(() => {
    if (eventTitle && !eventId) {
      getEventId(eventTitle)
        .then((response) => {
          setEventId(response.id);
        })
        .catch(() => {
          toast.error('Unable to process the request');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    if (eventId && eventRegisterId) {
      getSubEvents(eventId, eventRegisterId, setSubEvents);
    }
  }, [eventId, eventRegisterId]);

  const handleSelectEvent = (event: SubEventType) => {
    const alreadySelected = selectedEvents.find((e) => e === event.id);
    if (alreadySelected) {
      setSelectedEvents(selectedEvents.filter((e) => e !== event.id));
      setDisabledEvents([]);
    } else {
      setSelectedEvents([...selectedEvents, event.id]);
      const simultaneousEvents = subEvents.filter(
        (e) => e.start_time === event.start_time && e.id !== event.id,
      );
      setDisabledEvents(simultaneousEvents.map((e) => e.id));
    }
  };

  const groupedEvents = groupEventsByDateAndTime(subEvents);

  return (
    <Theme>
      {showDetailedView && (
        <Modal title={showDetailedView.title} onClose={() => setShowDetailedView(null)} type='side'>
          <div className={styles.detailedView}>
            <div className={styles.eventDetails}>
              <div className={styles.headingTexts}>
                <p className={styles.eventTitle}>{showDetailedView?.title}</p>
                <div className={styles.eventDatePlace}>
                  <div className={styles.eventDate}>
                    {showDetailedView?.start_time && (
                      <>
                        <div className={styles.dateBox}>
                          <p className={styles.eventMonth}>
                            {getMonthAbbreviation(showDetailedView?.start_time)}
                          </p>
                          <p className={styles.eventDateNum}>
                            {getDay(showDetailedView?.start_time)}
                          </p>
                        </div>
                        <div className={styles.eventDateTimeText}>
                          <p className={styles.eventDateText}>
                            {new Date(showDetailedView?.start_time).toLocaleDateString([], {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            }) ?? ''}
                          </p>
                          <p className={styles.eventTimeText}>
                            {new Date(showDetailedView?.start_time).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            -{' '}
                            {showDetailedView?.end_time && (
                              <>
                                {new Date(showDetailedView?.end_time).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                                {', '}
                                {new Date(showDetailedView?.end_time).toLocaleDateString([], {
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
                  <div className={styles.eventPlace}>
                    {showDetailedView?.place && (
                      <>
                        <div className={styles.locationBox}>
                          <IoLocationOutline size={25} className={styles.locationIcon} />
                        </div>
                        <div className={styles.eventDateTimeText}>
                          <p className={styles.eventDateText}>{showDetailedView?.place}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className={styles.eventDescription}>
                  <p
                    dangerouslySetInnerHTML={
                      showDetailedView.description
                        ? { __html: showDetailedView.description }
                        : { __html: '' }
                    }
                    style={{
                      transition: 'max-height 0.3s ease',
                    }}
                  ></p>
                </div>
              </div>

              <div className='row'>
                <motion.button
                  onClick={() => handleSelectEvent(showDetailedView)}
                  className={styles.manage}
                >
                  {selectedEvents.find((e) => e === showDetailedView.id) ? 'Deselect' : 'Select'}
                </motion.button>
              </div>
            </div>
          </div>
        </Modal>
      )}
      <div className={styles.subEventsListingContainer}>
        {Object.keys(groupedEvents).map((date) => (
          <div key={date}>
            <p className={styles.dateHeader}>{date}</p> {/* Display date header */}
            {Object.keys(groupedEvents[date]).map((time) => (
              <div key={time}>
                <p className={styles.timeHeader}>{time}</p> {/* Display time header */}
                <div className={styles.eventsContainer}>
                  {groupedEvents[date][time].map((event) => (
                    <div key={event.id} className={styles.event}>
                      <div>
                        <motion.div
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className={`${styles.eventCard} ${
                            selectedEvents.find((e) => e === event.id) ? styles.selectedCard : ''
                          }`} // Add a selected class if event is selected
                          onClick={() =>
                            !disabledEvents.includes(event.id) && handleSelectEvent(event)
                          } // Handle select
                          style={{
                            zIndex: 0,
                            pointerEvents: disabledEvents.includes(event.id) ? 'none' : 'auto',
                            opacity: disabledEvents.includes(event.id) ? 0.5 : 1,
                          }}
                        >
                          <div className={styles.innerCard}>
                            <div className={styles.eventDetails}>
                              <div className={styles.headingTexts}>
                                <p className={styles.eventTitle}>{event?.title}</p>
                              </div>

                              <div className={styles.eventDatePlace}>
                                <div className={styles.eventDate}>
                                  {event?.start_time && (
                                    <>
                                      <div className={styles.dateBox}>
                                        <p className={styles.eventMonth}>
                                          {getMonthAbbreviation(event?.start_time)}
                                        </p>
                                        <p className={styles.eventDateNum}>
                                          {getDay(event?.start_time)}
                                        </p>
                                      </div>
                                      <div className={styles.eventDateTimeText}>
                                        <p className={styles.eventDateText}>
                                          {new Date(event?.start_time).toLocaleDateString([], {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                          }) ?? ''}
                                        </p>
                                        <p className={styles.eventTimeText}>
                                          {new Date(event?.start_time).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          })}{' '}
                                          -{' '}
                                          {event?.end_time && (
                                            <>
                                              {new Date(event?.end_time).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                              })}
                                              {', '}
                                              {new Date(event?.end_time).toLocaleDateString([], {
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
                                <div className={styles.eventPlace}>
                                  {event?.place && (
                                    <>
                                      <div className={styles.locationBox}>
                                        <IoLocationOutline
                                          size={25}
                                          className={styles.locationIcon}
                                        />
                                      </div>
                                      <div className={styles.eventDateTimeText}>
                                        <p className={styles.eventDateText}>{event?.place}</p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className='row'>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  className={styles.manage}
                                >
                                  {selectedEvents.find((e) => e === event.id)
                                    ? 'Deselect'
                                    : 'Select'}
                                </motion.button>
                                <motion.button
                                  onClick={() => setShowDetailedView(event)}
                                  className={styles.manage}
                                >
                                  View More
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        className={styles.submitButton}
        onClick={() => {
          toast.success('Events selected successfully');
        }}
      >
        Submit
      </motion.button>
    </Theme>
  );
};

export default ListSubEvents;
