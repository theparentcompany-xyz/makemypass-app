import { useEffect, useState } from 'react';
import { getEventMailService, updateEventMailService } from '../../../../../../apis/mails';
import styles from './CustomMail.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import Slider from '../../../../../../components/SliderButton/Slider';
import { motion } from 'framer-motion';
import { HashLoader } from 'react-spinners';

type Props = {
  setCustomMail: React.Dispatch<React.SetStateAction<boolean>>;
};

type mailData = {
  smtp_server: string;
  smtp_port: string;
  smtp_username: string;
  smtp_password: string;
  from_mail: string;
};

const CustomMail = ({ setCustomMail }: Props) => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [showPassword, setShowPassword] = useState(false);
  const [showCustomMail, setShowCustomMail] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedMailData, setFetchedMailData] = useState<mailData>();
  const [mailData, setMailData] = useState<mailData>();

  const onUpdate = () => {
    let changedData: Record<string, any> = Object.entries(mailData as Record<string, any>)
      .filter(([key, value]) => fetchedMailData?.[key as keyof mailData] != value)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    if (!showCustomMail) {
      changedData = {};
    }

    updateEventMailService(eventId, changedData, setFetchedMailData, mailData);
  };

  useEffect(() => {
    if (eventId) {
      getEventMailService(eventId, setFetchedMailData);
    }
  }, [eventId]);

  useEffect(() => {
    if (fetchedMailData) {
      setIsLoading(false);
      Object.keys(fetchedMailData).length && setShowCustomMail(true);
      setMailData(fetchedMailData);
    }
  }, [fetchedMailData]);

  return (
    <>
      <div className={styles.modalSubText}>
        {isLoading ? (
          <HashLoader color='#46BF75' size={50} className={styles.loader} />
        ) : (
          <div className={styles.inputContainers}>
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Turn On Custom Mail ?</label>
              <Slider
                checked={showCustomMail}
                onChange={() => setShowCustomMail(!showCustomMail)}
              />
            </div>
            {showCustomMail && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={styles.inputContainers}
              >
                <div className={styles.inputContainer}>
                  <label className={styles.inputLabel}>SMTP Server</label>
                  <input
                    type='text'
                    className={styles.input}
                    value={mailData?.smtp_server}
                    onChange={(e) => {
                      mailData && setMailData({ ...mailData, smtp_server: e.target.value });
                    }}
                  />
                </div>
                <div className={styles.inputContainer}>
                  <label className={styles.inputLabel}>SMTP Port</label>
                  <input
                    type='text'
                    className={styles.input}
                    value={mailData?.smtp_port}
                    onChange={(e) => {
                      mailData && setMailData({ ...mailData, smtp_port: e.target.value });
                    }}
                  />
                </div>
                <div className={styles.inputContainer}>
                  <label className={styles.inputLabel}>Username</label>
                  <input
                    type='text'
                    className={styles.input}
                    value={mailData?.smtp_username}
                    onChange={(e) => {
                      mailData && setMailData({ ...mailData, smtp_username: e.target.value });
                    }}
                  />
                </div>
                <div className={styles.inputContainer}>
                  <label className={styles.inputLabel}>Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={styles.input}
                    value={mailData?.smtp_password}
                    onChange={(e) => {
                      mailData && setMailData({ ...mailData, smtp_password: e.target.value });
                    }}
                  />
                </div>
                <div className={styles.showPass} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                  Show Password?
                </div>
                <div className={styles.inputContainer}>
                  <label className={styles.inputLabel}>Mail Id</label>
                  <input
                    type='mail'
                    className={styles.input}
                    value={mailData?.from_mail}
                    onChange={(e) => {
                      mailData && setMailData({ ...mailData, from_mail: e.target.value });
                    }}
                  />
                </div>
              </motion.div>
            )}
            <div className={styles.buttonContainer}>
              <button className={styles.button} onClick={onUpdate}>
                Update
              </button>
              <button className={styles.button} onClick={() => setCustomMail(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomMail;
