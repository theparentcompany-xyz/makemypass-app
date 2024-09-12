import { useState } from 'react';

import { EventType } from '../../../../../apis/types';
import Theme from '../../../../../components/Theme/Theme';
import type { SuccessModalProps } from '../../types';
import SuccessModal from '../SuccessModal/SuccessModal';
import styles from './ThanksYouPage.module.css';

const ThankYouPage = () => {
  const [success, setSuccess] = useState<SuccessModalProps>(
    JSON.parse(localStorage.getItem('successData') || '{}'),
  );
  const eventData: EventType = JSON.parse(sessionStorage.getItem('eventData') || '{}');

  return (
    <Theme>
      <div className={styles.thankyouContainer}>
        <SuccessModal
          setSuccess={setSuccess}
          success={success}
          hasScratchCard={eventData?.is_scratch_card}
        />
      </div>
    </Theme>
  );
};

export default ThankYouPage;
