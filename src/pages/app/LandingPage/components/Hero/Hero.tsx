import { motion } from 'framer-motion';

import styles from './Hero.module.css';

const Hero = () => {
  const boxShadowVariants = {
    hover: {
      boxShadow: '9.146px 7.622px 0px 0px #000',
      x: '5px',
      y: '5px',
    },
  };

  return (
    <div className={styles.firstSection}>
      <div
        className={styles.fsTexts}
        style={{
          width: '100%',
        }}
      >
        <p className={styles.fsHeading}>
          Organize Events
          <span
            style={{ display: 'inline-block', transform: 'rotate(-2deg)', marginRight: '1rem' }}
          >
            {' '}
            Smart Way
          </span>
          Not The Hard Way.
        </p>
        <p className={styles.fsSubHeading}>
          Unforgettable Moments Commence with Tickets in your Digital Grasp. At MakeMyPass,
          Anticipation Meets Convenience, without the Chaos of Pass Logistics!
        </p>
        <div className={styles.row}>
          <a href='https://wa.me/916238450178' target='_blank' rel='noopener noreferrer'>
            <motion.button
              className={styles.requestDemo}
              whileHover='hover'
              variants={boxShadowVariants}
              initial={false}
            >
              Talk to Us
            </motion.button>
          </a>

          <a
            className={styles.requestDemoText}
            href='http://cal.com/adnankattekaden/15min'
            target='_blank'
            rel='noopener noreferrer'
          >
            <p className={styles.scheduleDemo}>Schedule a Demo</p>
          </a>
        </div>
      </div>

      <img
        src='/app/landing/landingimg.webp'
        alt='features of makemypass.com'
        className={styles.fsImage}
      />
    </div>
  );
};

export default Hero;
