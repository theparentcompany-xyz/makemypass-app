import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router';
import { HashLoader } from 'react-spinners';

import { getEventId } from '../../../../apis/events';
import { getSubEventForm, getSubEvents, subEventRegister } from '../../../../apis/subevents';
import { FormFieldType, SubEventType } from '../../../../apis/types';
import Theme from '../../../../components/Theme/Theme';
import DetailedView from '../components/Modals/DetailedView/DetailedView';
import RemoveConfirmation from '../components/Modals/RemoveConfirmation/RemoveConfirmation';
import SubEventForm from '../components/Modals/SubEventForm/SubEventForm';
import SubEventListing from '../components/SubEventListing/SubEventListing';
import styles from './ListSubEvents.module.css';
import type { SelectedSubEventsType } from './types';

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
      getSubEvents(eventId, eventRegisterId, setIsEventsLoading).then((subEvents) => {
        const preSelectedEvents = subEvents
          .filter((event) => event.already_booked)
          .map((event) => ({ id: event.id, alreadyRegistered: true }));

        setSubEvents(subEvents);
        console.log(preSelectedEvents);

        setSelectedEventsIds(preSelectedEvents);

        // Further logic if needed after sub-events are loaded
      });
    }
  }, [eventId, eventRegisterId, triggerFetch]);

  const handleSelectEvent = (event: SubEventType) => {
    if (selectedEventsIds.find((e) => e.id === event.id)) {
      setSelectedEventsIds(selectedEventsIds.filter((e) => e.id !== event.id));
    } else {
      setSelectedEventsIds([...selectedEventsIds, { id: event.id, alreadyRegistered: false }]);
    }
  };

  const handleSubmit = () => {
    if (!selectedEventsIds.some((event) => event.alreadyRegistered)) {
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
    } else toast.error('Please select at least one event to register');
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
        } else {
          subEvent.conflicting_event = undefined;
        }
        return subEvent;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      <DetailedView showDetailedView={showDetailedView} setShowDetailedView={setShowDetailedView} />

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
          {subEvents.length > 0 ? (
            <div className={styles.stickButtonContainer}>
              <SubEventListing
                subEvents={subEvents}
                selectedEventsIds={selectedEventsIds}
                handleSelectEvent={handleSelectEvent}
                setShowDetailedView={setShowDetailedView}
                setSubEventToRemove={setSubEventToRemove}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                className={styles.confirmButton}
                onClick={() => {
                  handleSubmit();
                }}
              >
                Submit
              </motion.button>
            </div>
          ) : (
            <div className='center'>
              <p className={styles.alertMessage}>
                No sub events available for this user/event. Please check back later or contact the
                event organizers.
              </p>
            </div>
          )}
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
