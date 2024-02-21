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
          <div className={styles.headerSection}>
            <div className={styles.roundThing}>One Click, One Scan</div>
            <div className={styles.headingText}>
              <p className={styles.mainHeading}>
                <span>Make</span> Your <br /> Passes <span>with Ease</span>
              </p>
              <p className={styles.subHeading}>
                Streamline your pass experience with Make My Pass, a minimalist app for creating,
                managing, and sharing digital passes effortlessly.
              </p>

              <button
                onClick={() => {
                  setShowModal(true);
                }}
                className={styles.launch}
              >
                Host with Us <span>🚀</span>
              </button>

              <img className={styles.landingImage} src='/app/landingImage.webp' />
            </div>
          </div>

          <p className={styles.currentHeading}>
            <span>Our</span> Events
          </p>
          <p className={styles.currentEventsTagline}>
            Listed below are the events that were scaled using Make My Pass. Click on any event to
            know more.
          </p>
          <div className={styles.currentEvents}>
            {events.map((event, index) => {
              return <EventHeader eventData={event} key={index} />;
            })}
          </div>
          <div className={styles.tc}>
            Checkout our&nbsp;
            <Link to='/termsandconditions'>
              <p className={styles.terms}>Terms & Conditions&nbsp; </p>
            </Link>
            and&nbsp;
            <Link to='/privacypolicy'>
              <p className={styles.privacy}>Privacy Policy</p>
            </Link>
          </div>
        </div>
      </Theme>
    </>
  );
};

export default LandingPage;
