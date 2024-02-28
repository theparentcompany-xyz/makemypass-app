import React from 'react';
import styles from './WhyUs.module.css';

const WhyUs = () => {
  return (
    <div className={styles.thirdSection}>
      <div className={styles.tsTexts}>
        <p className={styles.tsHeading}>Why Us?</p>
        <div className={styles.tsPoints}>
          <div className={styles.tsPoint}>
            <p className={styles.tsHeading}>5+</p>
            <p className={styles.tsText}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda totam nobis, rerum
              quaerat ipsa iste!
            </p>
          </div>
          <div className={styles.tsPoint}>
            <p className={styles.tsHeading}>100+</p>
            <p className={styles.tsText}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda totam nobis, rerum
              quaerat ipsa iste!
            </p>
          </div>
          <div className={styles.tsPoint}>
            <p className={styles.tsHeading}>12K+</p>
            <p className={styles.tsText}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda totam nobis, rerum
              quaerat ipsa iste!
            </p>
          </div>
        </div>
      </div>
      <img src='/app/landing/tsImg.png' alt='' className={styles.tsImg} />
    </div>
  );
};

export default WhyUs;
