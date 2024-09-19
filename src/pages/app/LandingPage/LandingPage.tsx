import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Theme from '../../../components/Theme/Theme';
import EventPartners from './components/EventPartners/EventPartners';
import Hero from './components/Hero/Hero';
// import WhyUs from './components/WhyUs/WhyUs';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem('accessToken') && location.pathname === '/') {
      navigate('/events');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Theme type='landing'>
        <div className={styles.landingPageContainer}>
          <Hero />

          <EventPartners />

          <div className={styles.secondSection}>
            <div className={styles.fsTexts}>
              <p
                className={styles.didyouknow}
                style={{
                  display: 'inline-block',
                  transform: 'rotate(-2deg)',
                  marginRight: '1rem',
                }}
              >
                DID YOU KNOW?
              </p>
              <p className={styles.ssHeading}>
                <span
                  style={{
                    display: 'inline-block',
                    transform: 'rotate(-2deg)',
                    marginRight: '1rem',
                  }}
                >
                  {' '}
                  17+ Hours
                </span>
                of Your Time is Wasted/Event
              </p>
            </div>
            <ul className={styles.timeWastedContainer}>
              <li>
                <span>+ 4 hrs</span> Sending emails to users at various points.
              </li>
              <li>
                <span>+ 3 hrs</span> Sending custom tickets to the participants.
              </li>
              <li>
                <span>+ 3 hrs</span> Generating event statistics from CSVs. using Excel
              </li>
              <li>
                <span>+ 2 hrs</span> Distribution of event materials to the attendees.
              </li>
              <li>
                <span>+ 3 hrs</span> Setting up attendee check-ins at the venue.
              </li>
              <li>
                <span>+ 2 hrs</span> Managing on-site attendance and ticket sales.
              </li>
            </ul>
          </div>

          <p className={styles.theEasyWay}>↓ Let's do it the easy way!</p>
        </div>
      </Theme>
    </>
  );
};

export default LandingPage;
