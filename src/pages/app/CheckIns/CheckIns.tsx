import { useEffect, useState } from 'react';
import { BsGift, BsQrCodeScan } from 'react-icons/bs';
import { FaShop } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

import { getCheckInButtons } from '../../../apis/scan';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import SectionButton from '../../../components/SectionButton/SectionButton';
import Theme from '../../../components/Theme/Theme';
import styles from './CheckIns.module.css';
import type { checkInButtonsType } from './types.d.ts';

const CheckIns = () => {
  const [checkInsButtons, setCheckInsButtons] = useState<checkInButtonsType>();
  const eventId = JSON.parse(sessionStorage.getItem('eventData')!).event_id;
  useEffect(() => {
    getCheckInButtons(eventId, setCheckInsButtons);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Theme>
      <DashboardLayout prevPage="/events" tabName="checkins">
        <div className={styles.checkInsButtons}>
          <p className={styles.checkInsHeading}>On-Site Event Management</p>
          <hr className={styles.line} />
          <div className={styles.buttons}>
            <div className="row">
              {checkInsButtons?.checkin && (
                <Link to="checkin/scan">
                  <SectionButton
                    buttonText="Check-In User"
                    buttonColor="#C33D7B"
                    icon={<BsQrCodeScan size={25} color="#5B75FB" />}
                  />
                </Link>
              )}
              {checkInsButtons?.venues && (
                <Link to="checkin/venue">
                  <SectionButton
                    buttonText="Venue Check-In"
                    buttonColor="#C33D7B"
                    icon={<FaShop size={25} color="#5B75FB" />}
                  />
                </Link>
              )}
              {checkInsButtons?.checkout && (
                <Link to="checkin/checkout">
                  <SectionButton
                    buttonText="Check-Out User"
                    buttonColor="#C33D7B"
                    icon={<BsQrCodeScan size={25} color="#5B75FB" />}
                  />
                </Link>
              )}
              {checkInsButtons?.gift && (
                <Link to="checkin/gifts">
                  <SectionButton
                    buttonText="Gifts"
                    buttonColor="#C33D7B"
                    icon={<BsGift size={25} color="#5B75FB" />}
                  />
                </Link>
              )}
              {import.meta.env.VITE_CURRENT_ENV === 'dev' && (
                <Link to="self-checkin">
                  <SectionButton
                    buttonText="Print Ticket"
                    buttonColor="#C33D7B"
                    icon={<BsGift size={25} color="#5B75FB" />}
                  />
                </Link>
              )}
              {checkInsButtons?.perk && (
                <Link to="perks">
                  <SectionButton
                    buttonText="Perks"
                    buttonColor="#C33D7B"
                    icon={<BsGift size={25} color="#5B75FB" />}
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
      </DashboardLayout>
    </Theme>
  );
};

export default CheckIns;
