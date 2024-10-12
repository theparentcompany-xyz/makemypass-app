import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router';

import { getEventId } from '../../../../apis/events';
import { getSubEvents } from '../../../../apis/subevents';
import { SubEventType } from '../../../../apis/types';
import { formatDate } from '../../../../common/commonFunctions';
import Theme from '../../../../components/Theme/Theme';
import styles from './ListSubEvents.module.css';

// Helper function to group events by start date
const groupEventsByDate = (events: SubEventType[]) => {
  return events.reduce((acc: Record<string, SubEventType[]>, event) => {
    const eventDate = formatDate(event.start_time); // Format to group by date
    if (!acc[eventDate]) {
      acc[eventDate] = [];
    }
    acc[eventDate].push(event);
    return acc;
  }, {});
};

const ListSubEvents = () => {
  const [subEvents, setSubEvents] = useState<SubEventType[]>([]);
  const [eventId, setEventId] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<SubEventType[]>([]);

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
    const alreadySelected = selectedEvents.find((e) => e.id === event.id);
    if (alreadySelected) {
      setSelectedEvents(selectedEvents.filter((e) => e.id !== event.id));
    } else {
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  const groupedEvents = groupEventsByDate(subEvents);

  return (
    <Theme>
      <div className={styles.subEventsListingContainer}>
        {Object.keys(groupedEvents).map((date) => (
          <div key={date}>
            <h2 className={styles.dateHeader}>{date}</h2> {/* Display date header */}
            <div className={styles.eventsContainer}>
              {groupedEvents[date].map((event) => (
                <div key={event.id} className={styles.event}>
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className={`${styles.eventCard} ${
                        selectedEvents.find((e) => e.id === event.id) ? styles.selectedCard : ''
                      }`} // Add a selected class if event is selected
                      onClick={() => handleSelectEvent(event)} // Handle select
                      style={{
                        zIndex: 0,
                      }}
                    >
                      <div className={styles.innerCard}>
                        <div className={styles.eventDetails}>
                          <div className={styles.eventDetailsHeader}>
                            <div>
                              {event.start_time && (
                                <motion.div className={styles.eventDate}>
                                  <p className={styles.date}>{formatDate(event?.start_time)}</p>
                                </motion.div>
                              )}
                              <p className={styles.eventName}>
                                {event.title.substring(0, 40)}
                                {event.title.length > 40 ? '...' : ''}
                              </p>
                            </div>
                          </div>

                          <motion.button whileHover={{ scale: 1.05 }} className={styles.manage}>
                            {selectedEvents.find((e) => e.id === event.id) ? 'Deselect' : 'Select'}
                          </motion.button>
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
    </Theme>
  );
};

export default ListSubEvents;
