import { motion } from 'framer-motion';
import { Dispatch, SetStateAction } from 'react';
import { IoLocationOutline } from 'react-icons/io5';

import { SubEventType } from '../../../../../../apis/types';
import Modal from '../../../../../../components/Modal/Modal';
import { getDay, getMonthAbbreviation } from '../../../../EventPage/constants';
import styles from '../../../User/ListSubEvents.module.css';
import type  { SelectedSubEventsType } from '../../../User/types';

const DetailedView = ({
  showDetailedView,
  setShowDetailedView,
  selectedEvents,
  handleSelectEvent,
}: {
  showDetailedView: SubEventType | null;
  setShowDetailedView: Dispatch<SetStateAction<SubEventType | null>>;
  selectedEvents: SelectedSubEventsType[];
  handleSelectEvent: (event: SubEventType) => void;
}) => {
  if (!showDetailedView) return null;
  return (
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
                      <p className={styles.eventDateNum}>{getDay(showDetailedView?.start_time)}</p>
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
              {selectedEvents.find((e) => e.id === showDetailedView.id) ? 'Deselect' : 'Select'}
            </motion.button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DetailedView;
