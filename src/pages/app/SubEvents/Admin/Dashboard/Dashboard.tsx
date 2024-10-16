import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';

import {
  createNewSubEvent,
  deleteSubEvent,
  editSubEvent,
  getSubEventData,
  listDashboardSubEvents,
} from '../../../../../apis/subevents';
import Editor from '../../../../../components/Editor/Editor';
import EventHeader from '../../../../../components/EventHeader/EventHeader';
import Modal from '../../../../../components/Modal/Modal';
import Theme from '../../../../../components/Theme/Theme';
import InputField from '../../../../auth/Login/InputField';
import type { SubEventListType } from '../../../CheckIns/pages/SubEvent/types';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import DatePlace from '../../components/DatePlace/DatePlace';
import styles from './Dashboard.module.css';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const groupSubEventsByDateAndTime = (subEvents: SubEventListType[]) => {
  return subEvents
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .reduce<Record<string, Record<string, SubEventListType[]>>>(
      (acc, subevent) => {
        const date = formatDate(subevent.start_time);
        const time = formatTime(subevent.start_time);
        if (!acc[date]) {
          acc[date] = {};
        }
        if (!acc[date][time]) {
          acc[date][time] = [];
        }
        acc[date][time].push(subevent);
        return acc;
      },
      {} as Record<string, Record<string, SubEventListType[]>>,
    );
};

