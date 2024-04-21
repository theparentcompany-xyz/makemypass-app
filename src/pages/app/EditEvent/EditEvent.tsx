import styles from './EditEvent.module.css';
import Theme from '../../../components/Theme/Theme';
import { GrLocation } from 'react-icons/gr';
import { getEvent } from '../../../apis/events';
import { TbUserCheck } from 'react-icons/tb';
import { BiArrowToTop } from 'react-icons/bi';
import { LuPencil } from 'react-icons/lu';
import { FiGlobe } from 'react-icons/fi';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/globalContext';
import FourNotFour from '../../FourNotFour/FourNotFour';
import { HashLoader } from 'react-spinners';
import { EventType } from '../../../apis/types';

const CreateEvent = () => {
  const { eventId, hasEvent } = useContext(GlobalContext);
  const [eventTitle, setEventTitle] = useState('');
  const [eventData, setEventData] = useState<EventType>();
  const [selectedColor, setSelectedColor] = useState('#00753B');

  useEffect(() => {
    if (eventId) getEvent(eventId, setEventTitle, setEventData);
  }, [eventId]);

  // const submitEditEvent = () => {
  //   getEvent(eventId);
  // };

  return (
    <>
      {hasEvent ? (
        <Theme>
          {eventData ? (
            <div className={styles.createEventContainer}>
              <div className={styles.rightSideContainer}>
                <div className={styles.bannerContainer}>
                  {eventData?.banner ? (
                    <img src={eventData?.banner} alt='' className={styles.banner} />
                  ) : (
                    <svg height='250' width='100%' className={styles.banner}>
                      {eventTitle && (
                        <>
                          <rect
                            width='100%'
                            height='100%'
                            fill={selectedColor}
                            className={styles.banner}
                          />
                          <text x='40%' y='70%' fill='white' className={styles.svgText}>
                            {eventTitle[0]?.toUpperCase()}
                          </text>
                        </>
                      )}
                    </svg>
                  )}
                </div>
                <div className={styles.descriptionContainer}>
                  <p className={styles.eventHeading}>About Event</p>
                  <p
                    className={styles.description}
                    dangerouslySetInnerHTML={{ __html: eventData?.description || '' }}
                  ></p>
                </div>
              </div>

              <div className={styles.leftSideContainer}>
                <div className={styles.container}>
                  <textarea
                    placeholder='Event Name'
                    className={styles.inputEventName}
                    onChange={(e) => setEventTitle(e.target.value)}
                    value={eventTitle}
                  />
                  <div className={styles.timezoneContainer}>
                    <div className={styles.dateTimeContainer}>
                      <div>
                        <label>Start</label>
                        <input type='datetime-local' className={styles.dateInput} />
                      </div>
                      <div>
                        <label>End</label>
                        <input type='datetime-local' className={styles.dateInput} />
                      </div>
                    </div>
                    <span className={styles.timezone}>
                      <FiGlobe size={20} color='#949597' />
                      <br />
                      GMT+04:00 <br /> Dubai
                    </span>
                  </div>
                  <div className={styles.eventLocation}>
                    <GrLocation size={20} color='#949597' />
                    <div>
                      <input
                        type='text'
                        placeholder='Add Event Location'
                        className={styles.inputLocation}
                      />
                      <p className={styles.subText}>Offline location or virtual link</p>
                    </div>
                  </div>
                  <p className={styles.eventOptions}>Event Options</p>
                  <div className={styles.optionsContainer}>
                    <div className={styles.option}>
                      <label>
                        <TbUserCheck size={20} color='#949597' /> Require Approval
                      </label>
                      <input type='checkbox' />
                    </div>
                    <div className={styles.option}>
                      <label>
                        {' '}
                        <BiArrowToTop size={20} color='#949597' />
                        Capacity
                      </label>
                      <div>
                        <input
                          type='number'
                          className={styles.capcityInput}
                          placeholder='Unlimited'
                        />
                        <LuPencil size={15} color='#949597' />
                      </div>
                    </div>
                  </div>
                  <div className={styles.backgroundOption}>
                    <input
                      type='color'
                      className={styles.backgroundColorInput}
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                    />
                    <label>Background Color</label>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.center}>
              <HashLoader color={'#46BF75'} size={50} />
            </div>
          )}
        </Theme>
      ) : (
        <FourNotFour />
      )}
    </>
  );
};

export default CreateEvent;
