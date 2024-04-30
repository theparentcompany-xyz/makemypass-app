import styles from './EditEvent.module.css';
import Theme from '../../../components/Theme/Theme';
import { customStyles } from '../EventPage/constants';
import { GrLocation } from 'react-icons/gr';
import { getEvent, editEvent } from '../../../apis/events';
import { TbUserCheck, TbWorld } from 'react-icons/tb';
import { TbMailStar } from 'react-icons/tb';
import { BiArrowToTop } from 'react-icons/bi';
import { LuPencil } from 'react-icons/lu';
import { FiGlobe } from 'react-icons/fi';
import { useEffect, useRef, useState, useMemo } from 'react';
import { HashLoader } from 'react-spinners';
import { EventType } from '../../../apis/types';
import Slider from '../../../components/SliderButton/Slider';
import { getCurrentTimezone, convertDate } from '../../../common/commonFunctions';
import { Autocomplete, GoogleMap, useLoadScript, Libraries, MarkerF } from '@react-google-maps/api';
import Editor from './components/Editor';
import Select from 'react-select';

import './google.css';
const libraries: Libraries = ['places'];

const EditEvent = () => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [eventTitle, setEventTitle] = useState('');
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
      if (place.geometry) {
        setLocation({
          lat: place.geometry.location?.lat() || 0,
          lng: place.geometry.location?.lng() || 0,
        });
      }
    }
  };
  const onMapClick = (event: google.maps.MapMouseEvent) => {
    setLocation({ lat: event.latLng?.lat()!, lng: event.latLng?.lng()! });
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
      .filter(([key, value]) => fetchedEvent?.[key as keyof EventType] !== value)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    if (eventTitle !== eventData?.title) changedData['title'] = eventTitle;
    if (newDescription !== eventData?.description) changedData['description'] = newDescription;
    if (convertDate(eventDate?.start) !== fetchedEvent?.event_start_date)
      changedData['event_start_date'] = convertDate(eventDate?.start);
    if (convertDate(eventDate?.end) !== fetchedEvent?.event_end_date)
      changedData['event_end_date'] = convertDate(eventDate?.end);
    if (convertDate(regDate?.start) !== fetchedEvent?.reg_start_date)
      changedData['reg_start_date'] = convertDate(regDate?.start);
    if (convertDate(regDate?.end) !== fetchedEvent?.reg_end_date)
      changedData['reg_end_date'] = convertDate(regDate?.end);
    if (placeName && placeName !== fetchedEvent?.place) changedData['place'] = placeName;
    if (
      location?.lat !== fetchedEvent?.location?.lat ||
      location?.lng !== fetchedEvent?.location?.lng
    )
      changedData['location'] = location;
    if (logo) changedData['logo'] = logo;
    if (banner) changedData['banner'] = banner;

    editEvent(eventId, changedData);
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
          <div className={styles.createEventContainer}>
            <div className={styles.rightSideContainer}>
              <div className={styles.bannerContainer}>
                {eventData?.banner ? (
                  <img src={eventData?.banner} alt='' className={styles.banner} />
                ) : (
                  <>
                    <input
                      type='file'
                      className={styles.fileUpload}
                      accept='image/*'
                      onChange={(e) => setBanner(e.target.files ? e.target.files[0] : null)}
                    />
                    {banner?.name ? (
                      <img src={URL.createObjectURL(banner)} alt='' className={styles.banner} />
                    ) : (
                      <svg height='250' width='100%' className={styles.banner}>
                        {eventTitle && (
                          <>
                            <rect width='100%' height='100%' className={styles.banner} />
                            <text x='25%' y='50%' fill='white' className={styles.svgText}>
                              No Banner. Click Here to Upload
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
                <div className={styles.urlContainer}>
                  <label>Public URL: makemypass.com/</label>
                  <input
                    type='text'
                    className={styles.urlInput}
                    placeholder='event-url'
                    value={eventData?.name}
                    onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
                  />
                </div>

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
                              end: eventDate?.end!,
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
                              start: eventDate?.start!,
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
                              end: regDate?.end!,
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
                              start: regDate?.start!,
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
                <p className={styles.eventOptions}>Event Options</p>
                <div className={styles.optionsContainer}>
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
                        onChange={(e) =>
                          setEventData({ ...eventData, capacity: Number(e.target.value) })
                        }
                      />
                      <LuPencil size={15} color='#949597' />
                    </div>
                  </div>
                </div>
                <div className={styles.backgroundOption}>
                  {/* <input
                      type='color'
                      className={styles.backgroundColorInput}
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                    />
                    <label>Background Color</label> */}
                </div>

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

                <div className={styles.buttonContainer}>
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
