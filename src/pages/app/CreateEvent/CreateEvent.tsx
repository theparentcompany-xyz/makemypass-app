import { useState } from 'react';

import { createEvent } from '../../../apis/events';
import Theme from '../../../components/Theme/Theme';
import InputField from '../../auth/Login/InputField.tsx';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton.tsx';
import styles from './CreateEvent.module.css';

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
            <InputField
              title='Event Name'
              type={'text'}
              name={'name'}
              id={'name'}
              icon={''}
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
          </div>
          <SecondaryButton buttonText='Create Event' onClick={submitCreateEvent} />
        </div>
      </div>
    </Theme>
  );
};

export default CreateEvent;
