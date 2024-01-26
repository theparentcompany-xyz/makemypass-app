import { Link } from 'react-router-dom';
import Theme from '../../../components/Theme/Theme';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  return (
    <>
      <Theme type='landing'>
        <div className={styles.landingPageContainer}>
          <div className={styles.headerSection}>
            <div className={styles.roundThing}>One Click, One Scan</div>
            <div className={styles.headingText}>
              <p className={styles.mainHeading}>
                <span>Make</span> Your <br /> Passes <span>with Ease</span>
              </p>
              <p className={styles.subHeading}>
                Streamline your pass experience with Make My Pass—a minimalist SASS app for
                creating, managing, and sharing digital passes effortlessly.
              </p>

              <button className={styles.launch}>
                Lauching Soon <span>🚀</span>
              </button>
              <p className={styles.launchAt}>ScaleUp Conclave 2024</p>

              <img className={styles.landingImage} src='/app/landingImage.png' />
            </div>
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
