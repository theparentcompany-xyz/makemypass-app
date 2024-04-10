import Theme from '../../../components/Theme/Theme';

import styles from './EventGlance.module.css';
import Glance from '../../../components/Glance/Glance';
import { IoLocationOutline } from 'react-icons/io5';
import banner from './banner.png';
import { HiUserGroup } from 'react-icons/hi2';
import { FaWrench } from 'react-icons/fa6';
import { BsQrCodeScan } from 'react-icons/bs';

import SectionButton from '../../../components/SectionButton/SectionButton';
import { LuClock, LuPencil } from 'react-icons/lu';

const EventGlance = () => {
  const hardcodedData = {
    title: 'Grand Tech Adventure : CodeStorm',
    hosts: [
      { name: 'Host 1', profile_pic: 'https://via.placeholder.com/30' },
      { name: 'Host 2', profile_pic: 'https://via.placeholder.com/30' },
    ],
    start_date: '2022-01-01',
    start_time: '10:00 AM',
    end_time: '12:00 PM',
    end_date: '2022-01-01',
    place: 'Hardcoded Event Place',
  };

  return (
    <Theme>
      <div className={styles.eventGlanceContainer}>
        <div className={styles.glanceContainer}>
          <Glance tab='manage' />
        </div>

        <div className={styles.eventGlance}>
          <div className={styles.bannerContainer}>
            <img src={banner} alt='' className={styles.banner} />
            <div>
              <div className={styles.headingTexts}>
                <p className={styles.eventTitle}>{hardcodedData.title}</p>
                <p className={styles.hostedByText}>Hosted by GTech Mulearn</p>
              </div>

              <div className={styles.eventDatePlace}>
                <div className={styles.eventDate}>
                  <div className={styles.dateBox}>
                    <p className={styles.eventMonth}>Jan</p>
                    <p className={styles.eventDateNum}>1</p>
                  </div>
                  <div className={styles.eventDateTimeText}>
                    <p className={styles.eventDateText}>Saturday, August 19, 2023</p>
                    <p className={styles.eventTimeText}>8:30 AM - Aug 20, 7:00 PM GMT+5:30</p>
                  </div>
                </div>
                <div className={styles.eventPlace}>
                  <div className={styles.locationBox}>
                    <IoLocationOutline size={25} className={styles.locationIcon} />
                  </div>
                  <div className={styles.eventDateTimeText}>
                    <p className={styles.eventDateText}>KMEA Engineering College</p>
                    <p className={styles.eventTimeText}>Aluva, Kerala</p>
                  </div>
                </div>
                <div className={styles.buttons}>
                  <button className={styles.shareEventButton}>Share Event</button>
                  <button className={styles.editEventButton}>Edit Event</button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.sectionButtons}>
            <SectionButton
              buttonText='Guest List'
              buttonColor='#7662FC'
              icon={<HiUserGroup size={25} color='#7662FC' />}
            />

            <SectionButton
              buttonText='Host List'
              buttonColor='#C33D7B'
              icon={<FaWrench size={25} color='#C33D7B' />}
            />

            <SectionButton
              buttonText='Check In'
              buttonColor='#5B75FB'
              icon={<BsQrCodeScan size={25} color='#5B75FB' />}
            />
          </div>

          <div className={styles.sendMailsContainer}>
            <div className={styles.sendMailsText}>
              <p className={styles.sendMailsHeading}>Send Mails</p>
              <p className={styles.sendMailsSubHeading}>Send Mails to participants </p>
            </div>
            <div className={styles.scheduleContainer}>
              <div className={styles.scheduleBox}>
                <div className='row'>
                  <LuClock color='#939597' size={20} className={styles.scheduleIcon} />
                  <div className={styles.scheduleText}>
                    <p className={styles.scheduleHeading}>⏰ Final is starting tomorrow</p>
                    <p className={styles.scheduleSubHeading}>
                      To: Going · <span>Scheduled: Apr 9, 11:00 PM</span>
                    </p>
                  </div>
                </div>
                <LuPencil color='#939597' size={20} className={styles.scheduleIcon} />
              </div>
              <div className={styles.scheduleBox}>
                <div className='row'>
                  <LuClock color='#939597' size={20} className={styles.scheduleIcon} />
                  <div className={styles.scheduleText}>
                    <p className={styles.scheduleHeading}>⏰ Final is starting tomorrow</p>
                    <p className={styles.scheduleSubHeading}>
                      To: Going · <span>Scheduled: Apr 9, 11:00 PM</span>
                    </p>
                  </div>
                </div>
                <LuPencil color='#939597' size={20} className={styles.scheduleIcon} />
              </div>
              <div className={styles.scheduleBox}>
                <div className='row'>
                  <LuClock color='#939597' size={20} className={styles.scheduleIcon} />
                  <div className={styles.scheduleText}>
                    <p className={styles.scheduleHeading}>⏰ Final is starting tomorrow</p>
                    <p className={styles.scheduleSubHeading}>
                      To: Going · <span>Scheduled: Apr 9, 11:00 PM</span>
                    </p>
                  </div>
                </div>
                <LuPencil color='#939597' size={20} className={styles.scheduleIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Theme>
  );
};

export default EventGlance;
