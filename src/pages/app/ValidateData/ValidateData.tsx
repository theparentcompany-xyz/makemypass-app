import { useEffect, useState } from 'react';
import { MdError } from 'react-icons/md';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import { useSearchParams } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

import { verifyParticipant } from '../../../apis/validate';
import Theme from '../../../components/Theme/Theme';
import styles from './ValidateData.module.css';

const ValidateData = () => {
  const [searchParams] = useSearchParams();
  const verificationCode = searchParams.get('verificationCode');

  type VerifiedType = {
    isVerified: boolean;
    error: boolean;
    errorMsg?: string;
  };

  const [verified, setVerified] = useState<VerifiedType>({
    isVerified: false,
    error: false,
  });

  useEffect(() => {
    if (verificationCode) {
      verifyParticipant(verificationCode, setVerified);
    }
  }, [verificationCode]);

  return (
    <Theme>
      <div className={styles.validateContainer}>
        {verified.isVerified ? (
          <RiVerifiedBadgeFill color='#47c97e' size={75} />
        ) : verified.error ? (
          <MdError color='#f04b4b' size={50} />
        ) : (
          <HashLoader color='#47c97e' size={50} />
        )}
        <p className={styles.errorMessage}>
          {verified.error && verified.errorMsg ? verified.errorMsg : ''}
        </p>
        <p className={styles.helperText}>
          {verified.isVerified
            ? 'Data verified. You can continue to fill the form'
            : verified.error
              ? 'There was an error verifying your data.'
              : 'Verifying your data...'}
        </p>
      </div>
    </Theme>
  );
};

export default ValidateData;
