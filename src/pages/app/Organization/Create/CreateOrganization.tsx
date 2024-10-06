import { useState } from 'react';

import { createOrg } from '../../../../apis/orgs';
import Theme from '../../../../components/Theme/Theme';
import InputField from '../../../auth/Login/InputField';
import SecondaryButton from '../../Overview/components/SecondaryButton/SecondaryButton';
import styles from './CreateOrganization.module.css';

const CreateOrganization = () => {
  const [eventTitle, setEventTitle] = useState('');
  const submitCreateEvent = () => {
    if (eventTitle) {
      createOrg(eventTitle);
    }
  };

  return (
    <Theme>
      <div className={styles.createEventContainer}>
        <div className={styles.inputContainer}>
          <div className={styles.eventInput}>
            <InputField
              placeholder='Organization Name'
              type={'text'}
              name={'name'}
              id={'name'}
              icon={''}
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
          </div>
          <SecondaryButton buttonText='Create Organization' onClick={submitCreateEvent} />
        </div>
      </div>
    </Theme>
  );
};

export default CreateOrganization;
