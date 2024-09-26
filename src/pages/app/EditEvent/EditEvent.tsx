import './google.css';

import { Autocomplete, GoogleMap, Libraries, MarkerF, useLoadScript } from '@react-google-maps/api';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlineTeam } from 'react-icons/ai';
import { BiArrowToTop } from 'react-icons/bi';
import { BsTicketDetailed } from 'react-icons/bs';
import { FiGlobe } from 'react-icons/fi';
import { GrLocation } from 'react-icons/gr';
import { HiOutlineTicket, HiOutlineUserGroup } from 'react-icons/hi2';
import { IoCloseOutline } from 'react-icons/io5';
import { LuPencil } from 'react-icons/lu';
import { MdOutlineShoppingCartCheckout } from 'react-icons/md';
import {
  TbHeartHandshake,
  TbMailStar,
  TbMicrophone,
  TbSettings,
  TbUserCheck,
  TbWorld,
} from 'react-icons/tb';
import Select from 'react-select';
import { HashLoader } from 'react-spinners';

import { deleteEvent, getEventData, updateEventData } from '../../../apis/events';
import { ErrorMessages, EventType } from '../../../apis/types';
import { convertDate, getCurrentTimezone, isUserEditor } from '../../../common/commonFunctions';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import Editor from '../../../components/Editor/Editor';
import Modal from '../../../components/Modal/Modal';
import Slider from '../../../components/SliderButton/Slider';
import Theme from '../../../components/Theme/Theme';
import { useOverrideCtrlS } from '../../../hooks/common';
import { customStyles } from '../EventPage/constants';
import styles from './EditEvent.module.css';

const libraries: Libraries = ['places'];

