import { useLocation, useNavigate } from 'react-router-dom';
import Theme from '../../../components/Theme/Theme';
import styles from './LandingPage.module.css';
import { useEffect, useRef, useState } from 'react';
import { hostWithUs } from '../../../apis/auth';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { getPublicEvents } from '../../../apis/events';
import EventPartners from './components/EventPartners/EventPartners';

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const boxShadowVariants = {
    hover: {
      boxShadow: '9.146px 7.622px 0px 0px #000',
      x: '5px',
      y: '5px',
    },
  };

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
                <motion.div initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}>
                  <img className={styles.arrow} src='/app/landing/arrow.png' alt='' />
                </motion.div>
                <img className={styles.circle} src='/app/landing/circle.png' alt='' />
              </div>
              <p className={styles.fsSubHeading}>
                The digital era is here and so are we. We are here to make your events digital and
                accessible to everyone.
              </p>
              <motion.button
                className={styles.requestDemo}
                whileHover='hover'
                variants={boxShadowVariants}
                initial={false}
              >
                Request Demo
              </motion.button>
            </div>
            <img src='/app/landing/fsImage.png' alt='' className={styles.fsImage} />
          </div>
          <EventPartners />
          <div className={styles.secondSection}>
            <p className={styles.ssText}>Save Your Time Managing Events with Us.</p>
            <img src='/app/landing/ssImg.png' alt='' className={styles.ssImg} />
          </div>
          <div className={styles.thirdSection}>
            <div className={styles.tsTexts}>
              <p className={styles.tsHeading}>Why Us?</p>
              <div className={styles.tsPoints}>
                <div className={styles.tsPoint}>
                  <p className={styles.tsHeading}>5+</p>
                  <p className={styles.tsText}>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda totam nobis,
                    rerum quaerat ipsa iste!
                  </p>
                </div>
                <div className={styles.tsPoint}>
                  <p className={styles.tsHeading}>100+</p>
                  <p className={styles.tsText}>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda totam nobis,
                    rerum quaerat ipsa iste!
                  </p>
                </div>
                <div className={styles.tsPoint}>
                  <p className={styles.tsHeading}>12K+</p>
                  <p className={styles.tsText}>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda totam nobis,
                    rerum quaerat ipsa iste!
                  </p>
                </div>
              </div>
            </div>
            <img src='/app/landing/tsImg.png' alt='' className={styles.tsImg} />
          </div>
          <div className={styles.projectsSection}>
            <div className={styles.projectsHeading}>
              <p className={styles.projectsHeadingText}>Our Projects</p>
            </div>
            <div className={styles.projectsListing}>
              <div className={styles.project}>
                <div className={styles.projectDateDay}>
                  <p className={styles.projectDate}>2nd Feb 2024</p>
                  <p className={styles.projectDay}>Wednesday</p>
                </div>
                <div className={styles.projectDetails}>
                  <div className={styles.projectTexts}>
                    <p className={styles.projectHeading}>Scale Up Conclave 2024</p>
                    <p className={styles.projectText}>
                      The standard "Lorem ipsum" text starts with "Lorem ipsum dolor sit amet,{' '}
                    </p>
                  </div>
                  <div className={styles.projectImages}>
                    <img
                      src='https://via.placeholder.com/150'
                      alt=''
                      className={styles.projectImage}
                    />
                    <img
                      src='https://via.placeholder.com/150'
                      alt=''
                      className={styles.projectImage}
                    />
                    <img
                      src='https://via.placeholder.com/150'
                      alt=''
                      className={styles.projectImage}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.project}>
                <div className={styles.projectDateDay}>
                  <p className={styles.projectDate}>2nd Feb 2024</p>
                  <p className={styles.projectDay}>Wednesday</p>
                </div>
                <div className={styles.projectDetails}>
                  <div className={styles.projectTexts}>
                    <p className={styles.projectHeading}>Scale Up Conclave 2024</p>
                    <p className={styles.projectText}>
                      The standard "Lorem ipsum" text starts with "Lorem ipsum dolor sit amet,{' '}
                    </p>
                  </div>
                  <div className={styles.projectImages}>
                    <img
                      src='https://via.placeholder.com/150'
                      alt=''
                      className={styles.projectImage}
                    />
                    <img
                      src='https://via.placeholder.com/150'
                      alt=''
                      className={styles.projectImage}
                    />
                    <img
                      src='https://via.placeholder.com/150'
                      alt=''
                      className={styles.projectImage}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.project}>
                <div className={styles.projectDateDay}>
                  <p className={styles.projectDate}>2nd Feb 2024</p>
                  <p className={styles.projectDay}>Wednesday</p>
                </div>
                <div className={styles.projectDetails}>
                  <div className={styles.projectTexts}>
                    <p className={styles.projectHeading}>Scale Up Conclave 2024</p>
                    <p className={styles.projectText}>
                      The standard "Lorem ipsum" text starts with "Lorem ipsum dolor sit amet,{' '}
                    </p>
                  </div>
                  <div className={styles.projectImages}>
                    <img
                      src='https://via.placeholder.com/150'
                      alt=''
                      className={styles.projectImage}
                    />
                    <img
                      src='https://via.placeholder.com/150'
                      alt=''
                      className={styles.projectImage}
                    />
                    <img
                      src='https://via.placeholder.com/150'
                      alt=''
                      className={styles.projectImage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
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
