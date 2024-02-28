import { useLocation, useNavigate } from 'react-router-dom';
import Theme from '../../../components/Theme/Theme';
import styles from './LandingPage.module.css';
import { useEffect, useRef, useState } from 'react';
import { hostWithUs } from '../../../apis/auth';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { getPublicEvents } from '../../../apis/events';
import EventPartners from './components/EventPartners/EventPartners';
import Hero from './components/Hero/Hero';
import WhyUs from './components/WhyUs/WhyUs';
import Projects from './components/Projects/Projects';

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const [showModal, setShowModal] = useState(false);

  const [events, setEvents] = useState<any[]>([]);
  console.log(events);

  useEffect(() => {
    getPublicEvents(setEvents);

    if (localStorage.getItem('accessToken') && location.pathname === '/') {
      navigate('/events');
    }
  }, []);

  const handleSubmit = async () => {
    if (!nameRef.current?.value || !emailRef.current?.value || !phoneRef.current?.value) {
      toast.error('Please fill all the fields');
      return;
    } else {
      hostWithUs(
        nameRef.current?.value ?? '',
        emailRef.current?.value ?? '',
        phoneRef.current?.value ?? '',
      );
      setShowModal(false);
    }
  };

  const toggleModal = () => {
    setShowModal(() => {
      return !showModal;
    });
  };

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <>
            <div className={styles.backgroundBlur}></div>
            <motion.dialog
              initial={{
                y: 20,
              }}
              animate={{
                y: 0,
              }}
              exit={{
                y: 20,
              }}
              transition={{
                duration: 0.2,
              }}
              className={styles.onClickModal}
            >
              <div className={styles.userInfoModalContainer}>
                <p className={styles.modalHeader}>Loved Our Craft?</p>
                <p className={styles.modalText}>
                  You are just a single click away from scaling you event management experience.
                </p>
                <div className={styles.inputContainers}>
                  <div className={styles.inputContainer}>
                    <p className={styles.inputLabel}>Name</p>
                    <input
                      value={nameRef.current?.value}
                      ref={nameRef}
                      className={styles.input}
                      type='text'
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <p className={styles.inputLabel}>Email</p>
                    <input
                      ref={emailRef}
                      value={emailRef.current?.value}
                      className={styles.input}
                      type='text'
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <p className={styles.inputLabel}>Phone Number</p>
                    <input
                      ref={phoneRef}
                      value={phoneRef.current?.value}
                      className={styles.input}
                      type='text'
                    />
                  </div>
                </div>

                <div className={styles.buttons}>
                  <p
                    onClick={() => {
                      handleSubmit();
                    }}
                    className={styles.button}
                  >
                    Host With Us
                  </p>
                  <p onClick={toggleModal} className={styles.button}>
                    Cancel
                  </p>
                </div>
              </div>
            </motion.dialog>
          </>
        )}
      </AnimatePresence>
      <Theme type='landing'>
        <div className={styles.landingPageContainer}>
          <Hero toggleModal={toggleModal} />
          <EventPartners />
          <div className={styles.secondSection}>
            <p className={styles.ssText}>Save Your Time Managing Events with Us.</p>
            <img src='/app/landing/ssImg.png' alt='' className={styles.ssImg} />
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
              <p className={styles.link}>About Us</p>
              <p className={styles.link}>Contact Us</p>
              <p className={styles.link}>Privacy Policy</p>
              <p className={styles.link}>Terms and Conditions</p>
            </div>
          </div>
        </div>
      </Theme>
    </>
  );
};

export default LandingPage;