const Dashboard = () => {
  const [subEvents, setSubEvents] = useState<SubEventListType[]>([]);
  const [selectedSubEvent, setSelectedSubEvent] = useState<SubEventListType>({
    id: '',
    title: '',
    start_time: '',
    end_time: '',
    place: '',
    description: '',
  });
  const [subEventDescription, setSubEventDescription] = useState<string>('');
  const [currentSelectType, setCurrentSelectType] = useState<string>('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const eventId = JSON.parse(sessionStorage.getItem('eventData')!).event_id;
  useEffect(() => {
    listDashboardSubEvents(eventId, setSubEvents);
  }, [eventId]);

  useEffect(() => {
    if (currentSelectType === 'edit' && selectedSubEvent.id) {
      getSubEventData(eventId, selectedSubEvent.id, setSelectedSubEvent);
    }

    if (currentSelectType === '') {
      setSubEventDescription('');
      setSelectedSubEvent({
        id: '',
        title: '',
        start_time: '',
        end_time: '',
        place: '',
        description: '',
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSelectType]);

  const groupedSubEvents = groupSubEventsByDateAndTime(subEvents);

  // useEffect(() => {
  //   if (subEventDescription) {
  //     setSelectedSubEvent({ ...selectedSubEvent, description: subEventDescription });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [subEventDescription]);

  const handleSubmit = () => {
    if (currentSelectType === 'add') {
      createNewSubEvent(
        eventId,
        selectedSubEvent,
        setSubEvents,
        setCurrentSelectType,
        subEventDescription,
      );
    } else {
      editSubEvent(
        eventId,
        selectedSubEvent,
        setSubEvents,
        setCurrentSelectType,
        subEventDescription,
      );
    }
  };

  const handleDelete = () => {
    if (selectedSubEvent.id) deleteSubEvent(eventId, selectedSubEvent.id, setSubEvents);
  };
  return (
    <>
      <Theme>
        {(currentSelectType == 'add' || currentSelectType == 'edit') && (
          <Modal title='Add Sub Event' type='side' onClose={() => setCurrentSelectType('')}>
            <div className={styles.modalContent}>
              <InputField
                title='Sub Event Title'
                placeholder='Enter the title of the sub event'
                type='text'
                name='subEventTitle'
                id='subEventTitle'
                icon={<></>}
                value={selectedSubEvent.title}
                onChange={(e) => {
                  setSelectedSubEvent({ ...selectedSubEvent, title: e.target.value });
                }}
              />
              <InputField
                title='Sub Event Start Time'
                placeholder='Enter the start time of the sub event'
                type='datetime-local'
                name='subEventStartTime'
                id='subEventStartTime'
                icon={<></>}
                value={selectedSubEvent.start_time}
                onChange={(e) => {
                  setSelectedSubEvent({ ...selectedSubEvent, start_time: e.target.value });
                }}
              />
              <InputField
                title='Sub Event End Time'
                placeholder='Enter the end time of the sub event'
                type='datetime-local'
                name='subEventEndTime'
                id='subEventEndTime'
                icon={<></>}
                value={selectedSubEvent.end_time}
                onChange={(e) => {
                  setSelectedSubEvent({ ...selectedSubEvent, end_time: e.target.value });
                }}
              />
              <InputField
                title='Sub Event Location'
                placeholder='Enter the location of the sub event'
                type='text'
                name='subEventLocation'
                id='subEventLocation'
                icon={<></>}
                value={selectedSubEvent.place}
                onChange={(e) => {
                  setSelectedSubEvent({ ...selectedSubEvent, place: e.target.value });
                }}
              />
              <p className={styles.label}>Sub Event Description</p>
              <div className={styles.subEventDescription}>
                <Editor
                  description={selectedSubEvent?.description ?? ''}
                  setNewDescription={setSubEventDescription}
                />
              </div>

              <button className={styles.submitButton} onClick={handleSubmit}>
                {currentSelectType === 'add' ? 'Add Sub Event' : 'Edit Sub Event'}
              </button>
            </div>
          </Modal>
        )}
        {showDeleteConfirmation && (
          <Modal title='Delete Sub Event' onClose={() => setShowDeleteConfirmation(false)}>
            <div className={styles.modalContent}>
              <p className={styles.deleteConfirmationText}>
                Are you sure you want to delete the sub event?
              </p>
              <div className={styles.deleteConfirmationButtons}>
                <button className={styles.deleteButton} onClick={handleDelete}>
                  Delete
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}
        <div className={styles.mainContainer}>
          <EventHeader previousPageNavigate='-1' />
          <div className={styles.headerRow}>
            <div>
              <p className={styles.subEventHeading}>
                {subEvents.length > 0 ? 'Currently Listed Sub-Events' : 'No Sub Events Available'}
              </p>
              <p className={styles.helperText}>
                {subEvents.length > 0
                  ? 'Select a sub-event to edit details'
                  : 'No sub events available for this event'}
              </p>
            </div>
            <SecondaryButton
              buttonText='Add Sub Event'
              onClick={() => {
                setCurrentSelectType('add');
              }}
            />
          </div>
          <div className={styles.subEvents}>
            {subEvents &&
              subEvents.length > 0 &&
              Object.entries(groupedSubEvents).map(([date, times]) => (
                <div key={date}>
                  <p className={styles.eventDate}>{date}</p>
                  {Object.entries(times).map(([time, events]) => (
                    <div key={time}>
                      <p className={styles.eventTime}>{time}</p>
                      <div className='row'>
                        {events.map((subevent, index) => (
                          <div key={index} className={styles.subevent}>
                            <div className={styles.event}>
                              <div>
                                <div className={styles.eventCard}>
                                  <div className={styles.deleteIcon}>
                                    <MdDelete
                                      color={'#fff'}
                                      size={20}
                                      onClick={() => {
                                        setSelectedSubEvent(subevent);
                                        setShowDeleteConfirmation(true);
                                      }}
                                    />
                                  </div>
                                  <div className={styles.innerCard}>
                                    <div className={styles.eventDetails}>
                                      <div className={styles.headingTexts}>
                                        <p className={styles.eventTitle}>{subevent?.title}</p>
                                      </div>

                                      <DatePlace event={subevent} />

                                      <div className='row'>
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          className={styles.cardPrimaryButton}
                                          onClick={() => {
                                            setSelectedSubEvent(subevent);
                                            setCurrentSelectType('edit');
                                          }}
                                        >
                                          Edit
                                        </motion.button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </Theme>
    </>
  );
};

export default Dashboard;
