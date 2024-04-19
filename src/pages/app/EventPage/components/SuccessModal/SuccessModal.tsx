import { motion } from 'framer-motion';
import styles from './SuccessModal.module.css';
import Modal from '../../../../../components/Modal/Modal';
import { Dispatch } from 'react';
import tickachu from './tickachu.png';

const SuccessModal = ({
  success,
  setSuccess,
  hasShortlisting,
}: {
  success: string;
  setSuccess: Dispatch<string>;
  hasShortlisting: boolean | undefined;
}) => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className={styles.successMessage}
      >
        {success && (
          <>
            <Modal
              style={{
                maxWidth: '28rem',
                width: '75%',
                borderBottom: '4px solid #47c97e',
              }}
            >
              <div className={styles.modalContainer}>
                <button
                  onClick={() => {
                    setSuccess('');
                  }}
                  className={styles.closeButton}
                >
                  X
                </button>
                <img src={tickachu} alt='tickachu' className={styles.tickachu} />
                <div className={styles.modalTexts}>
                  <p className={styles.modalSubText}>Registration Successful</p>
                  <p className={styles.modalText}>
                    Registration successfully finalized!. Please check your email for confirmation
                    details. Looking forward to your participation!.
                  </p>
                  {success && !hasShortlisting && (
                    <p className={styles.ticketCode}>
                      Your Ticket Code: <span>{success}</span>
                    </p>
                  )}
                </div>
              </div>
            </Modal>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default SuccessModal;
