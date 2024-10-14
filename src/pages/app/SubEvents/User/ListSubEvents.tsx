import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router';
import { HashLoader } from 'react-spinners';

import { getEventId } from '../../../../apis/events';
import { getSubEventForm, getSubEvents, subEventRegister } from '../../../../apis/subevents';
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
  const [selectedEventsIds, setSelectedEventsIds] = useState<SelectedSubEventsType[]>([]);
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
    if (!selectedEventsIds) {
      const preSelectedEvents = subEvents
        .filter((event) => event.already_booked)
        .map((event) => ({ id: event.id, alreadyRegistered: true }));

      setSelectedEventsIds(preSelectedEvents);
    }
  }, [subEvents]);

  const handleSelectEvent = (event: SubEventType) => {
    if (selectedEventsIds.find((e) => e.id === event.id)) {
      setSelectedEventsIds(selectedEventsIds.filter((e) => e.id !== event.id));
    } else {
      setSelectedEventsIds([...selectedEventsIds, { id: event.id, alreadyRegistered: false }]);
    }
  };

  const groupedEvents = groupEventsByDateAndTime(subEvents);

  const handleSubmit = () => {
    if (eventId && eventRegisterId)
      getSubEventForm(eventId, eventRegisterId, selectedEventsIds)
        .then((form) => {
          if (form.length !== 0) {
            setSubEventForm(form);
            setShowFormModal(true);
          } else {
            subEventRegister(
              eventId,
              eventRegisterId,
              formData,
              selectedEventsIds,
              setFormErrors,
              setTriggerFetch,
            );
          }
        })
        .catch(() => {
          toast.error('Unable to process the request');
        });
  };

  const onFieldChange = (fieldName: string, fieldValue: string | string[]) => {
    setFormData({ ...formData, [fieldName]: fieldValue });
  };

  const findConflictingEvent = (event: SubEventType) => {
    const eventStartTime = new Date(event.start_time);
    const eventEndTime = new Date(event.end_time);

    const conflictingEvent = selectedEventsIds.find((selectedEvent) => {
      const selectedEventStartTime = new Date(
        subEvents.find((e) => e.id === selectedEvent.id)?.start_time || '',
      );
      const selectedEventEndTime = new Date(
        subEvents.find((e) => e.id === selectedEvent.id)?.end_time || '',
      );

      if (event.id === selectedEvent.id || !selectedEventStartTime || !selectedEventEndTime) {
        return false;
      }

      return (
        (eventStartTime <= selectedEventStartTime && eventEndTime > selectedEventStartTime) ||
        (selectedEventStartTime <= eventStartTime && selectedEventEndTime > eventStartTime)
      );
    });

    return subEvents.find((e) => e.id === conflictingEvent?.id)?.title;
  };

  useEffect(() => {
    setSubEvents((prev) => {
      return prev.map((subEvent) => {
        const conflictingEventName = findConflictingEvent(subEvent);

        if (conflictingEventName) {
          subEvent.conflicting_event = conflictingEventName;
        }

        return subEvent;
      });
    });
  }, [selectedEventsIds]);

  return (
    <Theme>
      <RemoveConfirmation
        eventId={eventId}
        eventRegisterId={eventRegisterId}
        setSubEventToRemove={setSubEventToRemove}
        setSelectedEvents={setSelectedEventsIds}
        setTriggerFetch={setTriggerFetch}
        subEventToRemove={subEventToRemove}
      />

      <DetailedView
        showDetailedView={showDetailedView}
        setShowDetailedView={setShowDetailedView}
        selectedEvents={selectedEventsIds}
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
        selectedEvents={selectedEventsIds}
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
                        <p className={styles.timeHeader}>Events @ {time}</p>
                        <div className={styles.eventsContainer}>
                          {groupedEvents[date][time].map((event) => (
                            <>
                              <div key={event.id} className={styles.event}>
                                {event.already_booked && (
                                  <p className={styles.registedTag}>Registered</p>
                                )}
                                <div>
                                  <div
                                    className={`${styles.eventCard} ${
                                      selectedEventsIds.find(
                                        (e) => e.id === event.id && !event.already_booked,
                                      )
                                        ? styles.selectedCard
                                        : event.conflicting_event && styles.disabledCard
                                    }`}
                                    onClick={() =>
                                      !event.conflicting_event && handleSelectEvent(event)
                                    }
                                  >
                                    <div className={styles.innerCard}>
                                      <div className={styles.eventDetails}>
                                        <div className={styles.headingTexts}>
                                          <p className={styles.eventTitle}>{event?.title}</p>
                                        </div>

                                        <DatePlace event={event} />

                                        <div className='row'>
                                          {!event.conflicting_event && (
                                            <motion.button
                                              whileHover={{ scale: 1.05 }}
                                              className={styles.cardPrimaryButton}
                                              onClick={() => {
                                                if (event.already_booked)
                                                  setSubEventToRemove(event.id);
                                                else handleSelectEvent(event);
                                              }}
                                            >
                                              {event.already_booked
                                                ? 'Withdraw'
                                                : selectedEventsIds.find((e) => e.id === event.id)
                                                  ? 'Deselect'
                                                  : 'Select'}
                                            </motion.button>
                                          )}
                                          <motion.button
                                            onClick={() => setShowDetailedView(event)}
                                            className={styles.manage}
                                          >
                                            View More
                                          </motion.button>
                                        </div>

                                        {event.conflicting_event && (
                                          <p className={styles.conflictingMessage}>
                                            Kindly unselect {event.conflicting_event}, to register.
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
          <div className={styles.stickButtonContainer}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className={styles.submitButton}
              onClick={() => {
                handleSubmit();
              }}
            >
              Submit
            </motion.button>
          </div>
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
