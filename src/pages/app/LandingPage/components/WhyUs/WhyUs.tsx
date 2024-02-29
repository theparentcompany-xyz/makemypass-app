import styles from './WhyUs.module.css';

const WhyUs = () => {
  return (
    <>
      <div className={styles.thirdSection}>
        <div className={styles.tsTexts}>
          <p className={styles.tsHeading}>Why Us?</p>
          <div className={styles.tsPoints}>
            <div className={styles.tsPoint}>
              <p className={styles.tsHeading}>3+</p>
              <p className={styles.tsText}>
                We have already worked along and scaled 3 events even before the official launch of
                our platform.
              </p>
            </div>
            <div className={styles.tsPoint}>
              <p className={styles.tsHeading}>5000+</p>
              <p className={styles.tsText}>
                For the ScaleUp Conclave 2024, we have already registered 6987+ attendees. and
                checked in over 3394+ attendees.
              </p>
            </div>
            <div className={styles.tsPoint}>
              <p className={styles.tsHeading}>∞ </p>
              <p className={styles.tsText}>
                We are still in the development phase, try hosting a event with us with custom
                features and stats.
              </p>
            </div>
          </div>
        </div>
        <img src='/app/landing/tsImg.png' alt='' className={styles.tsImg} />
      </div>
    </>
  );
};

export default WhyUs;
