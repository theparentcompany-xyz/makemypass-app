import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router';
import { HashLoader } from 'react-spinners';

import { getEventId } from '../../../../apis/events';
import { getSubEventForm, getSubEvents } from '../../../../apis/subevents';
import { FormFieldType, SubEventType } from '../../../../apis/types';
import { formatDate, formatTime } from '../../../../common/commonFunctions';
import Theme from '../../../../components/Theme/Theme';
import DatePlace from '../components/DatePlace/DatePlace';
import DetailedView from '../components/Modals/DetailedView/DetailedView';
import RemoveConfirmation from '../components/Modals/RemoveConfirmation/RemoveConfirmation';
import SubEventForm from '../components/Modals/SubEventForm/SubEventForm';
import styles from './ListSubEvents.module.css';
import type { SelectedSubEventsType } from './types';

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
  const [selectedEvents, setSelectedEvents] = useState<SelectedSubEventsType[]>([]);
  const [showDetailedView, setShowDetailedView] = useState<SubEventType | null>(null);
  const [subEventForm, setSubEventForm] = useState<FormFieldType[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [subEventToRemove, setSubEventToRemove] = useState<string | null>(null);
  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);

  const [isEventsLoading, setIsEventsLoading] = useState(true);

  const { eventTitle, eventRegisterId } = useParams<{
    eventTitle: string;
    eventRegisterId: string;
  }>();

  //Getting the event id from the event title(used in the url)
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

  //Fetching the sub events for the event
  useEffect(() => {
    if (eventId && eventRegisterId) {
      getSubEvents(eventId, eventRegisterId, setSubEvents, setIsEventsLoading);
    }
  }, [eventId, eventRegisterId, triggerFetch]);

  //Setting the preselected events
  useEffect(() => {
    const preSelectedEvents = subEvents
      .filter((event) => event.already_booked)
      .map((event) => ({ id: event.id, alreadyRegistered: true }));
    setSelectedEvents(preSelectedEvents);
  }, [subEvents]);

  // useEffect(() => {
  //   if (subEventForm.length === 0 && eventRegisterId && eventId) {
  //     subEventRegister(
  //       eventId,
  //       eventRegisterId,
  //       formData,
  //       selectedEvents,
  //       setFormErrors,
  //       setTriggerFetch,
  //     );
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [subEventForm]);

  const handleSelectEvent = (event: SubEventType) => {
    if (selectedEvents.find((e) => e.id === event.id)) {
      setSelectedEvents(selectedEvents.filter((e) => e.id !== event.id));
    } else {
      setSelectedEvents([...selectedEvents, { id: event.id, alreadyRegistered: false }]);
    }
  };

  const groupedEvents = groupEventsByDateAndTime(subEvents);

  const handleSubmit = () => {
    if (eventId && eventRegisterId)
      getSubEventForm(eventId, eventRegisterId, selectedEvents, setSubEventForm, setShowFormModal);
  };

  const onFieldChange = (fieldName: string, fieldValue: string | string[]) => {
    setFormData({ ...formData, [fieldName]: fieldValue });
  };

  const isEventDisabled = (event: SubEventType) => {
    if (event.already_booked) return false;

    return selectedEvents.some((e) => {
      const selectedEvent = subEvents.find((se) => se.id === e.id && event.id !== e.id);
      if (!selectedEvent) return false;

      const eventDate = formatDate(event.start_time);
      const selectedEventDate = formatDate(selectedEvent.start_time);

      if (eventDate === selectedEventDate) console.log(event.title, selectedEvent.title);

      return (
        eventDate === selectedEventDate &&
        new Date(event.start_time) >= new Date(selectedEvent.start_time) &&
        new Date(event.end_time) <= new Date(selectedEvent.end_time)
      );
    });
  };

  return (
    <Theme>
      <RemoveConfirmation
        eventId={eventId}
        eventRegisterId={eventRegisterId}
        setSubEventToRemove={setSubEventToRemove}
        setSelectedEvents={setSelectedEvents}
        setTriggerFetch={setTriggerFetch}
        subEventToRemove={subEventToRemove}
      />

      <DetailedView
        showDetailedView={showDetailedView}
        setShowDetailedView={setShowDetailedView}
        selectedEvents={selectedEvents}
        handleSelectEvent={handleSelectEvent}
      />

     
        <SubEventForm
          subEventForm={subEventForm}
          setSubEventForm={setSubEventForm}
          formErrors={formErrors}
          formData={formData}
          onFieldChange={onFieldChange}
          eventId={eventId}
          eventRegisterId={eventRegisterId}
          selectedEvents={selectedEvents}
          setFormErrors={setFormErrors}
          setTriggerFetch={setTriggerFetch}
          setShowFormModal={setShowFormModal}
          showFormModal={showFormModal}
        />
      
      {!isEventsLoading ? (
        <>
          <div className={styles.subEventsListingContainer}>
            {subEvents &&
              Object.keys(groupedEvents).map((date) => (
                <div key={date}>
                  {/* Display date header */}
                  <p className={styles.dateHeader}>{date}</p>
                  <div className={styles.timeContaianer}>
                    {Object.keys(groupedEvents[date]).map((time) => (
                      <div key={time}>
                        {/* Display time header */}
                        <p className={styles.timeHeader}>{time}</p>
                        <div className={styles.eventsContainer}>
                          {groupedEvents[date][time].map((event) => (
                            <div key={event.id} className={styles.event}>
                              {event.already_booked && (
                                <p className={styles.registedTag}>Registered</p>
                              )}
                              <div>
                                <motion.div
                                  initial={{ opacity: 0, y: 50 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.5 }}
                                  className={`${styles.eventCard} ${
                                    selectedEvents.find((e) => e.id === event.id)
                                      ? styles.selectedCard
                                      : ''
                                  }`}
                                  onClick={() =>
                                    !isEventDisabled(event) && handleSelectEvent(event)
                                  }
                                  style={{
                                    zIndex: 0,
                                    opacity: isEventDisabled(event) ? 0.3 : 1,
                                  }}
                                >
                                  <div className={styles.innerCard}>
                                    <div className={styles.eventDetails}>
                                      <div className={styles.headingTexts}>
                                        <p className={styles.eventTitle}>{event?.title}</p>
                                      </div>

                                      <DatePlace event={event} />

                                      <div className='row'>
                                        {
                                          <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            className={styles.manage}
                                            disabled={isEventDisabled(event)}
                                            onClick={() => {
                                              if (event.already_booked)
                                                setSubEventToRemove(event.id);
                                              else handleSelectEvent(event);
                                            }}
                                          >
                                            {event.already_booked
                                              ? 'Cancel'
                                              : selectedEvents.find((e) => e.id === event.id)
                                                ? 'Deselect'
                                                : 'Select'}
                                          </motion.button>
                                        }
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
                </div>
              ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className={styles.submitButton}
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit
          </motion.button>
        </>
      ) : (
        <div className='center'>
          <HashLoader color={'#46BF75'} size={50} />
        </div>
      )}
    </Theme>
  );
};

export default ListSubEvents;
