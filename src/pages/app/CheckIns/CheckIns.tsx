import Theme from '../../../components/Theme/Theme';
import Glance from '../Overview/components/Glance/Glance';
import Header from '../Overview/components/Header/Header';
import styles from './CheckIns.module.css';

import SectionButton from '../../../components/SectionButton/SectionButton';
import { HiUserGroup } from 'react-icons/hi2';
import { BsQrCodeScan } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const CheckIns = () => {
  const [role, setRole] = useState('');
  return (
    <Theme>
      <div className={styles.checkInsContainer}>
        <Header setRole={setRole} />
        <Glance tab='checkins' />
        <div className={styles.checkInsButtons}>
          <p className={styles.checkInsHeading}>On-Site Event Management</p>
          <hr className={styles.line} />
          <div className={styles.buttons}>
            <div className='row'>
              {role === 'Admin' && (
                <Link to='checkin'>
                  <SectionButton
                    buttonText='Check-In'
                    buttonColor='#C33D7B'
                    icon={<HiUserGroup size={25} color='#7662FC' />}
                  />
                </Link>
              )}
              <Link to='checkin/scan'>
                <SectionButton
                  buttonText='Scan User'
                  buttonColor='#C33D7B'
                  icon={<BsQrCodeScan size={25} color='#5B75FB' />}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Theme>
  );
};

export default CheckIns;
