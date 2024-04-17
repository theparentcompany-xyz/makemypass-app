import styles from './CreateEvent.module.css';
import Theme from '../../../components/Theme/Theme';
import { GrLocation } from 'react-icons/gr';
import { createEvent, getEvent } from '../../../apis/events';
import { TbUserCheck } from 'react-icons/tb';
import { BiArrowToTop } from 'react-icons/bi';
import { LuPencil } from 'react-icons/lu';
import { FiGlobe } from 'react-icons/fi';
import { useState } from 'react';

const CreateEvent = () => {
  const [eventTitle, setEventTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("#00753B");
  const submitCreateEvent = () => {
    console.log(eventTitle);

    if (eventTitle) {
      createEvent(eventTitle);
    }
    getEvent("0fbd6882-02f8-4299-9e8c-5010390a7685")
  }


  return (
    <Theme>
      <div className={styles.createEventContainer}>
        <div className={styles.rightSideContainer}>
          <div className={styles.bannerContainer}>
            <svg height="250" width="100%" className={styles.banner} >
              <rect width="100%" height="100%" fill={selectedColor} className={styles.banner} />
              <text x="40%" y="70%" fill="white" className={styles.svgText}>{eventTitle[0]?.toUpperCase() || 'E'}</text>
            </svg>
          </div>
          <div className={styles.descriptionContainer}>
            <p className={styles.eventHeading}>About Event</p>
            <p className={styles.description}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel laboriosam, est, aliquid
              possimus incidunt nulla nisi velit corrupti a, quibusdam amet doloremque facilis
              praesentium. Consectetur repudiandae mollitia recusandae dolorum eum quos perspiciatis
              culpa doloremque asperiores fugiat odio in magni ducimus similique aperiam doloribus
              pariatur voluptatem fuga, blanditiis necessitatibus amet.

            </p>
          </div>
        </div>

        <div className={styles.leftSideContainer}>
          <div className={styles.container}>
            <input type='text' placeholder='Event Name' className={styles.inputEventName} onChange={(e) => setEventTitle(e.target.value)} value={eventTitle} />
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
                  <input type='number' className={styles.capcityInput} placeholder='Unlimited' />
                  <LuPencil size={15} color='#949597' />
                </div>
              </div>
            </div>
            <div className={styles.backgroundOption}>
              <input type='color' className={styles.backgroundColorInput} value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} />
              <label>Background Color</label>
            </div>
            <button className={styles.createButton} onClick={submitCreateEvent}>Create Event</button>
          </div>
        </div>
      </div>
    </Theme>
  );
};

export default CreateEvent;
