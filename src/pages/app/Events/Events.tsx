import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BsArrowRight, BsThreeDots } from 'react-icons/bs';
import { GoPeople } from 'react-icons/go';
import { useNavigate } from 'react-router';

import { Roles } from '../../../../services/enums';
import { createDuplicateEvent, getEventsList, setEventInfoLocal } from '../../../apis/events';
import { Event } from '../../../apis/types';
import { formatDate } from '../../../common/commonFunctions';
import Loader from '../../../components/Loader';
import Modal from '../../../components/Modal/Modal';
import Theme from '../../../components/Theme/Theme';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import styles from './Events.module.css';
import RightClickMenu from './RightClickMenu';

const Events = () => {
  interface Position {
    x: number;
    y: number;
  }

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<Position>({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState(false);
  const [duplicateEventId, setDuplicateEventId] = useState<string>('');
  const handleButtonClick = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    setDuplicateEventId(event.currentTarget.id);
    setIsMenuOpen(true);
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  enum EventStatus {
    Published = 'Published',
    Draft = 'Draft',
    Completed = 'Completed',
  }

  const [events, setEvents] = useState([] as Event[]);

  useEffect(() => {
    getEventsList(setEvents, setIsDataLoaded);
  }, []);

  const navigate = useNavigate();

  const handleClick = (eventName: string) => {
    setEventInfoLocal(eventName).then((eventData) => {
      if (
        eventData.current_user_role === Roles.ADMIN ||
        eventData.current_user_role === Roles.OWNER
      ) {
        navigate(`/${eventName}/overview/`);
      } else if (eventData.current_user_role === Roles.VOLUNTEER) {
        navigate(`/${eventName}/checkins/`);
      }
    });
  };

  const onModalClose = () => {
    setShowModal(false);
  };

  return (
    <>
      {isDataLoaded ? (
        <Theme>
          {showModal && (
            <Modal onClose={onModalClose}>
              <p className={styles.modalHeader}>Create Duplicate</p>
              <p className={styles.modalSubText}>
                Are you sure you want to create a duplicate event ?
              </p>
              <div className={styles.buttons}>
                <p
                  onClick={() => {
                    createDuplicateEvent(duplicateEventId);
                    setShowModal(false);
                  }}
                  className={styles.button}
                >
                  Create Duplicate
                </p>
                <p
                  onClick={() => {
                    setShowModal(false);
                  }}
                  className={styles.button}
                >
                  Cancel
                </p>
              </div>
            </Modal>
          )}
          {Object.values(events).length === 0 && isDataLoaded && (
            <div className={styles.noEventsContainer}>
              <p className={styles.noEvents}>
                You don't have any events yet. Please connect with our sales team to get started.
              </p>
              <SecondaryButton
                buttonText='Contact Sales'
                onClick={() => {
                  window.open('https://wa.me/916238450178', '_blank');
                }}
              />
            </div>
          )}
          <div className={styles.homeContainer}>
            {Object.values(EventStatus).map((status) => {
              return (
                <div>
                  <motion.p
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={styles.homeHeader}
                  >
                    {events.filter((event) => event.status == status).length > 0
                      ? `${status} Events (${events.filter((event) => event.status == status).length})`
                      : ''}
                  </motion.p>
                  <div className={styles.eventsContainer}>
                    {events
                      .filter((event) => event.status == status)
                      .map((event) => (
                        <div key={event.id} className={styles.event}>
                          <div>
                            <motion.div
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                              className={styles.eventCard}
                              onClick={() => {
                                handleClick(event.name);
                              }}
                              style={{
                                zIndex: 0,
                              }}
                            >
                              <div className={styles.innerCard}>
                                {event.logo ? (
                                  <motion.img
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    src={event.logo}
                                    alt='event logo depicting event information'
                                    className={styles.eventImage}
                                  />
                                ) : (
                                  <div className={styles.eventImage}>
                                    {event.title.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className={styles.eventDetails}>
                                  <div className={styles.eventDetailsHeader}>
                                    <div>
                                      <motion.div className={styles.eventDate}>
                                        <p className={styles.date}>
                                          {formatDate(event?.event_start_date)}
                                        </p>
                                      </motion.div>
                                      <p className={styles.eventName}>
                                        {event.title.substring(0, 40)}
                                        {event.title.length > 40 ? '...' : ''}
                                      </p>
                                    </div>
                                    {import.meta.env.VITE_CURRENT_ENV === 'dev' && (
                                      <div className={styles.rightMenuButton}>
                                        <BsThreeDots
                                          onClick={(
                                            e: React.MouseEvent<SVGElement, MouseEvent>,
                                          ) => {
                                            handleButtonClick(e);
                                            setDuplicateEventId(event?.id);
                                          }}
                                          size={15}
                                          color='#ffffff'
                                          className='pointer'
                                          style={{
                                            zIndex: 10,
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  {isMenuOpen && (
                                    <RightClickMenu
                                      isOpen={isMenuOpen}
                                      position={menuPosition}
                                      onClose={handleMenuClose}
                                      setShowModal={setShowModal}
                                    />
                                  )}
                                  <p className={styles.eventGuests}>
                                    <span>
                                      <GoPeople color='a4a4a4' />
                                    </span>
                                    {event.members} guests
                                  </p>

                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className={styles.manage}
                                    onClick={() => {
                                      handleClick(event.name);
                                    }}
                                  >
                                    Manage
                                    <BsArrowRight size={15} />
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Theme>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Events;
