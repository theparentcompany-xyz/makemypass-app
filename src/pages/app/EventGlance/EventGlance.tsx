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
import { useEffect, useRef, useState } from 'react';
import Modal from '../../../components/Modal/Modal';
import { getDay, getMonthAbbreviation } from '../EventPage/constants';
import { EventType, listMailType } from '../../../apis/types';
import { getEvent } from '../../../apis/events';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import EventHeader from '../../../components/EventHeader/EventHeader';
import ManageTickets from './components/ManageTickets/ManageTickets';
import { LuMail, LuPencil } from 'react-icons/lu';
import { listMails } from '../../../apis/mails';
import CustomMail from './components/CustomMail/CustomMail';
import UpdateMail from './components/UpdateMail/UpdateMail';
import { sentTextMail } from '../../../apis/postevent';
import { ChildRef } from './components/ManageTickets/ManageTickets';
const EventGlance = () => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const modalRef = useRef<ChildRef>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventData, setEventData] = useState<EventType>();
  const [confirmTestMail, setConfirmTestMail] = useState({
    status: false,
    mailId: '',
  });

  const handleCloseTicketModal = () => {
    if (modalRef.current) {
      modalRef.current.closeTicketModal();
    }
  };

  useEffect(() => {
    if (eventId) getEvent(eventId, setEventTitle, setEventData);
  }, [eventId]);
  const [selectedMail, setSelectedMail] = useState<listMailType>();
  const [customMail, setCustomMail] = useState<boolean>(false);
  const eventName = JSON.parse(sessionStorage.getItem('eventData')!).event_name;
  const navigate = useNavigate();
  const [isTicketsOpen, setIsTicketsOpen] = useState(false);
  const [mails, setMails] = useState<listMailType[]>([]);

  useEffect(() => {
    if (eventId) {
      listMails(eventId, setMails);
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
            <Modal
              title='Manage Tickets'
              onClose={() => {
                handleCloseTicketModal();
              }}
              type='side'
            >
              <ManageTickets setIsTicketsOpen={setIsTicketsOpen} ref={modalRef} />
            </Modal>
          )}
          {customMail && (
            <Modal
              title='Connect Custom Mail'
              onClose={() => setCustomMail(false)}
              style={{ zIndex: 1500 }}
            >
              <CustomMail setCustomMail={setCustomMail} />
            </Modal>
          )}

          {selectedMail && (
            <Modal onClose={() => setSelectedMail(undefined)} type='side'>
              <UpdateMail
                selectedMail={selectedMail}
                setCustomMail={setCustomMail}
                setSelectedMail={setSelectedMail}
                setMails={setMails}
              />
            </Modal>
          )}

          {confirmTestMail.status && (
            <Modal
              title='Test Mail'
              onClose={() =>
                setConfirmTestMail({
                  status: false,
                  mailId: '',
                })
              }
            >
              <div className={styles.modalContainer}>
                <div className={styles.sectionContent1}>
                  <p className={styles.sectionText}>Are you sure you want to sent</p>
                </div>
                <div className={styles.modalButtons}>
                  <button
                    className={styles.confirmButton}
                    onClick={() => {
                      sentTextMail(eventId, confirmTestMail.mailId);
                    }}
                  >
                    Send
                  </button>
                  <button
                    onClick={() => {
                      setConfirmTestMail({
                        status: false,
                        mailId: '',
                      });
                    }}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
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
                    {eventData?.place && (
                      <>
                        <div className={styles.locationBox}>
                          <IoLocationOutline size={25} className={styles.locationIcon} />
                        </div>
                        <div className={styles.eventDateTimeText}>
                          <p className={styles.eventDateText}>{eventData?.place}</p>
                        </div>
                      </>
                    )}
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
                        <p className={styles.scheduleHeading}>
                          {mail.type}{' '}
                          <span
                            className={styles.testMail}
                            onClick={() => {
                              setConfirmTestMail({
                                status: true,
                                mailId: mail.id,
                              });
                            }}
                          >
                            Test Mail
                          </span>
                        </p>
                        <p className={styles.scheduleSubHeading}>{mail.subject}</p>
                      </div>
                    </div>
                    <div className={styles.mailActions}>
                      <LuPencil
                        color='#939597'
                        size={20}
                        className={styles.scheduleIcon}
                        onClick={() => setSelectedMail(mail)}
                      />
                    </div>
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
