import styles from './Hero.module.css';
import { motion } from 'framer-motion';

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
      <div className={styles.fsTexts}>
        <p className={styles.fsHeading}>
          Elevate Your Event Experience! Explore <span>MakeMyPass!</span>
        </p>
        <div className={styles.arrowCircle}>
          <motion.div initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}>
            <img className={styles.arrow} src='/app/landing/arrow.webp' alt='white color arrow' />
          </motion.div>
          <img className={styles.circle} src='/app/landing/circle.webp' alt='white color circle' />
        </div>
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
        src='/app/landing/fsImage.webp'
        alt='features of makemypass.com'
        className={styles.fsImage}
      />
    </div>
  );
};

export default Hero;
