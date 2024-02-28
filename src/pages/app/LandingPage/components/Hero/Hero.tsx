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
          Exploring the Era! The digital <span>MakeMyPass</span>
        </p>
        <div className={styles.arrowCircle}>
          <motion.div initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}>
            <img className={styles.arrow} src='/app/landing/arrow.png' alt='' />
          </motion.div>
          <img className={styles.circle} src='/app/landing/circle.png' alt='' />
        </div>
        <p className={styles.fsSubHeading}>
          Streamline your pass experience with Make My Pass, a minimalist app for creating,
          managing, and sharing digital passes effortlessly.
        </p>
        <a href='https://wa.me/7012679067' target='_blank' rel='noopener noreferrer'>
          <motion.button
            className={styles.requestDemo}
            whileHover='hover'
            variants={boxShadowVariants}
            initial={false}
          >
            Request Demo
          </motion.button>
        </a>
      </div>

      <img src='/app/landing/fsImage.png' alt='' className={styles.fsImage} />
    </div>
  );
};

export default Hero;