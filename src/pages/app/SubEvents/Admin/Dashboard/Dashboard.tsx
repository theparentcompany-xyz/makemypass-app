import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router';

import {
  createNewSubEvent,
  deleteSubEvent,
  editSubEvent,
  getSubEventData,
  listDashboardSubEvents,
} from '../../../../../apis/subevents';
import { isUserEditor } from '../../../../../common/commonFunctions';
import Editor from '../../../../../components/Editor/Editor';
import EventHeader from '../../../../../components/EventHeader/EventHeader';
import Modal from '../../../../../components/Modal/Modal';
import Slider from '../../../../../components/SliderButton/Slider';
import Theme from '../../../../../components/Theme/Theme';
import InputField from '../../../../auth/Login/InputField';
import type { SubEventListType } from '../../../CheckIns/pages/SubEvent/types';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import DatePlace from '../../components/DatePlace/DatePlace';
import styles from './Dashboard.module.css';
import type { SubEventCRUDType } from './types';

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
        const date = subevent.start_time ? formatDate(subevent.start_time) : 'No Specific Date';
        const time = subevent.start_time ? formatTime(subevent.start_time) : 'No Specific Time';
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
  const [selectedSubEvent, setSelectedSubEvent] = useState<SubEventCRUDType>({
    id: '',
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    place: '',
    location: '',
    price: 0,
    currency: '',
    platform_fee: 0,
    gateway_fee: 0,
    capacity: null,
    approval_required: false,
    active: false,
  });
  const [selectedSubEventId, setSelectedSubEventId] = useState<string>('');
  const [subEventDescription, setSubEventDescription] = useState<string>('');
  const [currentSelectType, setCurrentSelectType] = useState<string>('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [limitCapacity, setLimitCapacity] = useState<boolean>(false);
  const eventId = JSON.parse(sessionStorage.getItem('eventData')!).event_id;
  useEffect(() => {
    listDashboardSubEvents(eventId, setSubEvents);
  }, [eventId]);

  useEffect(() => {
    if (selectedSubEventId)
      if (currentSelectType === 'edit' && selectedSubEventId) {
        getSubEventData(eventId, selectedSubEventId, setSelectedSubEvent, setLimitCapacity);
      }

    if (currentSelectType === '') {
      setSubEventDescription('');
      setSelectedSubEvent({
        id: '',
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        place: '',
        location: '',
        price: 0,
        currency: '',
        platform_fee: 0,
        gateway_fee: 0,
        capacity: null,
        approval_required: false,
        active: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSelectType]);

  const groupedSubEvents = groupSubEventsByDateAndTime(subEvents);

  const handleSubmit = () => {
    if (currentSelectType === 'add') {
      createNewSubEvent(
        eventId,
        selectedSubEvent,
        setSubEvents,
        setCurrentSelectType,
        subEventDescription,
      ).then(() => {
        setTimeout(() => {
          listDashboardSubEvents(eventId, setSubEvents);
        }, 1000);
      });
    } else {
      console.log(selectedSubEvent);
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
    if (selectedSubEvent && selectedSubEvent.id)
      deleteSubEvent(eventId, selectedSubEvent.id, setSubEvents);
  };

  const navigate = useNavigate();

  return (
    <>
      <Theme>
        {(currentSelectType == 'add' || currentSelectType == 'edit') && (
          <Modal
            title={currentSelectType === 'edit' ? 'Edit Sub Event' : 'Add Sub Event'}
            type='side'
            onClose={() => setCurrentSelectType('')}
          >
            <div className={styles.modalContent}>
              <InputField
                title='Sub Event Title'
                placeholder='Enter the title of the sub event'
                type='text'
                name='subEventTitle'
                id='subEventTitle'
                icon={<></>}
                value={selectedSubEvent?.title}
                onChange={(e) => {
                  setSelectedSubEvent((prev) => {
                    return {
                      ...prev,
                      title: e.target.value,
                    };
                  });
                }}
              />
              <InputField
                title='Sub Event Start Time'
                placeholder='Enter the start time of the sub event'
                type='datetime-local'
                name='subEventStartTime'
                id='subEventStartTime'
                icon={<></>}
                value={selectedSubEvent?.start_time}
                onChange={(e) => {
                  setSelectedSubEvent((prev) => {
                    return {
                      ...prev,
                      start_time: e.target.value,
                    };
                  });
                }}
              />
              <InputField
                title='Sub Event End Time'
                placeholder='Enter the end time of the sub event'
                type='datetime-local'
                name='subEventEndTime'
                id='subEventEndTime'
                icon={<></>}
                value={selectedSubEvent?.end_time}
                onChange={(e) => {
                  setSelectedSubEvent((prev) => {
                    return {
                      ...prev,
                      end_time: e.target.value,
                    };
                  });
                }}
              />
              <InputField
                title='Sub Event Location'
                placeholder='Enter the location of the sub event'
                type='text'
                name='subEventLocation'
                id='subEventLocation'
                icon={<></>}
                value={selectedSubEvent?.place}
                onChange={(e) => {
                  setSelectedSubEvent((prev) => {
                    return {
                      ...prev,
                      place: e.target.value,
                    };
                  });
                }}
              />

              <p className={styles.label}>Sub Event Description</p>
              <div className={styles.subEventDescription}>
                <Editor
                  description={selectedSubEvent?.description ?? ''}
                  setNewDescription={setSubEventDescription}
                />
              </div>

              <div className={styles.ticketSlider}>
                <p className={styles.ticketSliderLabel}>Limit Capacity</p>
                <Slider
                  checked={selectedSubEvent?.capacity != null && limitCapacity}
                  onChange={() => {
                    setLimitCapacity(!limitCapacity);
                    setSelectedSubEvent((prev) => {
                      return {
                        ...prev,
                        capacity: limitCapacity ? null : 0,
                      };
                    });
                  }}
                  size='medium'
                />
              </div>

              {selectedSubEvent?.capacity != null && limitCapacity && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={styles.ticketSlider}
                >
                  <div className={styles.ticketCapacityContainer}>
                    <label className={styles.ticketCapacityLabel}>Capacity</label>
                    <input
                      type='text'
                      placeholder='Unlimited'
                      disabled={!isUserEditor()}
                      value={selectedSubEvent?.capacity}
                      onChange={(e) => {
                        if (isNaN(Number(e.target.value))) {
                          return;
                        }

                        if (Number(e.target.value) < 0) {
                          return;
                        }
                        console.log(e.target.value);
                        console.log(Number(e.target.value));

                        setSelectedSubEvent((prev) => {
                          return {
                            ...prev,
                            capacity: Number(e.target.value),
                          };
                        });
                      }}
                      className={styles.ticketCapacityInput}
                    />
                  </div>
                </motion.div>
              )}

              <div className={styles.ticketSlider}>
                <p className={styles.ticketSliderLabel}>Approval Required</p>
                <Slider
                  checked={selectedSubEvent?.approval_required}
                  onChange={() => {
                    setSelectedSubEvent({
                      ...selectedSubEvent,
                      approval_required: !selectedSubEvent.approval_required,
                    });
                  }}
                  size='medium'
                />
              </div>

              <div className={styles.ticketSlider}>
                <p className={styles.ticketSliderLabel}>Active</p>
                <Slider
                  checked={selectedSubEvent?.active}
                  onChange={() => {
                    setSelectedSubEvent({
                      ...selectedSubEvent,
                      active: !selectedSubEvent.active,
                    });
                  }}
                  size='medium'
                />
              </div>
              <br />
              <button className={styles.submitButton} onClick={handleSubmit}>
                {currentSelectType === 'edit' ? 'Edit Sub Event' : 'Add Sub Event'}
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
                      <div
                        className='row'
                        style={{
                          alignItems: 'flex-start',
                        }}
                      >
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
                                        if (subevent.id) {
                                          setSelectedSubEventId(subevent.id);
                                          setShowDeleteConfirmation(true);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div className={styles.innerCard}>
                                    <div className={styles.eventDetails}>
                                      <div className={styles.headingTexts}>
                                        <p className={styles.eventTitle}>
                                          {subevent?.title.length > 50
                                            ? `${subevent.title.substring(0, 50)}...`
                                            : subevent.title}
                                        </p>
                                      </div>

                                      <DatePlace event={subevent} />

                                      <div
                                        className='row'
                                        style={{
                                          justifyContent: 'flex-end',
                                          alignItems: 'flex-end',
                                        }}
                                      >
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          className={styles.cardSecondaryButton}
                                          onClick={(e) => {
                                            if (subevent.id) {
                                              e.stopPropagation();
                                              setSelectedSubEventId(subevent.id);
                                              setCurrentSelectType('edit');
                                            }
                                          }}
                                        >
                                          Edit
                                        </motion.button>
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          className={styles.cardPrimaryButton}
                                          onClick={() => {
                                            navigate(`${subevent.id}`, { state: { subevent } });
                                          }}
                                        >
                                          View Guests
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
