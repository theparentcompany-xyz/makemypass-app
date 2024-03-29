import { useEffect, useState } from 'react';
import styles from './Header.module.css';
import SecondaryButton from '../../pages/app/Overview/components/SecondaryButton/SecondaryButton';
import { Link } from 'react-router-dom';
const Header = ({ type }: { type?: string | undefined }) => {
  const [openSettings, setOpenSettings] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (localStorage.getItem('accessToken') && !isAuthenticated) {
      setIsAuthenticated(true);
    }
  }, [isAuthenticated]);

  return (
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
                    <p
                      onClick={() => {
                        setOpenSettings(!openSettings);
                      }}
                      className={styles.userName}
                    >
                      Hello, {userEmail}
                      <span className={styles.avatar}>{userEmail?.split('')[0].toUpperCase()}</span>
                    </p>

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
                <Link to='/login'>
                  <button className={styles.loginButton}>Login</button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
