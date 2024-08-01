import Theme from '../../../components/Theme/Theme';
import Glance from '../../../components/Glance/Glance';
import Header from '../../../components/EventHeader/EventHeader';
import styles from './CheckIns.module.css';

import SectionButton from '../../../components/SectionButton/SectionButton';
import { BsGift, BsQrCodeScan } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { FaShop } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { getCheckInButtons } from '../../../apis/scan';
import { checkInButtonsType } from './types';

const CheckIns = () => {
  const [checkInsButtons, setCheckInsButtons] = useState<checkInButtonsType>();
  const eventId = JSON.parse(sessionStorage.getItem('eventData')!).event_id;
  useEffect(() => {
    getCheckInButtons(eventId, setCheckInsButtons);
  }, []);

  return (
    <Theme>
      <div className={styles.checkInsContainer}>
        <Header previousPageNavigate='/events' />
        <Glance tab='checkins' />
        <div className={styles.checkInsButtons}>
          <p className={styles.checkInsHeading}>On-Site Event Management</p>
          <hr className={styles.line} />
          <div className={styles.buttons}>
            <div className='row'>
              {checkInsButtons?.checkin && (
                <Link to='checkin/scan'>
                  <SectionButton
                    buttonText='Check-In User'
                    buttonColor='#C33D7B'
                    icon={<BsQrCodeScan size={25} color='#5B75FB' />}
                  />
                </Link>
              )}
              {checkInsButtons?.venues && (
                <Link to='checkin/venue'>
                  <SectionButton
                    buttonText='Venue Check-In'
                    buttonColor='#C33D7B'
                    icon={<FaShop size={25} color='#5B75FB' />}
                  />
                </Link>
              )}
              {checkInsButtons?.checkout && (
                <Link to='checkin/checkout'>
                  <SectionButton
                    buttonText='Check-Out User'
                    buttonColor='#C33D7B'
                    icon={<BsQrCodeScan size={25} color='#5B75FB' />}
                  />
                </Link>
              )}
              {checkInsButtons?.gift && (
                <Link to='checkin/gifts'>
                  <SectionButton
                    buttonText='Gifts'
                    buttonColor='#C33D7B'
                    icon={<BsGift size={25} color='#5B75FB' />}
                  />
                </Link>
              )}
              {/* <Link to='claimgifts'>
                <SectionButton
                  buttonText='Claim Gifts'
                  buttonColor='#C33D7B'
                  icon={<IoGiftSharp size={25} color='#5B75FB' />}
                />
              </Link>
              <Link to='perks'>
                <SectionButton
                  buttonText='Perks'
                  buttonColor='#C33D7B'
                  icon={<SiNextra size={25} color='#5B75FB' />}
                />
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </Theme>
  );
};

export default CheckIns;
