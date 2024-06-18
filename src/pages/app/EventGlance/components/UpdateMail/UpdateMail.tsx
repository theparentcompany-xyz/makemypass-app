import React from 'react';
import { MailType } from '../../../../../apis/types';
import styles from './UpdateMail.module.css';
type Props = {
  selectedMail: MailType | undefined;
  setSelectedMail: React.Dispatch<React.SetStateAction<MailType | undefined>>;
  setCustomMail: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdateEmail: () => void;
};
const UpdateMail = ({ selectedMail, setSelectedMail, onUpdateEmail, setCustomMail }: Props) => {
  return (
    <>
      <div className={styles.modalHeader}>Update Reminder Email</div>
      <div className={styles.modalSubText}>
        <div className={styles.inputContainers}>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>The reminder goes Out </p>
            <p className={styles.inputSubText}>X hours before the event</p>
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Subject</p>
            <input
              type='text'
              placeholder='Enter Subject'
              className={styles.input}
              value={selectedMail?.subject}
              onChange={(e) =>
                selectedMail && setSelectedMail({ ...selectedMail, subject: e.target.value })
              }
            />
          </div>

          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Body</p>

            <textarea
              placeholder='Enter Email Body'
              className={styles.textarea}
              value={selectedMail?.body}
              onChange={(e) =>
                selectedMail && setSelectedMail({ ...selectedMail, body: e.target.value })
              }
            />
          </div>
          <div className={styles.inputContainer}>
            <p
              className={styles.inputLink}
              onClick={() => {
                setCustomMail(true);
              }}
            >
              &#x1F6C8; Connect Custom Mail Id Here
            </p>
          </div>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={onUpdateEmail}>
          Update Reminder
        </button>
        <button className={styles.button} onClick={() => setSelectedMail(undefined)}>
          Cancel
        </button>
      </div>
    </>
  );
};

export default UpdateMail;
