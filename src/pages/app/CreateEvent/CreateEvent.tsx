import styles from './CreateEvent.module.css';
import Theme from '../../../components/Theme/Theme';
import { createEvent } from '../../../apis/events';
import InputFIeld from '../../../pages/auth/Login/InputFIeld';
import { useState } from 'react';

const CreateEvent = () => {
  const [eventTitle, setEventTitle] = useState('');
  const submitCreateEvent = () => {
    if (eventTitle) {
      createEvent(eventTitle);
    }
  };

  return (
    <Theme>
      <div className={styles.createEventContainer}>
        <div className={styles.inputContainer}>
          <h1 className={styles.heading}>Create Event</h1>
          <div className={styles.eventInput}>
            <InputFIeld
              placeholder='Event Name'
              type={'text'}
              name={'name'}
              id={'name'}
              icon={''}
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
          </div>
          <button className={styles.createButton} onClick={submitCreateEvent}>
            Create Event
          </button>
        </div>
      </div>
    </Theme>
  );
};

export default CreateEvent;
