import { Link, useLocation, useNavigate } from 'react-router-dom';
import Theme from '../../../components/Theme/Theme';
import styles from './LandingPage.module.css';
import { useEffect, useRef, useState } from 'react';
import { hostWithUs } from '../../../apis/auth';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { getPublicEvents } from '../../../apis/events';
import EventHeader from '../EventPage/components/EventHeader';

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const [showModal, setShowModal] = useState(false);

  const [events, setEvents] = useState<any[]>([]);

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
                      type='number'
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
                  <p
                    onClick={() => {
                      setShowModal(false);
                    }}
                    className={styles.button}
                  >
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
          <div className={styles.firstSection}>
            <div className={styles.fsTexts}>
              <p className={styles.fsHeading}>
                Exploring the Era! The digital <span>MakeMyPass</span>
              </p>
              <div className={styles.arrowCircle}>
                <img className={styles.arrow} src='/app/landing/arrow.png' alt='' />
                <img className={styles.circle} src='/app/landing/circle.png' alt='' />
              </div>
              <p className={styles.fsSubHeading}>
                The digital era is here and so are we. We are here to make your events digital and
                accessible to everyone.
              </p>
              <button className={styles.requestDemo}>Request Demo</button>
            </div>
            <img src='/app/landing/fsImage.png' alt='' className={styles.fsImage} />
          </div>
        </div>
      </Theme>
    </>
  );
};

export default LandingPage;
