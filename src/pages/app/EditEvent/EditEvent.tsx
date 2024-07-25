import styles from './EditEvent.module.css';
import Theme from '../../../components/Theme/Theme';
import { customStyles } from '../EventPage/constants';
import { GrLocation } from 'react-icons/gr';
import { getEvent, editEvent, deleteEvent } from '../../../apis/events';
import { TbMicrophone, TbUserCheck, TbWorld } from 'react-icons/tb';
import { TbMailStar } from 'react-icons/tb';
import { BiArrowToTop } from 'react-icons/bi';
import { LuPencil } from 'react-icons/lu';
import { FiGlobe } from 'react-icons/fi';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { BsTicketDetailed } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import { AiOutlineTeam } from 'react-icons/ai';
import { useEffect, useRef, useState, useMemo } from 'react';
import { HashLoader } from 'react-spinners';
import { ErrorMessages, EventType } from '../../../apis/types';
import Slider from '../../../components/SliderButton/Slider';
import { getCurrentTimezone, convertDate } from '../../../common/commonFunctions';
import { Autocomplete, GoogleMap, useLoadScript, Libraries, MarkerF } from '@react-google-maps/api';
import Editor from './components/Editor';
import Modal from '../../../components/Modal/Modal';
import Select from 'react-select';

import './google.css';
import { AnimatePresence, motion } from 'framer-motion';
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
    const changedData: Record<string, any> = Object.entries(eventData as Record<string, any>)
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
      changedData['location'] = location;
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
      formData.append(key, changedData[key]);
    }

    for (const key in changedData) {
      if (['event_name', 'logo', 'title'].includes(key)) {
        sessionStorage.clear();
      }
    }

    editEvent({ eventId, eventData: formData, setFormErrors });
  };

  const agreeToDelete = () => {
    deleteEvent(eventId);
  };

  useEffect(() => {
    if (eventId) getEvent(eventId, setEventTitle, setEventData);
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
  }, [eventData]);

  return (
    <>
      <Theme>
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
                <div className={styles.bannerContainer}>
                  <input
                    type='file'
                    className={styles.fileUpload}
                    accept='image/*'
                    onChange={(e) => setBanner(e.target.files ? e.target.files[0] : null)}
                  />
                  {eventData?.banner && !banner?.name ? (
                    <>
                      <IoCloseOutline
                        className={styles.closeIcon}
                        onClick={() => {
                          setEventData({ ...eventData, banner: '' });
                        }}
                      />
                      <img src={eventData?.banner} alt='' className={styles.banner} />
                    </>
                  ) : (
                    <>
                      {banner?.name ? (
                        <>
                          <IoCloseOutline
                            className={styles.closeIcon}
                            onClick={() => {
                              eventData?.banner && setEventData({ ...eventData, banner: '' });
                              setBanner(null);
                            }}
                          />
                          <img src={URL.createObjectURL(banner)} alt='' className={styles.banner} />
                        </>
                      ) : (
                        <svg height='250' width='100%' className={styles.banner}>
                          {eventTitle && (
                            <>
                              <rect width='100%' height='100%' className={styles.banner} />
                              <text x='25%' y='50%' fill='white' className={styles.svgText}>
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
                  {/* <p
                    className={styles.description}
                    dangerouslySetInnerHTML={{ __html: eventData?.description || '' }}
                  ></p> */}
                  <br />
                  <Editor
                    description={eventData?.description || ''}
                    setNewDescription={setNewDescription}
                  />
                </div>
              </div>

              <div className={styles.leftSideContainer}>
                <div className={styles.container}>
                  <Select
                    options={selectOptions}
                    className={styles.selectDropdown}
                    styles={{
                      ...customStyles,
                      menu: (provided: any) => ({
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
                      setEventData({ ...eventData, status: selectedOption?.label || '' })
                    }
                    value={selectOptions.filter((option) => option.label === eventData?.status)}
                    placeholder={`Select an option`}
                    isSearchable={false}
                  />

                  <textarea
                    placeholder='Event Name'
                    className={styles.inputEventName}
                    onChange={(e) => setEventTitle(e.target.value)}
                    value={eventTitle}
                  />
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
                      value={eventData?.name}
                      onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
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
                            value={dateForDateTimeLocal(eventDate?.start)}
                            onChange={(e) => {
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
                            onChange={(e) =>
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
                            className={styles.dateInput}
                            value={dateForDateTimeLocal(regDate?.start)}
                            onChange={(e) =>
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
                            className={styles.dateInput}
                            value={dateForDateTimeLocal(regDate?.end)}
                            onChange={(e) =>
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
                          borderRadius: '12px 12px 0 0',
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
                              placeholder='Add Event Location'
                              className={styles.inputLocation}
                              value={placeName}
                              onChange={(e) => setPlaceName(e.target.value)}
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
                          setEventData({ ...eventData, is_online: !eventData.is_online })
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
                          setEventData({
                            ...eventData,
                            is_multiple_checkin: !eventData.is_multiple_checkin,
                          })
                        }
                      />
                    </div>
                    <div className={styles.option}>
                      <label>
                        <BsTicketDetailed size={20} color='#949597' /> Allow Multi Ticket
                      </label>
                      <Slider
                        checked={eventData.select_multi_ticket as boolean}
                        text={''}
                        onChange={() =>
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
                            setEventData({
                              ...eventData,
                              is_grouped_ticket: !eventData.is_grouped_ticket,
                            })
                          }
                        />
                      </motion.div>
                    )}
                    <div className={styles.option}>
                      <label>
                        <AiOutlineTeam size={20} color='#949597' /> Allow Team Registration
                      </label>
                      <Slider
                        checked={eventData.is_team as boolean}
                        text={''}
                        onChange={() =>
                          setEventData({
                            ...eventData,
                            is_team: !eventData.is_team,
                          })
                        }
                      />
                    </div>
                    {/* <div className={styles.option}>
                      <label>
                        <PiArrowsSplit size={20} color='#949597' /> Add Sub-Event
                      </label>
                      <Slider
                        checked={eventData.is_sub_event as boolean}
                        text={''}
                        onChange={() =>
                          setEventData({
                            ...eventData,
                            is_sub_event: !eventData.is_sub_event,
                          })
                        }
                      />
                    </div> */}
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
                          value={eventData?.capacity}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            setEventData({
                              ...eventData,
                              capacity: value === 0 ? undefined : value,
                            });
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
                        ) : eventData?.logo ? (
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
                        type='file'
                        className={styles.fileUpload}
                        accept='image/*'
                        onChange={(e) => setLogo(e.target.files ? e.target.files[0] : null)}
                      />
                      <div className={styles.pencil}>
                        <LuPencil size={15} color='#949597' />
                      </div>
                    </div>
                    <IoCloseOutline
                      className={styles.closeIcon}
                      onClick={() => {
                        setLogo(null);
                        setEventData({ ...eventData, logo: '' });
                      }}
                    />
                  </div>
                  <div className={styles.buttonContainer}>
                    <button className={styles.deleteButton} onClick={() => setShowModal(true)}>
                      Delete
                    </button>
                    <button className={styles.createButton} onClick={() => history.back()}>
                      Cancel
                    </button>
                    <button className={styles.createButton} onClick={onSubmit}>
                      Save
                    </button>
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
      </Theme>
    </>
  );
};

export default EditEvent;
