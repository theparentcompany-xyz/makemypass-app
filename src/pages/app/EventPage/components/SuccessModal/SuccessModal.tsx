import { motion } from 'framer-motion';
import styles from './SuccessModal.module.css';
import Modal from '../../../../../components/Modal/Modal';
import { Dispatch, SetStateAction } from 'react';
import { BsDownload } from 'react-icons/bs';
import { successModalProps } from '../../types';

const SuccessModal = ({
  success,
  setSuccess,
  hasShortlisting,
}: {
  success: successModalProps;
  setSuccess: Dispatch<SetStateAction<successModalProps>>;
  hasShortlisting: boolean | undefined;
}) => {
  const downloadTicket = async (ticketURL: string) => {
    const response = await fetch(ticketURL);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'EventTicket'); // Set the desired file name
    document.body.appendChild(link);
    link.click();
    if (link.parentNode) link.parentNode.removeChild(link);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className={styles.successMessage}
      >
        {success && success.showModal && (
          <>
            <Modal>
              <div className={styles.modalContainer}>
                <button
                  onClick={() => {
                    setSuccess({ showModal: false, ticketCode: '' });
                  }}
                  className={styles.closeButton}
                >
                  X
                </button>

                <div className={styles.modalTexts}>
                  <p className={styles.modalTitle}>Booking Confirmed!</p>
                  <p className={styles.bookingConfirmedSubText}>
                    Thank you for booking your spot at {success.eventTitle}!
                  </p>
                  <p className={styles.bookingConfirmedSecondaryText}>
                    We've sent a confirmation email to {success.email} with all the details.
                  </p>
                  {!hasShortlisting && (
                    <>
                      <button
                        onClick={() => {
                          downloadTicket(success.ticketCode);
                        }}
                        className={styles.downloadTicketButton}
                      >
                        <BsDownload /> <span>Download Ticket</span>
                      </button>
                      <button
                        onClick={() => {
                          window.open(success.ticketCode, '_blank');
                        }}
                        className={styles.viewTicketButton}
                      >
                        View Ticket
                      </button>
                    </>
                  )}
                  <p className={styles.contactUs}>
                    If you have any questions or need assistance, please contact us at
                    makemypass.com@gmail.com
                  </p>
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
