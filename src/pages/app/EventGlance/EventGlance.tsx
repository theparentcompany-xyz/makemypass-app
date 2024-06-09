import Theme from '../../../components/Theme/Theme';

import styles from './EventGlance.module.css';
import Glance from '../../../components/Glance/Glance';
import { IoLocationOutline } from 'react-icons/io5';
import { ImTicket } from 'react-icons/im';
import { HiUserGroup } from 'react-icons/hi2';
import { FaWrench } from 'react-icons/fa6';
import { BsQrCodeScan } from 'react-icons/bs';
import SectionButton from '../../../components/SectionButton/SectionButton';
// import { LuClock, LuPencil } from 'react-icons/lu';
import { useEffect, useState } from 'react';
import Modal from '../../../components/Modal/Modal';
import { getDay, getMonthAbbreviation } from '../EventPage/constants';
import { EventType, MailType } from '../../../apis/types';
import { getEvent } from '../../../apis/events';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import EventHeader from '../../../components/EventHeader/EventHeader';
import ManageTickets from './components/ManageTickets/ManageTickets';
import { LuMail, LuPencil } from 'react-icons/lu';
import { listMails, updateMail } from '../../../apis/mails';

const EventGlance = () => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [eventTitle, setEventTitle] = useState('');
  const [eventData, setEventData] = useState<EventType>();

  const onUpdateEmail = () => {
    const matchingMail = mails.find((mail) => mail.id === selectedMail?.id);
    if (!matchingMail || !selectedMail) return;

    const changedData: Record<string, any> = Object.entries(selectedMail as Record<string, any>)
      .filter(([key, value]) => matchingMail?.[key as keyof MailType] !== value)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    updateMail(eventId, selectedMail?.id as string, changedData);
    console.log(changedData);
  };

  useEffect(() => {
    if (eventId) getEvent(eventId, setEventTitle, setEventData);
  }, [eventId]);
  const [selectedMail, setSelectedMail] = useState<MailType>();

  const eventName = JSON.parse(sessionStorage.getItem('eventData')!).event_name;
  const navigate = useNavigate();
  const [isTicketsOpen, setIsTicketsOpen] = useState(false);
  const [mails, setMails] = useState<MailType[]>([]);

  useEffect(() => {
    if (eventId) {
      listMails(eventId, setMails);
      console.log(mails);
    }
  }, [eventId]);
  return (
    <>
      <Theme>
        <div className={styles.eventGlanceContainer}>
          <div className={styles.eventGlance}>
            <EventHeader />
            <Glance tab='manage' />
          </div>
          {isTicketsOpen && (
            <Modal onClose={() => setIsTicketsOpen(false)} type='side'>
              <ManageTickets setIsTicketsOpen={setIsTicketsOpen} />
            </Modal>
          )}

          {selectedMail && (
            <Modal onClose={() => setSelectedMail(undefined)} type='side'>
              <div className={styles.modalHeader}>Update Reminder Email</div>
              <div className={styles.modalSubText}>
                <div className={styles.inputContainers}>
                  <div className={styles.inputContainer}>
                    <p className={styles.inputLabel}>The reminder goes Out </p>
                    <p className={styles.inputSubText}>X hours before the event</p>
                  </div>
                  <div className={styles.inputContainer}>
                    <p className={styles.inputLabel}>Subject</p>
                    <input
                      type='text'
                      placeholder='Enter Subject'
                      className={styles.input}
                      value={selectedMail?.subject}
                      onChange={(e) =>
                        setSelectedMail({ ...selectedMail, subject: e.target.value })
                      }
                    />
                  </div>

                  <div className={styles.inputContainer}>
                    <p className={styles.inputLabel}>Body</p>

                    <textarea
                      placeholder='Enter Email Body'
                      className={styles.textarea}
                      value={selectedMail?.body}
                      onChange={(e) => setSelectedMail({ ...selectedMail, body: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={onUpdateEmail}>
                  Update Reminder
                </button>
                <button className={styles.button}>Send Now</button>
                <button className={styles.button} onClick={() => setSelectedMail(undefined)}>
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
                      <rect width='100%' height='100%' className={styles.banner} />
                      <text x='40%' y='50%' fill='white' className={styles.svgText}>
                        No Banner.
                      </text>
                      <text x='10%' y='60%' fill='white' className={styles.svgText}>
                        Please Edit Event Details to add a banner
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
                    {eventData?.event_start_date && (
                      <>
                        <div className={styles.dateBox}>
                          <p className={styles.eventMonth}>
                            {getMonthAbbreviation(eventData?.event_start_date)}
                          </p>
                          <p className={styles.eventDateNum}>
                            {getDay(eventData?.event_start_date)}
                          </p>
                        </div>
                        <div className={styles.eventDateTimeText}>
                          <p className={styles.eventDateText}>
                            {new Date(eventData?.event_start_date).toLocaleDateString([], {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            }) ?? ''}
                          </p>
                          <p className={styles.eventTimeText}>
                            {new Date(eventData?.event_start_date).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            -{' '}
                            {eventData?.event_end_date && (
                              <>
                                {new Date(eventData?.event_end_date).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                                {', '}
                                {new Date(eventData?.event_end_date).toLocaleDateString([], {
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
                    <button
                      onClick={() => navigate('./edit-event')}
                      className={styles.editEventButton}
                    >
                      Edit Event
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.sectionButtons}>
              {/* <Link to={`/${eventName}/manage/tickets`}> */}
              <SectionButton
                buttonText='Tickets'
                buttonColor='#7662FC'
                icon={<ImTicket size={25} color='#7662FC' />}
                onClick={() => setIsTicketsOpen(true)}
              />
              {/* </Link> */}
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

            <div className={styles.sendMailsContainer}>
              <div className={styles.sendMailsText}>
                <p className={styles.sendMailsHeading}>Send Mails</p>
                <p className={styles.sendMailsSubHeading}>Send Mails to participants </p>
              </div>
              <div className={styles.scheduleContainer}>
                {mails.map((mail, key) => (
                  <div className={styles.scheduleBox} key={key}>
                    <div className='row'>
                      <LuMail color='#939597' size={20} className={styles.scheduleIcon} />
                      <div className={styles.scheduleText}>
                        <p className={styles.scheduleHeading}>{mail.type}</p>
                        <p className={styles.scheduleSubHeading}>{mail.subject}</p>
                      </div>
                    </div>
                    <LuPencil
                      color='#939597'
                      size={20}
                      className={styles.scheduleIcon}
                      onClick={() => setSelectedMail(mail)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Theme>
    </>
  );
};

export default EventGlance;
