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
        </div>
      </Theme>
    </>
  );
};

export default LandingPage;
