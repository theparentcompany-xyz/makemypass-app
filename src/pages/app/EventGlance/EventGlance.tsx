import Theme from '../../../components/Theme/Theme';

import styles from './EventGlance.module.css';
import Glance from '../../../components/Glance/Glance';
import { IoLocationOutline } from 'react-icons/io5';
import { HiUserGroup } from 'react-icons/hi2';
import { FaWrench } from 'react-icons/fa6';
import { BsQrCodeScan } from 'react-icons/bs';
import SectionButton from '../../../components/SectionButton/SectionButton';
// import { LuClock, LuPencil } from 'react-icons/lu';
import { useContext, useEffect, useState } from 'react';
import Modal from '../../../components/Modal/Modal';
import Select from 'react-select';
import { MultiValue } from 'react-select';
import { customStyles, getDay, getMonthAbbreviation } from '../EventPage/constants';
import { GlobalContext } from '../../../contexts/globalContext';
import { EventType } from '../../../apis/types';
import { getEvent } from '../../../apis/events';
import FourNotFour from '../../FourNotFour/FourNotFour';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import EventHeader from '../../../components/EventHeader/EventHeader';
//import { HashLoader } from 'react-spinners';

const EventGlance = () => {
  const { eventId, hasEvent } = useContext(GlobalContext);
  const [eventTitle, setEventTitle] = useState('');
  const [eventData, setEventData] = useState<EventType>();
  useEffect(() => {
    if (eventId) getEvent(eventId, setEventTitle, setEventData);
  }, [eventId]);
  const [selectedMail, setSelectedMail] = useState('');

  const eventName = localStorage.getItem('eventName');

  const selectValues = [
    { value: 'Going', label: 'Going' },
    { value: 'Invited', label: 'Invited' },
    { value: 'Maybe', label: 'Maybe' },
    { value: 'Not Going', label: 'Not Going' },
  ];
  const [selectedMulti, setSelectedMulti] = useState<MultiValue<{ value: string }>>([]);

  return (
    <>
      {hasEvent ? (
        <Theme>
          <EventHeader />
          <div className={styles.eventGlanceContainer}>
            <div className={styles.glanceContainer}>
              <Glance tab='manage' />
            </div>
            {selectedMail && (
              <Modal onClose={() => setSelectedMail('')}>
                <div className={styles.modalHeader}>Update Reminder Email</div>
                <div className={styles.modalSubText}>
                  <div className={styles.inputContainers}>
                    <div className={styles.inputContainer}>
                      <p className={styles.inputLabel}>When should the reminder go out?</p>
                      <input
                        type='datetime-local'
                        placeholder='Enter Email'
                        className={styles.input}
                      />
                      <p className={styles.inputSubText}>X hours before the event</p>
                    </div>

                    <div className={styles.inputContainer}>
                      <p className={styles.inputLabel}>Send to guests who are:</p>

                      <Select
                        isMulti
                        styles={customStyles}
                        name='colors'
                        value={selectedMulti}
                        options={selectValues.filter((elem) => !(elem.value in selectedMulti))}
                        className={styles['basic-multi-select']}
                        classNamePrefix='select'
                        onChange={(selectedOption: MultiValue<{ value: string }>) => {
                          setSelectedMulti(selectedOption);
                        }}
                      />
                    </div>
                    <div className={styles.inputContainer}>
                      <p className={styles.inputLabel}>Subject</p>
                      <input type='text' placeholder='Enter Subject' className={styles.input} />
                    </div>

                    <div className={styles.inputContainer}>
                      <p className={styles.inputLabel}>Body</p>

                      <textarea placeholder='Enter Email Body' className={styles.textarea} />
                    </div>
                  </div>
                </div>

                <div className={styles.buttonContainer}>
                  <button className={styles.button}>Update Reminder</button>
                  <button className={styles.button}>Send Now</button>
                  <button className={styles.button} onClick={() => setSelectedMail('')}>
                    Cancel
                  </button>
                </div>
              </Modal>
            )}
            <div className={styles.eventGlance}>
              <div className={styles.bannerContainer}>
                {eventData?.banner ? (
                  <img src={eventData?.banner} alt='' className={styles.banner} />
                ) : (
                  <svg height='250' width='100%' className={styles.banner}>
                    {eventTitle && (
                      <>
                        <rect width='100%' height='100%' fill='#00753B' className={styles.banner} />
                        <text x='40%' y='70%' fill='white' className={styles.svgText}>
                          {eventTitle[0]?.toUpperCase()}
                        </text>
                      </>
                    )}
                  </svg>
                )}

                <div>
                  <div className={styles.headingTexts}>
                    <p className={styles.eventTitle}>{eventData?.title}</p>
                    <p className={styles.hostedByText}>{}</p>
                  </div>

                  <div className={styles.eventDatePlace}>
                    <div className={styles.eventDate}>
                      <div className={styles.dateBox}>
                        <p className={styles.eventMonth}>
                          {getMonthAbbreviation(eventData?.start_date ?? '')}
                        </p>
                        <p className={styles.eventDateNum}>{getDay(eventData?.start_date ?? '')}</p>
                      </div>
                      <div className={styles.eventDateTimeText}>
                        <p className={styles.eventDateText}>{eventData?.start_date ?? ''}</p>
                        <p className={styles.eventTimeText}>
                          {eventData?.start_time} - {eventData?.end_time}
                          {', '}
                          {eventData?.end_date.substring(eventData?.end_date.indexOf(',') + 1)}
                        </p>
                      </div>
                    </div>
                    <div className={styles.eventPlace}>
                      <div className={styles.locationBox}>
                        <IoLocationOutline size={25} className={styles.locationIcon} />
                      </div>
                      <div className={styles.eventDateTimeText}>
                        <p className={styles.eventDateText}>{eventData?.place}</p>
                      </div>
                    </div>
                    <div className={styles.buttons}>
                      <button
                        onClick={() => {
                          const eventLink = `https://makemypass.com/${eventName}`;
                          navigator.clipboard.writeText(eventLink);
                          toast.success('Event link copied to clipboard');
                        }}
                        className={styles.shareEventButton}
                      >
                        Share Event
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.sectionButtons}>
                <Link to={`/${eventName}/guests`}>
                  <SectionButton
                    buttonText='Guest List'
                    buttonColor='#7662FC'
                    icon={<HiUserGroup size={25} color='#7662FC' />}
                  />
                </Link>

                <Link to={`/${eventName}/overview/#hosts`}>
                  <SectionButton
                    buttonText='Host List'
                    buttonColor='#C33D7B'
                    icon={<FaWrench size={25} color='#C33D7B' />}
                  />
                </Link>

                <Link to={`/${eventName}/checkins/`}>
                  <SectionButton
                    buttonText='Check In'
                    buttonColor='#5B75FB'
                    icon={<BsQrCodeScan size={25} color='#5B75FB' />}
                  />
                </Link>
              </div>

              {/* <div className={styles.sendMailsContainer}>
                <div className={styles.sendMailsText}>
                  <p className={styles.sendMailsHeading}>Send Mails</p>
                  <p className={styles.sendMailsSubHeading}>Send Mails to participants </p>
                </div>
                <div className={styles.scheduleContainer}>
                  <div className={styles.scheduleBox}>
                    <div className='row'>
                      <LuClock color='#939597' size={20} className={styles.scheduleIcon} />
                      <div className={styles.scheduleText}>
                        <p className={styles.scheduleHeading}>⏰ Final is starting tomorrow</p>
                        <p className={styles.scheduleSubHeading}>
                          To: Going · <span>Scheduled: Apr 9, 11:00 PM</span>
                        </p>
                      </div>
                    </div>
                    <LuPencil
                      color='#939597'
                      size={20}
                      className={styles.scheduleIcon}
                      onClick={() => {
                        setSelectedMail('assas');
                      }}
                    />
                  </div>
                  <div className={styles.scheduleBox}>
                    <div className='row'>
                      <LuClock color='#939597' size={20} className={styles.scheduleIcon} />
                      <div className={styles.scheduleText}>
                        <p className={styles.scheduleHeading}>⏰ Final is starting tomorrow</p>
                        <p className={styles.scheduleSubHeading}>
                          To: Going · <span>Scheduled: Apr 9, 11:00 PM</span>
                        </p>
                      </div>
                    </div>
                    <LuPencil color='#939597' size={20} className={styles.scheduleIcon} />
                  </div>
                  <div className={styles.scheduleBox}>
                    <div className='row'>
                      <LuClock color='#939597' size={20} className={styles.scheduleIcon} />
                      <div className={styles.scheduleText}>
                        <p className={styles.scheduleHeading}>⏰ Final is starting tomorrow</p>
                        <p className={styles.scheduleSubHeading}>
                          To: Going · <span>Scheduled: Apr 9, 11:00 PM</span>
                        </p>
                      </div>
                    </div>
                    <LuPencil color='#939597' size={20} className={styles.scheduleIcon} />
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </Theme>
      ) : (
        <FourNotFour />
      )}
    </>
  );
};

export default EventGlance;
