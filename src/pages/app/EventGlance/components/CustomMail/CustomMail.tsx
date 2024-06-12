import { useEffect, useState } from 'react';
import { getMailService } from '../../../../../apis/mails';
import styles from './CustomMail.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import Slider from '../../../../../components/SliderButton/Slider';
import { motion } from 'framer-motion';

type Props = {
  setCustomMail: React.Dispatch<React.SetStateAction<boolean>>;
};

const CustomMail = ({ setCustomMail }: Props) => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [showPassword, setShowPassword] = useState(false);
  const [showCustomMail, setShowCustomMail] = useState(false);
  useEffect(() => {
    if (eventId) getMailService(eventId);
  }, [eventId]);
  return (
    <div>
      <div className={styles.modalHeader}>Connect Custom Mail</div>
      <div className={styles.modalSubText}>
        <div className={styles.inputContainers}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Turn On Custom Mail ?</label>
            <Slider checked={showCustomMail} onChange={() => setShowCustomMail(!showCustomMail)} />
          </div>
          {showCustomMail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>SMTP Server</label>
                <input type='text' className={styles.input} />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>SMTP Port</label>
                <input type='text' className={styles.input} />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>Username</label>
                <input type='text' className={styles.input} />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>Password</label>
                <input type={showPassword ? 'text' : 'password'} className={styles.input} />
              </div>
              <div className={styles.showPass} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
                Show Password?
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>Mail Id</label>
                <input type='mail' className={styles.input} />
              </div>

              <div className={styles.buttonContainer}>
                <button className={styles.button}>Update</button>
                <button className={styles.button} onClick={() => setCustomMail(false)}>
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomMail;
