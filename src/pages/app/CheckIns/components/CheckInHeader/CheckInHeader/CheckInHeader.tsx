import { Link, useNavigate } from 'react-router-dom';
import styles from './CheckInHeader.module.css';
import { BsQrCodeScan } from 'react-icons/bs';

import SectionButton from '../../../../../../components/SectionButton/SectionButton';
import { BiCalendarMinus } from 'react-icons/bi';

const CheckInHeader = ({
  currentCount,
  buttonType,
}: {
  currentCount?: number;
  buttonType?: string;
}) => {
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.checkInHeader}>
        <button
          onClick={() => {
            navigate(-1);
          }}
          className={styles.backButton}
        >
          {'<'}
        </button>
        <p className={styles.checkInHeading}>Check In</p>
      </div>

      <div className={styles.checkInActions}>
        {buttonType != 'back' && (
          <Link to='scan'>
            <SectionButton
              buttonText='Scan QR Code'
              buttonColor='#C33D7B'
              icon={<BsQrCodeScan size={25} color='#5B75FB' />}
            />
          </Link>
        )}

        {currentCount && (
          <div className={styles.checkInGlance}>
            <p className={styles.checkInGlanceHeader}>Check In at a Glance</p>
            <p className={styles.guests}>
              {currentCount} <span>Guests</span>
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CheckInHeader;
