import Theme from '../../../components/Theme/Theme';
import Glance from '../../../components/Glance/Glance';
import Header from '../../../components/EventHeader/EventHeader';
import styles from './CheckIns.module.css';

import SectionButton from '../../../components/SectionButton/SectionButton';
import { BsQrCodeScan } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { FaShop } from 'react-icons/fa6';
// import { IoGiftSharp } from 'react-icons/io5';
// import { SiNextra } from 'react-icons/si';

const CheckIns = () => {
  return (
    <Theme>
      <div className={styles.checkInsContainer}>
        <Header />
        <Glance tab='checkins' />
        <div className={styles.checkInsButtons}>
          <p className={styles.checkInsHeading}>On-Site Event Management</p>
          <hr className={styles.line} />
          <div className={styles.buttons}>
            <div className='row'>
              <Link to='checkin/scan'>
                <SectionButton
                  buttonText='Scan User'
                  buttonColor='#C33D7B'
                  icon={<BsQrCodeScan size={25} color='#5B75FB' />}
                />
              </Link>
              <Link to='checkin/venue'>
                <SectionButton
                  buttonText='Venue Check-In'
                  buttonColor='#C33D7B'
                  icon={<FaShop size={25} color='#5B75FB' />}
                />
              </Link>
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
