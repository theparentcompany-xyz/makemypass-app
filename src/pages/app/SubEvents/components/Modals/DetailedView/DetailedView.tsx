import { Dispatch, SetStateAction } from 'react';
import { IoLocationOutline } from 'react-icons/io5';

import { SubEventType } from '../../../../../../apis/types';
import Modal from '../../../../../../components/Modal/Modal';
import { getDay, getMonthAbbreviation } from '../../../../EventPage/constants';
import styles from './DetailedView.module.css';

const DetailedView = ({
  showDetailedView,
  setShowDetailedView,

}: {
  showDetailedView: SubEventType | null;
  setShowDetailedView: Dispatch<SetStateAction<SubEventType | null>>;

}) => {
  if (!showDetailedView) return null;
  return (
    <Modal title={showDetailedView.title} onClose={() => setShowDetailedView(null)} type='side'>
      <div className={styles.detailedView}>
        <div className={styles.eventDetails}>
          <div className={styles.headingTexts}>
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
              <p className={styles.eventDescriptionHeader}>About the Event</p>
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

        
        </div>
      </div>
    </Modal>
  );
};

export default DetailedView;
