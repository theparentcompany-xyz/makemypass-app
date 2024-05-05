import { useEffect, useState } from 'react';
import styles from './Header.module.css';
import SecondaryButton from '../../pages/app/Overview/components/SecondaryButton/SecondaryButton';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
const Header = ({ type }: { type?: string | undefined }) => {
  const [openSettings, setOpenSettings] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (localStorage.getItem('accessToken') && !isAuthenticated) {
      setIsAuthenticated(true);
    }
  }, [isAuthenticated]);

  const variants = {
    fadein: {
      display: 'block',
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
    fadeout: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
      transitionEnd: {
        display: 'none',
      },
    },
  };
  return (
    <>
      <header>
        <div className={styles.headerComponent}>
          <Link to='/home'>
            <div className={styles.mainLogo}>
              <img src='/app/logoText.webp' alt='makemypass brand logo' className={styles.header} />
              <span className={styles.logo}>MakeMyPass</span>
            </div>
          </Link>
          {type != 'eventForm' && (
            <>
              {type != 'landing' ? (
                isAuthenticated ? (
                  <>
                    <div className='row'>
                      <div className={styles.dropdown}>
                        <p
                          onClick={() => {
                            setOpenSettings(!openSettings);
                          }}
                          className={styles.userName}
                        >
                          Hello, {userEmail}
                          <span className={styles.avatar}>
                            {userEmail?.split('')[0].toUpperCase()}
                          </span>
                        </p>

                        {window.location.pathname !== '/set-profile' && (
                          <motion.div
                            className={styles.dropdownContent}
                            initial={{ opacity: 0, y: -20 }}
                            animate={openSettings ? 'fadein' : 'fadeout'}
                            variants={variants}
                          >
                            <Link to='/set-profile'>
                              <div className={styles.link}>
                                <FaUser size={15} color='#57575C' />
                                <p className={styles.linkText}>Update Profile</p>
                              </div>
                            </Link>
                          </motion.div>
                        )}
                      </div>

                      <Link to='/login'>
                        <SecondaryButton
                          buttonText='Logout'
                          onClick={() => {
                            localStorage.clear();
                          }}
                        />
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className={styles.buttons}>
                    <Link to='/login'>
                      <SecondaryButton buttonText='Login' />
                    </Link>
                  </div>
                )
              ) : (
                <div className={styles.buttons}>
                  <a
                    className={styles.requestDemo}
                    href='https://wa.me/7012679067'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Request Demo
                  </a>
                  {!isAuthenticated ? (
                    <Link to='/login'>
                      <button className={styles.loginButton}>Login</button>
                    </Link>
                  ) : (
                    <Link to='/events'>
                      <button className={styles.loginButton}>Dashboard</button>
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
