import React from 'react';

import styles from './TestMail.module.css';

const TestMail = ({
  setConfirmTestMail,
  sendTestMail,
  confirmTestMail,
  setDummyData,
  getDummyData,
}: {
  setConfirmTestMail: React.Dispatch<React.SetStateAction<{ status: boolean; mailId: string }>>;
  sendTestMail: (
    mailId: string,
    data?: {
      [key: string]: string;
    } | null,
  ) => Promise<void>;
  confirmTestMail: { status: boolean; mailId: string };
  setDummyData: React.Dispatch<
    React.SetStateAction<{
      showModal: boolean;
      data: { [key: string]: string } | null;
      mailId: string;
    }>
  >;
  getDummyData: (mailId: string) => void;
}) => {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.sectionContent1}>
        <p className={styles.sectionText}>Are you sure you want to send a Test Mail ?</p>
      </div>
      <div className={styles.modalButtons}>
        <button
          className={styles.confirmButton}
          //Fix this onClick function
          onClick={() => {
            sendTestMail(confirmTestMail.mailId);
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
