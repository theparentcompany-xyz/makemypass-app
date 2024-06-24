import React, { useEffect, useState } from 'react';
import { listMailType, MailType } from '../../../../../apis/types';
import styles from './UpdateMail.module.css';
import { getMail } from '../../../../../apis/mails';
import { HashLoader } from 'react-spinners';
import { updateMail } from '../../../../../apis/mails';
type Props = {
  selectedMail: listMailType | undefined;
  setSelectedMail: React.Dispatch<React.SetStateAction<listMailType | undefined>>;
  setCustomMail: React.Dispatch<React.SetStateAction<boolean>>;
  setMails: React.Dispatch<React.SetStateAction<listMailType[]>>;
};
const UpdateMail = ({ selectedMail, setCustomMail, setSelectedMail, setMails }: Props) => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [mailData, setMailData] = useState<MailType>();
  const [fetchedMail, setFetchedMail] = useState<MailType>();
  const onUpdateEmail = () => {
    const changedData: Record<string, any> = Object.entries(mailData as Record<string, any>)
      .filter(([key, value]) => fetchedMail?.[key as keyof MailType] !== value)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    updateMail(eventId, mailData as MailType, changedData, setMails);
  };

  useEffect(() => {
    if (selectedMail) {
      getMail(eventId, selectedMail?.id, setFetchedMail);
    }
  }, []);

  useEffect(() => {
    if (fetchedMail) {
      setMailData(fetchedMail);
    }
  }, [fetchedMail]);

  return (
    <>
      {mailData ? (
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
                  value={mailData?.subject}
                  onChange={(e) =>
                    mailData && setMailData({ ...mailData, subject: e.target.value })
                  }
                />
              </div>

              <div className={styles.inputContainer}>
                <p className={styles.inputLabel}>Body</p>

                <textarea
                  placeholder='Enter Email Body'
                  className={styles.textarea}
                  value={mailData?.body}
                  onChange={(e) => mailData && setMailData({ ...mailData, body: e.target.value })}
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
      ) : (
        <HashLoader size={50} color={'#46BF75'} />
      )}
    </>
  );
};

export default UpdateMail;