const EditEvent = () => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [eventTitle, setEventTitle] = useState('');
  const [formErrors, setFormErrors] = useState<ErrorMessages>({});
  const [fetchedEvent, setFetchedEvent] = useState<EventType>();
  const [eventData, setEventData] = useState<EventType>();
  const [newDescription, setNewDescription] = useState('');
  const [eventDate, setEventDate] = useState<{ start: Date | undefined; end: Date | undefined }>();
  const [regDate, setRegDate] = useState<{ start: Date | undefined; end: Date | undefined }>();
  const [placeName, setPlaceName] = useState('');
  const [banner, setBanner] = useState<File | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [followupMessage, setFollowupMessage] = useState('');

  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const selectOptions = [
    { value: '1', label: 'Draft' },
    { value: '2', label: 'Published' },
    { value: '3', label: 'Completed' },
  ];
  const timezone = getCurrentTimezone();
  const [showModal, setShowModal] = useState(false);

  const dateForDateTimeLocal = (date: Date | undefined) =>
    date
      ? new Date(date.getTime() + date.getTimezoneOffset() * -60 * 1000).toISOString().slice(0, 19)
      : undefined;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GMAPS_API_KEY as string,
    libraries: libraries,
  });

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      setPlaceName(place.name || '');
      if (place.name && place.vicinity)
        setPlaceName(
          place.name + ' , ' + place.vicinity.substring(place.vicinity.lastIndexOf(',') + 1),
        );
      else if (place.name) setPlaceName(place.name);
      if (place.geometry) {
        setLocation({
          lat: place.geometry.location?.lat() || 0,
          lng: place.geometry.location?.lng() || 0,
        });
      }
    }
  };
  const onMapClick = (event: google.maps.MapMouseEvent) => {
    setLocation({ lat: event.latLng?.lat() ?? 0, lng: event.latLng?.lng() ?? 0 });
  };

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      draggableCursor: 'pointer',
      zoomControl: true,
      mapTypeControl: true,
    }),
    [],
  );

  const onSubmit = () => {
    const changedData: Record<string, EventType[keyof EventType]> = Object.entries(
      eventData as EventType,
    )
      .filter(
        ([key, value]) => fetchedEvent?.[key as keyof EventType] !== value && key !== 'location',
      )
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    if (eventTitle !== eventData?.title) changedData['title'] = eventTitle;
    if (newDescription !== eventData?.description) changedData['description'] = newDescription;
    if (convertDate(eventDate?.start) != fetchedEvent?.event_start_date)
      changedData['event_start_date'] = convertDate(eventDate?.start);
    if (convertDate(eventDate?.end) != fetchedEvent?.event_end_date)
      changedData['event_end_date'] = convertDate(eventDate?.end);
    if (convertDate(regDate?.start) != fetchedEvent?.reg_start_date)
      changedData['reg_start_date'] = convertDate(regDate?.start);
    if (convertDate(regDate?.end) != fetchedEvent?.reg_end_date)
      changedData['reg_end_date'] = convertDate(regDate?.end);
    if (placeName && placeName !== fetchedEvent?.place) changedData['place'] = placeName;
    if (
      !eventData?.is_online &&
      (location?.lat != fetchedEvent?.location?.lat || location?.lng != fetchedEvent?.location?.lng)
    ) {
      changedData['location[lat]'] = location?.lat;
      changedData['location[lng]'] = location?.lng;
    }

    if (changedData['is_team'] == true) {
      if (eventData?.select_multi_ticket) changedData['select_multi_ticket'] = false;
      if (eventData?.is_grouped_ticket) changedData['is_grouped_ticket'] = false;
    }

    if (logo) changedData['logo'] = logo;
    if (banner) changedData['banner'] = banner;

    Object.keys(changedData).forEach((key) => {
      if (changedData[key] === null || changedData[key] === undefined || changedData[key] === '')
        changedData[key] = 'null';
    });

    if (changedData?.is_online == true) {
      changedData['location[lat]'] = 'null';
      changedData['location[lng]'] = 'null';

      changedData['place'] = 'null';
    }

    if (changedData?.select_multi_ticket == false) {
      changedData.is_grouped_ticket = false;
    }

    const formData = new FormData();
    for (const key in changedData) {
      const value = changedData[key];
      if (value !== undefined && typeof value !== 'object') {
        formData.append(key, String(value));
      } else if (value instanceof Blob) {
        formData.append(key, value);
      }
    }

    for (const key in changedData) {
      if (['event_name', 'logo', 'title'].includes(key) && !changedData[key]) {
        sessionStorage.clear();
      }
    }

    updateEventData({ eventId, eventData: formData, setFormErrors });
  };

  const agreeToDelete = () => {
    deleteEvent(eventId);
  };

  useOverrideCtrlS(onSubmit);

  useEffect(() => {
    if (eventId) getEventData(eventId, setEventTitle, setEventData);
  }, [eventId]);

  useEffect(() => {
    if (eventData && !fetchedEvent) {
      setFetchedEvent(eventData);
      setLocation({ lat: eventData.location?.lat || 0, lng: eventData.location?.lng || 0 });
      setPlaceName(eventData.place);
      setEventDate({
        start: eventData.event_start_date ? new Date(eventData?.event_start_date) : undefined,
        end: eventData.event_end_date ? new Date(eventData?.event_end_date) : undefined,
      });
      setRegDate({
        start: eventData.reg_start_date ? new Date(eventData?.reg_start_date) : undefined,
        end: eventData.reg_end_date ? new Date(eventData?.reg_end_date) : undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventData]);

  return (
    <>
      <Theme>
        {showAdvancedSettings && (
          <Modal
            title='Advanced Settings'
            type='side'
            onClose={() => setShowAdvancedSettings(false)}
          >
            <div className={styles.advancedModalContainer}>
              {eventData && (
                <>
                  <div className={styles.option}>
                    <label>
                      <HiOutlineTicket size={20} color='#949597' />
                      Show Tickets First
                    </label>
                    <Slider
                      checked={eventData.show_ticket_first as boolean}
                      text={''}
                      onChange={() =>
                        isUserEditor() &&
                        setEventData({
                          ...eventData,
                          show_ticket_first: !eventData.show_ticket_first,
                        })
                      }
                    />
                  </div>
                  <div className={styles.option}>
                    <label>
                      <AiOutlineTeam size={20} color='#949597' /> Allow Team Registration
                    </label>
                    <Slider
                      checked={eventData.is_team as boolean}
                      text={''}
                      onChange={() =>
                        isUserEditor() &&
                        setEventData({
                          ...eventData,
                          is_team: !eventData.is_team,
                        })
                      }
                    />
                  </div>
                  {!eventData.is_team && (
                    <>
                      <div className={styles.option}>
                        <label>
                          <BsTicketDetailed size={20} color='#949597' /> Allow Multi Ticket
                        </label>
                        <Slider
                          checked={eventData.select_multi_ticket as boolean}
                          text={''}
                          onChange={() =>
                            isUserEditor() &&
                            setEventData({
                              ...eventData,
                              select_multi_ticket: !eventData.select_multi_ticket,
                            })
                          }
                        />
                      </div>
                      {eventData.select_multi_ticket && (
                        <motion.div
                          className={styles.subOption}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <label>
                            <BsTicketDetailed size={20} color='#949597' /> Grouped Ticket
                          </label>
                          <Slider
                            checked={eventData.is_grouped_ticket}
                            text={''}
                            onChange={() =>
                              isUserEditor() &&
                              setEventData({
                                ...eventData,
                                is_grouped_ticket: !eventData.is_grouped_ticket,
                              })
                            }
                          />
                        </motion.div>
                      )}
                    </>
                  )}

                  <div className={styles.option}>
                    <label>
                      <MdOutlineShoppingCartCheckout size={20} color='#949597' /> Enable Checkout
                      Scan
                    </label>
                    <Slider
                      checked={eventData.is_checkout as boolean}
                      text={''}
                      onChange={() =>
                        isUserEditor() &&
                        setEventData({
                          ...eventData,
                          is_checkout: !eventData.is_checkout,
                        })
                      }
                    />
                  </div>
                  <div className={styles.option}>
                    <label>
                      <TbHeartHandshake size={20} color='#949597' /> Thank You Page
                    </label>
                    <Slider
                      checked={eventData.thank_you_new_page as boolean}
                      text={''}
                      onChange={() =>
                        isUserEditor() &&
                        setEventData({
                          ...eventData,
                          thank_you_new_page: !eventData.thank_you_new_page,
                        })
                      }
                    />
                  </div>
                  <div className={styles.option}>
                    <label>
                      <MdOutlineShoppingCartCheckout size={20} color='#949597' /> Enable Randomizer
                    </label>
                    <Slider
                      checked={eventData.is_random_user as boolean}
                      text={''}
                      onChange={() =>
                        isUserEditor() &&
                        setEventData({
                          ...eventData,
                          is_random_user: !eventData.is_random_user,
                        })
                      }
                    />
                  </div>
                  <div className={styles.option}>
                    <label>
                      <HiOutlineUserGroup size={20} color='#949597' />
                      Allow Multiple Check-In
                    </label>
                    <Slider
                      checked={eventData.is_multiple_checkin as boolean}
                      text={''}
                      onChange={() =>
                        isUserEditor() &&
                        setEventData({
                          ...eventData,
                          is_multiple_checkin: !eventData.is_multiple_checkin,
                        })
                      }
                    />
                  </div>
                </>
              )}
              <div className={styles.followupMessageContainer}>
                <label>Followup Message</label>
                <p className={styles.subText}>
                  This message will be shown once the user has registered for the event.
                </p>
                <div className={styles.followupMessage}>
                  <Editor
                    description={eventData?.followup_msg ?? ''}
                    setNewDescription={setFollowupMessage}
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  if (eventData && isUserEditor())
                    setEventData({ ...eventData, followup_msg: followupMessage.toString() });
                  setShowAdvancedSettings(false);
                }}
                className={styles.continueButton}
              >
                Continue
              </button>
            </div>
          </Modal>
        )}
        <DashboardLayout prevPage='-1'>
          {eventData && isLoaded ? (
            <>
              {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                  <div className={styles.modalContainer}>
                    <p className={styles.modalHeader}>Are you sure you want to Delete?</p>
                    <div className={styles.modalButtonContainer}>
                      <button className={styles.modalButton} onClick={() => setShowModal(false)}>
                        No
                      </button>
                      <button className={styles.modalButton} onClick={() => agreeToDelete()}>
                        Yes
                      </button>
                    </div>
                  </div>
                </Modal>
              )}
              <div className={styles.createEventContainer}>
                <div className={styles.rightSideContainer}>
                  <div className={styles.eventNameContainer}>
                    <Select
                      options={selectOptions}
                      className={styles.selectDropdown}
                      styles={{
                        ...customStyles,
                        menu: (provided) => ({
                          ...provided,
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          backgroundColor: '#1C2222',
                          color: '#fff',
                          fontFamily: 'Inter, sans-serif',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '0.9rem',
                          zIndex: 1000,
                        }),
                      }}
                      onChange={(selectedOption: { value: string; label: string } | null) =>
                        isUserEditor() &&
                        setEventData({ ...eventData, status: selectedOption?.label || '' })
                      }
                      value={selectOptions.filter((option) => option.label === eventData?.status)}
                      placeholder={`Select an option`}
                      isSearchable={false}
                    />

                    <textarea
                      placeholder='Event Name'
                      className={styles.inputEventName}
                      disabled={!isUserEditor()}
                      onChange={(e) => {
                        isUserEditor() && setEventTitle(e.target.value);
                      }}
                      value={eventTitle}
                    />
                  </div>
                  <div className={styles.bannerContainer}>
                    <input
                      type='file'
                      className={styles.fileUpload}
                      disabled={!isUserEditor()}
                      accept='image/*'
                      onChange={(e) =>
                        isUserEditor() && setBanner(e.target.files ? e.target.files[0] : null)
                      }
                    />
                    {eventData?.banner && !banner?.name ? (
                      <>
                        <IoCloseOutline
                          className={styles.closeIcon}
                          onClick={() => {
                            isUserEditor() && setEventData({ ...eventData, banner: '' });
                          }}
                        />
                        {eventData?.banner && typeof eventData?.banner === 'string' && (
                          <img src={eventData?.banner} alt='' className={styles.banner} />
                        )}
                      </>
                    ) : (
                      <>
                        {banner?.name ? (
                          <>
                            <IoCloseOutline
                              className={styles.closeIcon}
                              onClick={() => {
                                isUserEditor() &&
                                  eventData?.banner &&
                                  setEventData({ ...eventData, banner: '' });
                                setBanner(null);
                              }}
                            />
                            <img
                              src={URL.createObjectURL(banner)}
                              alt=''
                              className={styles.banner}
                            />
                          </>
                        ) : (
                          <svg height='250' width='100%' className={styles.banner}>
                            {eventTitle && (
                              <>
                                <rect width='100%' height='100%' className={styles.banner} />
                                <text x='12%' y='50%' fill='white' className={styles.svgText}>
                                  No Banner. Click Here to Upload (2000px x 1000px)
                                </text>
                              </>
                            )}
                          </svg>
                        )}
                      </>
                    )}
                  </div>
                  <div className={styles.descriptionContainer}>
                    <p className={styles.eventHeading}>About Event</p>

                    <br />
                    <Editor
                      description={eventData?.description || ''}
                      setNewDescription={setNewDescription}
                    />
                  </div>
                </div>

                <div className={styles.leftSideContainer}>
                  <div className={styles.container}>
                    <AnimatePresence>
                      {formErrors.title && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className={styles.errorText}
                        >
                          {`${formErrors.title[0]}`}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <div className={styles.urlContainer}>
                      <label>Public URL: {window.location.hostname}/</label>
                      <input
                        type='text'
                        className={styles.urlInput}
                        placeholder='event-url'
                        disabled={!isUserEditor()}
                        value={eventData?.name}
                        onChange={(e) => {
                          if (isUserEditor()) {
                            e.target.value = e.target.value.replace(/[^a-zA-Z0-9-]/g, '');
                            setEventData({ ...eventData, name: e.target.value });
                          }
                        }}
                      />
                    </div>
                    <AnimatePresence>
                      {formErrors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className={styles.errorText}
                        >
                          {`${formErrors.name[0]}`}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <div className={styles.timezoneContainer}>
                      <div className={styles.dateTimeParentContainer}>
                        <div className={styles.dateTimeContainer}>
                          <div>
                            <label>Event Start</label>
                            <input
                              type='datetime-local'
                              className={styles.dateInput}
                              disabled={!isUserEditor()}
                              value={dateForDateTimeLocal(eventDate?.start)}
                              onChange={(e) => {
                                isUserEditor() &&
                                  setEventDate({
                                    end: eventDate?.end,
                                    start: e.target.value ? new Date(e.target.value) : undefined,
                                  });
                              }}
                            />
                          </div>
                          <div>
                            <label>Event End</label>
                            <input
                              type='datetime-local'
                              className={styles.dateInput}
                              value={dateForDateTimeLocal(eventDate?.end)}
                              disabled={!isUserEditor()}
                              onChange={(e) =>
                                isUserEditor() &&
                                setEventDate({
                                  start: eventDate?.start,
                                  end: e.target.value ? new Date(e.target.value) : undefined,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className={styles.dateTimeContainer}>
                          <div>
                            <label>Registration Start</label>
                            <input
                              type='datetime-local'
                              disabled={!isUserEditor()}
                              className={styles.dateInput}
                              value={dateForDateTimeLocal(regDate?.start)}
                              onChange={(e) =>
                                isUserEditor() &&
                                setRegDate({
                                  end: regDate?.end,
                                  start: e.target.value ? new Date(e.target.value) : undefined,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label>Registration End</label>
                            <input
                              type='datetime-local'
                              disabled={!isUserEditor()}
                              className={styles.dateInput}
                              value={dateForDateTimeLocal(regDate?.end)}
                              onChange={(e) =>
                                isUserEditor() &&
                                setRegDate({
                                  start: regDate?.start,
                                  end: e.target.value ? new Date(e.target.value) : undefined,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <span className={styles.timezone}>
                        <FiGlobe size={20} color='#949597' />
                        <br />
                        {timezone?.offset}
                        <br />
                        {timezone?.zoneName}
                      </span>
                    </div>
                    <AnimatePresence>
                      {(formErrors.reg_start_date ||
                        formErrors.reg_end_date ||
                        formErrors.event_start_date ||
                        formErrors.event_end_date) && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className={styles.errorText}
                        >
                          {`${formErrors.reg_start_date[0]}\n ${formErrors.reg_end_date[0]}\n ${formErrors.event_start_date[0]}\n ${formErrors.event_end_date[0]}`}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {!eventData.is_online && (
                      <>
                        <GoogleMap
                          mapContainerStyle={{
                            height: '400px',
                            width: '100%',
                            borderRadius: '4px 4px 0 0',
                          }}
                          zoom={14}
                          center={location ?? { lat: 0, lng: 0 }}
                          options={mapOptions}
                          onClick={onMapClick}
                        >
                          {location && (
                            <MarkerF
                              position={location}
                              icon={{
                                url: 'https://makemypass.com/app/mascot.webp',
                                scaledSize: new google.maps.Size(40, 52),
                              }}
                            />
                          )}
                        </GoogleMap>

                        <div className={styles.eventLocation}>
                          <GrLocation size={20} color='#949597' />
                          <div className={styles.locationContainer}>
                            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                              <input
                                type='text'
                                disabled={!isUserEditor()}
                                placeholder='Add Event Location'
                                className={styles.inputLocation}
                                value={placeName}
                                onChange={(e) => isUserEditor() && setPlaceName(e.target.value)}
                              />
                            </Autocomplete>
                            <p className={styles.subText}>Offline location </p>
                          </div>
                        </div>
                      </>
                    )}
                    <p className={styles.eventOptions}>Event Options</p>
                    <div className={styles.optionsContainer}>
                      <div className={styles.option}>
                        <label>
                          <TbMicrophone size={20} color='#949597' /> Audio Form Fill
                        </label>
                        <Slider
                          checked={eventData.parse_audio}
                          text={''}
                          onChange={() =>
                            isUserEditor() &&
                            setEventData({
                              ...eventData,
                              parse_audio: !eventData.parse_audio,
                            })
                          }
                        />
                      </div>
                      <div className={styles.option}>
                        <label>
                          <TbUserCheck size={20} color='#949597' /> Require Approval
                        </label>
                        <Slider
                          checked={eventData.approval_required}
                          text={''}
                          onChange={() =>
                            isUserEditor() &&
                            setEventData({
                              ...eventData,
                              approval_required: !eventData.approval_required,
                            })
                          }
                        />
                      </div>
                      <div className={styles.option}>
                        <label>
                          <TbMailStar size={20} color='#949597' /> Invite Only
                        </label>
                        <Slider
                          checked={eventData.is_private}
                          text={''}
                          onChange={() =>
                            isUserEditor() &&
                            setEventData({ ...eventData, is_private: !eventData.is_private })
                          }
                        />
                      </div>
                      <div className={styles.option}>
                        <label>
                          <TbWorld size={20} color='#949597' /> Online Event
                        </label>
                        <Slider
                          checked={eventData.is_online}
                          text={''}
                          onChange={() =>
                            isUserEditor() &&
                            setEventData({ ...eventData, is_online: !eventData.is_online })
                          }
                        />
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
                            disabled={!isUserEditor()}
                            className={styles.capcityInput}
                            placeholder='Unlimited'
                            value={eventData?.capacity}
                            onChange={(e) => {
                              if (isUserEditor()) {
                                const value = Number(e.target.value);
                                setEventData({
                                  ...eventData,
                                  capacity: value === 0 ? undefined : value,
                                });
                              }
                            }}
                            min={1}
                          />
                          <LuPencil size={15} color='#949597' />
                        </div>
                      </div>
                    </div>

                    <div className={styles.uploadLogoContainerParent}>
                      <div className={styles.uploadLogoContainer}>
                        <div>
                          {logo ? (
                            <img
                              src={URL.createObjectURL(logo)}
                              alt='Uploaded Image'
                              className={styles.noImage}
                            />
                          ) : eventData?.logo && typeof eventData?.logo === 'string' ? (
                            <img src={eventData.logo} className={styles.noImage} />
                          ) : (
                            <div className={styles.noImage}></div>
                          )}
                        </div>
                        <div className={styles.uploadLogo}>
                          <p>Upload {eventData?.logo ? 'New' : ''} Logo</p>
                          <p className={styles.logoName}>{logo?.name}</p>
                        </div>
                        <input
                          disabled={!isUserEditor()}
                          type='file'
                          className={styles.fileUpload}
                          accept='image/*'
                          onChange={(e) =>
                            isUserEditor() && setLogo(e.target.files ? e.target.files[0] : null)
                          }
                        />
                        <div className={styles.pencil}>
                          <LuPencil size={15} color='#949597' />
                        </div>
                      </div>
                      <IoCloseOutline
                        className={styles.closeIcon}
                        onClick={() => {
                          if (isUserEditor()) {
                            setLogo(null);
                            setEventData({ ...eventData, logo: '' });
                          }
                        }}
                      />
                    </div>

                    <div className={styles.buttonContainer}>
                      {isUserEditor() && (
                        <button className={styles.deleteButton} onClick={() => setShowModal(true)}>
                          Delete
                        </button>
                      )}

                      <button
                        className={styles.settingsButton}
                        onClick={() => setShowAdvancedSettings(true)}
                      >
                        <TbSettings />
                        Advanced Settings
                      </button>

                      <button className={styles.createButton} onClick={() => history.back()}>
                        Cancel
                      </button>
                      {isUserEditor() && (
                        <button className={styles.createButton} onClick={onSubmit}>
                          Save
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.center}>
              <HashLoader color={'#46BF75'} size={50} />
            </div>
          )}
        </DashboardLayout>
      </Theme>
    </>
  );
};

export default EditEvent;
