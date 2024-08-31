import React from 'react';
import styles from './TestMail.module.css';
type Props = {
  setConfirmTestMail: React.Dispatch<React.SetStateAction<{ status: boolean; mailId: string }>>;
  sentTestMail: (eventId: string, mailId: string) => void;
  confirmTestMail: { status: boolean; mailId: string };
  eventId: string;
  setDummyData: React.Dispatch<
    React.SetStateAction<{ showModal: boolean; data: Object | null; mailId: string }>
  >;
  getDummyData: (mailId: string) => void;
};

const TestMail = ({
  setConfirmTestMail,
  sentTestMail,
  eventId,
  confirmTestMail,
  setDummyData,
  getDummyData,
}: Props) => {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.sectionContent1}>
        <p className={styles.sectionText}>Are you sure you want to send a Test Mail ?</p>
      </div>
      <div className={styles.modalButtons}>
        <button
          className={styles.confirmButton}
          onClick={() => {
            sentTestMail(eventId, confirmTestMail.mailId);
          }}
        >
          Send
        </button>
        <button
          onClick={() => {
            getDummyData(confirmTestMail.mailId);
            setConfirmTestMail({
              status: false,
              mailId: '',
            });
            setDummyData((prevData) => ({
              ...prevData,
              showModal: true,
            }));
          }}
          className={styles.dummyButton}
        >
          Send with Dummy Data
        </button>
        <button
          onClick={() => {
            setConfirmTestMail({
              status: false,
              mailId: '',
            });
          }}
          className={styles.cancelButton}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TestMail;
