import { Link, useLocation, useNavigate } from 'react-router-dom';
import Theme from '../../../components/Theme/Theme';
import styles from './LandingPage.module.css';
import { useEffect } from 'react';
import EventPartners from './components/EventPartners/EventPartners';
import Hero from './components/Hero/Hero';
import WhyUs from './components/WhyUs/WhyUs';
import Projects from './components/Projects/Projects';

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem('accessToken') && location.pathname === '/') {
      navigate('/events');
    }
  }, []);

  return (
    <>
      <Theme type='landing'>
        <div className={styles.landingPageContainer}>
          <Hero />
          <EventPartners />
          <div className={styles.secondSection}>
            <p className={styles.ssText}>Erase the Hassle with Our Ticketing Magic!</p>
            <img
              src='/app/landing/ssImg.webp'
              alt='image showing the table ui of makemypass'
              className={styles.ssImg}
            />
          </div>
          <WhyUs />
          <Projects />
          <div className={styles.footerContainer}>
            <div className={styles.fLogoText}>
              <img src='/app/logoText.webp' alt='' className={styles.fLogo} />
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
