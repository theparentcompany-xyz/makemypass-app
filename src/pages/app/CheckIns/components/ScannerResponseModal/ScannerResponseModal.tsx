import { CgClose } from 'react-icons/cg';
import Modal from '../../../../../components/Modal/Modal';
import styles from './ScannerResponseModal.module.css';
import React, { Dispatch } from 'react';

const ScannerResponseModal = ({
  message,
  setMessage,
  isError,
  setIsError,
  setTicketId,
  setTrigger,
}: {
  message: string;
  setMessage: (message: string) => void;
  isError: boolean;
  setIsError: (isError: boolean) => void;
  setTicketId: (ticketId: string) => void;
  setTrigger: Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    message &&
    message.length > 0 && (
      <>
        <div className={styles.backgroundBlur}></div>
        <Modal
          style={
            isError
              ? {
                  borderBottom: '3px solid #f71e1e',
                  background: 'rgba(185, 31, 31, 0.09)',
                }
              : {
                  borderBottom: '3px solid #47c97e',
                  background: 'rgba(31, 185, 31, 0.09)',
                }
          }
        >
          <br />
          <p className={styles.modalSubText}>{message}</p>
          <button
            onClick={() => {
              setMessage('');
              setTicketId('');
              setIsError(false);
              setTrigger(false);
            }}
            className={styles.modalCloseButton}
          >
            Close <CgClose />
          </button>
        </Modal>
      </>
    )
  );
};

export default ScannerResponseModal;
