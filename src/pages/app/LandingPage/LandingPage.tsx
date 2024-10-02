import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Theme from '../../../components/Theme/Theme';
import EventPartners from './components/EventPartners/EventPartners';
import Hero from './components/Hero/Hero';
import PricingSection from './components/PricingCards/PricingCards';
import TestimonialSection from './components/TestimonialSection/TestimonialSection';
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
                <span>+ 3 hrs</span> Generating event statistics from CSVs.
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

          <div className={styles.thirdSection}>
            <div className={styles.tsTexts}>
              <p className={styles.tsHeading}>
                You Can Send Custom{' '}
                <span
                  style={{
                    display: 'inline-block',
                    transform: 'rotate(-2deg)',
                    marginRight: '1rem',
                  }}
                >
                  {' '}
                  Mails & Tickets,
                </span>
                and Even{' '}
                <span
                  style={{
                    display: 'inline-block',
                    transform: 'rotate(-2deg)',
                    marginRight: '1rem',
                  }}
                >
                  {' '}
                  Schedule Them.
                </span>
              </p>
              <p className={styles.tsSubHeading}>
                We had to revamp our previous landing page because it didn't communicate the value,
                similarly, communication is key to any successful event. Why do it the hard way when
                you can do it the easy way?
              </p>
              <p className={styles.theEasyWay}>
                We've already send 34,563+ emails and 15,345+ tickets for our users.
              </p>
            </div>

            <img
              src='/app/landing/tickets.png'
              alt='features of makemypass.com'
              className={styles.tsImage}
            />
          </div>

          <div className={styles.thirdSection}>
            <a
              href='https://makemypass.com/override.py/public/insights'
              target='_blank'
              rel='noopener noreferrer'
            >
              <img
                src='/app/landing/tsImg.webp'
                alt='features of makemypass.com'
                className={styles.frsImage}
                loading='lazy'
              />
            </a>
            <div className={styles.frsTexts}>
              <p className={styles.frHeading}>
                Looking at CSVs aren't Insightful. <br />
                <span
                  style={{
                    display: 'inline-block',
                    transform: 'rotate(-2deg)',
                    marginRight: '1rem',
                  }}
                >
                  {' '}
                  But We Have
                </span>
                Something{' '}
                <span
                  style={{
                    display: 'inline-block',
                    transform: 'rotate(-2deg)',
                    marginRight: '1rem',
                  }}
                >
                  {' '}
                  Insighful
                </span>
              </p>
              <p className={styles.frSubHeading}>
                Insights Tada!, Who doesn't love having a graphical view at their data?. What if
                they are realtime. You guessed it. We've got it too.
              </p>
              <p className={styles.theEasyWay}>
                Try clicking the image aside, whoo know what it beholds.
              </p>
            </div>
          </div>

          <div className={styles.thirdSection}>
            <div className={styles.tsTexts}>
              <p className={styles.tsHeading}>
                Just Like That, You Can{' '}
                <span
                  style={{
                    display: 'inline-block',
                    transform: 'rotate(-2deg)',
                    marginRight: '1rem',
                  }}
                >
                  {' '}
                  Check In
                </span>
                Attendees. Yeah{' '}
                <span
                  style={{
                    display: 'inline-block',
                    transform: 'rotate(-2deg)',
                    marginRight: '1rem',
                  }}
                >
                  Just 3 Clicks.
                </span>
              </p>
              <p className={styles.tsSubHeading}>
                One of the biggest time consuming thing is checkin, but not anymore. Just 3 clicks
                and you're done. No more long queues.
              </p>
            </div>

            <img
              src='/app/landing/scanning.webp'
              alt='features of makemypass.com'
              className={styles.frsImage}
              loading='lazy'
            />
          </div>

          <div className={styles.tsTexts}>
            <p className={styles.tsHeading}>
              MakeMyPass is{' '}
              <span
                style={{
                  display: 'inline-block',
                  transform: 'rotate(-2deg)',
                  marginRight: '1rem',
                }}
              >
                {' '}
                Ready,
              </span>
              <br />
              Are You?{' '}
              <span
                style={{
                  display: 'inline-block',
                  transform: 'rotate(-2deg)',
                  marginRight: '1rem',
                }}
              >
                {' '}
                Let's Get Started.
              </span>
            </p>
          </div>
          <PricingSection />
          <div className={styles.tsTexts}>
            <p className={styles.tsHeading}>
              Don't Believe Us{' '}
              <span
                style={{
                  display: 'inline-block',
                  transform: 'rotate(-2deg)',
                  marginRight: '1rem',
                }}
              >
                Hear
              </span>
              <br />
              From{' '}
              <span
                style={{
                  display: 'inline-block',
                  transform: 'rotate(-2deg)',
                  marginRight: '1rem',
                }}
              >
                {' '}
                Our Users.
              </span>
            </p>
          </div>
          <TestimonialSection />
          <div className={styles.footerContainer}>
            <div className={styles.fLogoText}>
              <img src='/app/logoText.webp' alt='' className={styles.fLogo} loading='lazy' />
              <p className={styles.fText}>MakeMyPass</p>
            </div>
            <p className={styles.location}>Thiruvanathapuram, Kerala, India</p>
            <div className={styles.otherLinks}>
              <Link to='/privacypolicy'>
                <p className={styles.link}>Privacy Policy</p>
              </Link>
              <Link to='/termsandconditions'>
                <p className={styles.link}>Terms and Conditions</p>
              </Link>
            </div>
          </div>
        </div>
      </Theme>
    </>
  );
};

export default LandingPage;
