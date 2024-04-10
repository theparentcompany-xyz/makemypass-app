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
                Pre-launch, we’ve already hacked the art of event scaling, with 3 milestones checked
                in our roadmap.
              </p>
            </div>
            <div className={styles.tsPoint}>
              <p className={styles.tsHeading}>5000+</p>
              <p className={styles.tsText}>
                At one of our event, our attendee count soared to an impressive 6987+, with over
                3394+ checked in and ready.
              </p>
            </div>
            <div className={styles.tsPoint}>
              <p className={styles.tsHeading}>∞ </p>
              <p className={styles.tsText}>
                Host with us, as we grow! Manifest your event and customise features and stats to
                suit your needs!
              </p>
            </div>
          </div>
        </div>
        <img
          src='/app/landing/tsImg.webp'
          alt='the insights dashboard of makemypass.com alongisde the realtime overview page of makemypass.com'
          className={styles.tsImg}
        />
      </div>
    </>
  );
};

export default WhyUs;
