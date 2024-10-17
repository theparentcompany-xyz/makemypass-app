// import { LuClock, LuPencil } from 'react-icons/lu';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCalendarEventFill, BsQrCodeScan } from 'react-icons/bs';
import { FaTags } from 'react-icons/fa';
import { FaHouse, FaWrench } from 'react-icons/fa6';
import { HiUserGroup } from 'react-icons/hi2';
import { ImTicket } from 'react-icons/im';
import { IoLocationOutline } from 'react-icons/io5';
import { LuCopy, LuDownload, LuMail, LuPencil, LuQrCode } from 'react-icons/lu';
import { MdCampaign } from 'react-icons/md';
import { PiSpinnerDuotone } from 'react-icons/pi';
import { RiCoupon2Fill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import { HashLoader } from 'react-spinners';

import { TillRoles } from '../../../../services/enums';
import { getCommonTags, getEventData } from '../../../apis/events';
import { getEventMailData, listEventMails } from '../../../apis/mails';
import { sendTestMail } from '../../../apis/postevent';
import { listEventSpeakers } from '../../../apis/speakers';
import { createEventTags, listTags } from '../../../apis/tags';
import {
  EventType,
  listMailType,
  MailType,
  SpeakerCRUDType,
  VenueCRUDType,
} from '../../../apis/types';
import { listEventVenues } from '../../../apis/venue';
import { isUserAuthorized, isUserEditor } from '../../../common/commonFunctions';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import Modal from '../../../components/Modal/Modal';
import SectionButton from '../../../components/SectionButton/SectionButton';
import Theme from '../../../components/Theme/Theme';
import { customStyles, getDay, getMonthAbbreviation } from '../EventPage/constants';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import CustomMail from './components/MailModals/CustomMail/CustomMail';
import DummyData from './components/MailModals/DummyData/DummyData';
import TestMail from './components/MailModals/TestMail/TestMail';
import UpdateMail from './components/MailModals/UpdateMail/UpdateMail';
import ManageTickets, { ChildRef } from './components/ManageTickets/ManageTickets';
import SpeakerModal from './components/SpeakerModal/SpeakerModal';
import type { UTMDataType } from './components/UTMManager/types';
import UTMManager from './components/UTMManager/UTMManager';
import VenueModal from './components/VenueModal/VenueModal';
import styles from './EventGlance.module.css';
import type { TagType } from './types';

const EventGlance = () => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const modalRef = useRef<ChildRef>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventLink, setEventLink] = useState(
    `${import.meta.env.VITE_FRONTEND_URL}/${JSON.parse(sessionStorage.getItem('eventData')!).event_name}`,
  );
  const [eventData, setEventData] = useState<EventType>();
  const [tags, setTags] = useState<TagType>({
    tags: [],
    showModal: false,
  });
  const [allTags, setAllTags] = useState<string[]>([]);
  const [UTMData, setUTMData] = useState<UTMDataType>({
    showUTM: false,
    data: {
      source: [],
      medium: [],
      campaign: [],
      term: [],
      content: [],
    },
    selectedData: {
      source: '',
      medium: '',
      campaign: '',
      term: '',
      content: '',
    },
    addUTM: {
      type: '',
      value: '',
    },
    editUTM: {
      type: '',
      value: '',
      index: 0,
    },
  });

  const [confirmTestMail, setConfirmTestMail] = useState({
    status: false,
    mailId: '',
  });
  const [dummyData, setDummyData] = useState<{
    showModal: boolean;
    data: { [key: string]: string } | null;
    mailId: string;
  }>({
    showModal: false,
    data: null,
    mailId: '',
  });

  const [selectedMail, setSelectedMail] = useState<listMailType>();
  const [customMail, setCustomMail] = useState<boolean>(false);
  const eventName = JSON.parse(sessionStorage.getItem('eventData')!).event_name;
  const navigate = useNavigate();
  const [isTicketsOpen, setIsTicketsOpen] = useState(false);
  const [mails, setMails] = useState<listMailType[]>([]);
  const [showQR, setShowQR] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false); // state to track image load
  const [venues, setVenues] = useState<VenueCRUDType>({
    showModal: false,
    venueList: [],
  });
  const [speakers, setSpeakers] = useState<SpeakerCRUDType>({
    showModal: false,
    speakerList: [],
  });
  const handleCloseTicketModal = () => {
    if (modalRef.current) {
      modalRef.current.closeTicketModal();
    }
  };

  const getDummydata = async (id: string) => {
    try {
      if (!id) return;
      const regex = /\{\{([^}]+)\}\}/g;
      const mailData: MailType = await getEventMailData(eventId, id);
      const text = `${mailData?.subject} \n ${mailData?.body}`;
      const matches = text.matchAll(regex);
      const variableNames = Array.from(new Set(Array.from(matches, (match) => match[1])));

      if (variableNames.length > 0) {
        setDummyData((prevData) => ({
          ...prevData,
          data: variableNames.reduce((acc: { [key: string]: string }, variableName) => {
            acc[variableName] = '';
            return acc;
          }, {}),
          mailId: id,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (eventId) getEventData(eventId, setEventTitle, setEventData);
    getCommonTags(setAllTags);
  }, [eventId]);

  useEffect(() => {
    if (eventId) {
      listEventMails(eventId, setMails);
    }
  }, [eventId]);

  useEffect(() => {
    if (venues.showModal) listEventVenues(eventId, setVenues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venues.showModal]);

  useEffect(() => {
    if (speakers.showModal) listEventSpeakers(eventId, setSpeakers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speakers.showModal]);

  useEffect(() => {
    if (dummyData.showModal) getDummydata(confirmTestMail.mailId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dummyData.showModal]);

  useEffect(() => {
    //add utmSelectedData to eventLink
    let utmString = '';
    Object.keys(UTMData.selectedData).forEach((key, index) => {
      if (UTMData.selectedData[key as keyof UTMDataType['selectedData']]) {
        if (index === 0)
          utmString += `?${key}=${UTMData.selectedData[key as keyof UTMDataType['selectedData']]}`;
        else
          utmString += `&${key}=${UTMData.selectedData[key as keyof UTMDataType['selectedData']]}`;
      }
    });

    const parsedURL = new URL(`${import.meta.env.VITE_FRONTEND_URL}/${eventName}${utmString}`);

    setEventLink(parsedURL.toString());

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UTMData.selectedData]);

  return (
    <>
      <Theme>
        {venues.showModal && <VenueModal venues={venues} setVenues={setVenues} eventId={eventId} />}
        {speakers.showModal && (
          <SpeakerModal eventId={eventId} speakers={speakers} setSpeakers={setSpeakers} />
        )}
        {tags.showModal && (
          <Modal
            title='Manage Tags'
            onClose={() => setTags((prev) => ({ ...prev, showModal: false }))}
          >
            <div className={styles.tagModalContent}>
              <p className={styles.tagModalHeading}>Add/Edit Tags</p>
              <p className={styles.tagModalSubHeading}>
                Add tags to categorize your event. Tags can be used to filter events at the listing
                page.
              </p>
              <CreatableSelect
                styles={customStyles}
                isMulti
                options={allTags.map((tag) => ({ label: tag, value: tag }))}
                value={tags.tags.map((tag) => ({ label: tag, value: tag }))}
                onChange={(selectedOptions) => {
                  const newTags = selectedOptions.map((option) => option.value);
                  setTags((prev) => ({ ...prev, tags: newTags }));
                }}
                onCreateOption={(inputValue: string) => {
                  setTags((prev) => ({
                    ...prev,
                    tags: [...prev.tags, inputValue],
                  }));
                }}
                placeholder='Select or create tags'
              />

              <div className={styles.createButtons}>
                <button
                  className={styles.saveButton}
                  onClick={() => {
                    createEventTags({
                      eventId,
                      tags,
                      setTags,
                    });
                  }}
                >
                  Save Tags
                </button>
                <button className={styles.cancelButton}>Cancel</button>
              </div>
            </div>
          </Modal>
        )}
        <DashboardLayout prevPage='/events' tabName='manage'>
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
              <TestMail
                setConfirmTestMail={setConfirmTestMail}
                sendTestMail={sendTestMail}
                confirmTestMail={confirmTestMail}
                setDummyData={setDummyData}
                getDummyData={getDummydata}
              />
            </Modal>
          )}

          {dummyData.showModal && (
            <Modal
              title='Dummy Data'
              onClose={() => setDummyData({ showModal: false, data: {}, mailId: '' })}
              style={{ zIndex: 999 }}
            >
              <DummyData dummyData={dummyData} setDummyData={setDummyData} />
            </Modal>
          )}

          {showQR && (
            <Modal
              title='QR Code'
              onClose={() => setShowQR(false)}
              style={{
                maxHeight: '19rem',
              }}
            >
              <div className={styles.qrContainer}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${eventLink}`}
                  alt='QR Code'
                  onLoad={() => setImageLoaded(true)} // set imageLoaded to true when the image is loaded
                />

                {imageLoaded ? ( // only show this content when image is loaded
                  <>
                    <p className={styles.qrText}>
                      Scan this QR code to visit the event page on your mobile device
                    </p>

                    <SecondaryButton
                      buttonText='Download QR'
                      icon={<LuDownload size={15} />}
                      onClick={() => {
                        const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${eventLink}`;

                        fetch(url)
                          .then((response) => response.blob())
                          .then((blob) => {
                            const link = document.createElement('a');
                            link.href = window.URL.createObjectURL(blob);
                            link.download = 'QR Code.png';
                            link.click();
                          })
                          .catch((error) => console.error('Error downloading the QR code:', error));
                      }}
                    />
                  </>
                ) : (
                  <div className='center'>
                    <HashLoader color={'#46BF75'} size={50} />
                  </div>
                )}
              </div>
            </Modal>
          )}

          <div className={styles.eventGlance}>
            <div className={styles.eventLinkContainer}>
              <div className={styles.eventLink}>{eventLink}</div>
              <div className={styles.linkbuttons}>
                <SecondaryButton
                  buttonText='Copy Link'
                  icon={<LuCopy size={15} />}
                  onClick={() => {
                    navigator.clipboard.writeText(eventLink);
                    toast.success('Event link copied to clipboard');
                  }}
                />
                <SecondaryButton
                  buttonText='Generate QR'
                  icon={<LuQrCode size={15} />}
                  onClick={() => {
                    setShowQR(true);
                  }}
                />
                <SecondaryButton
                  buttonText='UTM'
                  icon={<MdCampaign size={15} />}
                  onClick={() => {
                    setUTMData({ ...UTMData, showUTM: !UTMData.showUTM });
                  }}
                />
              </div>
            </div>

            {UTMData.showUTM && <UTMManager UTMData={UTMData} setUTMData={setUTMData} />}

            <div className={styles.bannerContainer}>
              {isUserAuthorized(TillRoles.ADMIN) && (
                <FaTags
                  size={20}
                  color='#FFFFFF'
                  className={styles.tagButton}
                  onClick={() => {
                    setTags({
                      tags: [],
                      showModal: true,
                    });
                    listTags({ eventId, setTags });
                  }}
                />
              )}
              {eventData?.banner && typeof eventData.banner === 'string' ? (
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
                  {isUserEditor() && (
                    <div className={styles.buttons}>
                      <button
                        onClick={() => navigate('./edit-event')}
                        className={styles.editEventButton}
                      >
                        Edit Event
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.sectionButtons}>
              {/* <Link to={`/${eventName}/manage/tickets`}> */}
              <SectionButton
                buttonText='Tickets'
                buttonColor='#7662FC'
                icon={<RiCoupon2Fill size={25} color='#7662FC' />}
                onClick={() => setIsTicketsOpen(true)}
              />
              <SectionButton
                buttonText='Coupons'
                buttonColor='#7662FC'
                icon={<ImTicket size={25} color='#7662FC' />}
                onClick={() => navigate(`/${eventName}/coupon`)}
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

              <SectionButton
                buttonText='Update Venues'
                buttonColor='#5B75FB'
                icon={<FaHouse size={25} color='#5B75FB' />}
                onClick={() => {
                  setVenues({ ...venues, showModal: true });
                }}
              />

              <Link to={`/${eventName}/manage/sub-events`}>
                <SectionButton
                  buttonText='Sub-Events'
                  buttonColor='#5B75FB'
                  icon={<BsCalendarEventFill size={25} color='#5B75FB' />}
                />
              </Link>

              {import.meta.env.VITE_CURRENT_ENV == 'dev' && (
                <SectionButton
                  buttonText='Update Speakers'
                  buttonColor='#5B75FB'
                  icon={<FaHouse size={25} color='#5B75FB' />}
                  onClick={() => {
                    setSpeakers({ ...speakers, showModal: true });
                  }}
                />
              )}
              {import.meta.env.VITE_CURRENT_ENV == 'dev' && (
                <SectionButton
                  buttonText='Spinwheel'
                  buttonColor='#5B75FB'
                  icon={<PiSpinnerDuotone size={25} color='#5B75FB' />}
                  onClick={() => {
                    navigate(`/${eventName}/manage/spinwheel`);
                  }}
                />
              )}
            </div>

            <div className={styles.sendMailsContainer}>
              <div className={styles.sendMailsText}>
                <p className={styles.sendMailsHeading}>Send Mails</p>
                <p className={styles.sendMailsSubHeading}>Send Mails to participants </p>
              </div>
              <div className={styles.scheduleContainer}>
                {mails.map((mail, key) => (
                  <div
                    className={styles.scheduleBox}
                    key={key}
                    onClick={() => setSelectedMail(mail)}
                  >
                    <div className='row'>
                      <div className={styles.scheduleText}>
                        <div className={styles.scheduleTextHeader}>
                          <LuMail color='#939597' size={20} />
                          <p className={styles.scheduleHeading}>
                            {mail.type}{' '}
                            {isUserEditor() && (
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
                            )}
                          </p>
                        </div>
                        <p className={styles.scheduleSubHeading}>{mail.subject}</p>
                      </div>
                    </div>
                    <div className={styles.mailActions}>
                      <LuPencil color='#939597' size={20} className={styles.scheduleIcon} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DashboardLayout>
      </Theme>
    </>
  );
};

export default EventGlance;
