import React, { useState } from 'react';
import { AiFillAudio } from 'react-icons/ai';
import { FaKeyboard } from 'react-icons/fa';

import styles from './GenerateWithAI.module.css';

type Props = {};

const GenerateWithAI = ({}: Props) => {
  const [usingAudio, setUsingAudio] = useState(false);

  return (
    <div className={styles.container}>
      {!usingAudio ? (
        <>
          <div className={styles.descriptionContainer}>
            <label htmlFor='description' className={styles.descriptionLabel}>
              Description Box
            </label>
            <textarea name='description' id='description' className={styles.descriptionTextArea} />
            <button className={styles.submitButton}>Submit</button>
          </div>
          <div className={styles.orContainer}>
            <div className={styles.line}></div>
            <div className={styles.or}>OR</div>
            <div className={styles.line}></div>
          </div>
          <div className={styles.voiceButtonContainer}>
            <label className={styles.audioLabel}>
              Use Audio to give input to the AI Form Builder
            </label>
            <button className={styles.voiceButton} onClick={() => setUsingAudio(true)}>
              {' '}
              <AiFillAudio /> Record your Audio
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.voiceInputContainer}>
            Hello
            <button className={styles.submitButton}>Submit</button>
          </div>

          <div className={styles.orContainer}>
            <div className={styles.line}></div>
            <div className={styles.or}>OR</div>
            <div className={styles.line}></div>
          </div>
          <div className={styles.voiceButtonContainer}>
            <label className={styles.audioLabel}>
              Use The Description Box to give input to the AI Form Builder
            </label>
            <button className={styles.voiceButton} onClick={() => setUsingAudio(false)}>
              {' '}
              <FaKeyboard /> Type In Your Input
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GenerateWithAI;
