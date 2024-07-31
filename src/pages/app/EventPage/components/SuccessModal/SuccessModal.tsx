import { motion } from 'framer-motion';
import styles from './SuccessModal.module.css';
import Modal from '../../../../../components/Modal/Modal';
import { Dispatch, SetStateAction, useState } from 'react';
import { SuccessModalProps } from '../../types';
import { HashLoader } from 'react-spinners';
import ScratchCard from './ScratchCardComponent/ScratchCardComponent';
import image from './scratchImage.png';
import { claimRegisterGift } from '../../../../../apis/publicpage';
import { useNavigate } from 'react-router';

const SuccessModal = ({
  success,
  setSuccess,
  hasScratchCard,
}: {
  success: SuccessModalProps;
  setSuccess: Dispatch<SetStateAction<SuccessModalProps>>;
  hasScratchCard?: boolean;
}) => {
  const [scratchCard, setScratchCard] = useState(false);
  const navigate = useNavigate();

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
                    setSuccess({ showModal: false });
                  }}
                  className={styles.closeButton}
                >
                  X
                </button>

                {!success.loading ? (
                  <div className={styles.modalTexts}>
                    <p className={styles.modalTitle}>Booking Confirmed!</p>
                    <p className={styles.bookingConfirmedSubText}>
                      Thank you for booking your spot at {success.eventTitle}!
                    </p>
                    <p className={styles.bookingConfirmedSecondaryText}>
                      {success.followupMessage}
                    </p>

                    {success.ticketURL && import.meta.env.VITE_CURRENT_ENV === 'dev' && (
                      <>
                        <button
                          onClick={() => {
                            const eventTitle = JSON.parse(
                              sessionStorage.getItem('eventData')!,
                            ).event_title;
                            navigate(`/${eventTitle}/ticket?ticketURL=${success.ticketURL}`);
                          }}
                          className={styles.downloadTicketButton}
                        >
                          View Ticket
                        </button>
                      </>
                    )}

                    <p className={styles.contactUs}>
                      If you have any questions or need assistance, please contact us at
                      hello@makemypass.com
                    </p>

                    {hasScratchCard && (
                      <button
                        onClick={() => {
                          setSuccess({ showModal: false });
                          setScratchCard(true);
                          if (success.eventRegisterId)
                            claimRegisterGift(success.eventId ?? '', success.eventRegisterId);
                        }}
                        className={styles.viewTicketButton}
                      >
                        Next
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={styles.loaderContainer}>
                    <HashLoader color='#46BF75' size={50} />
                  </div>
                )}
              </div>
            </Modal>
          </>
        )}

        {!success.showModal && hasScratchCard && scratchCard && (
          <Modal
            title='Scratch Card'
            onClose={() => {
              setScratchCard(false);
            }}
          >
            <div className={styles.scratchCardContainer}>
              <div className={styles.scratchCard}>
                <p className={styles.modalTitle}>Scratch to Reveal</p>
                <p className={styles.bookingConfirmedSubText}>
                  Scratch the card to reveal your discount code
                </p>
                <div className={styles.scratchCardImage}></div>

                <ScratchCard
                  width={150}
                  height={150}
                  coverImage={image}
                  revealContent='Congratulations! You won!'
                  brushSize={30}
                  revealThreshold={70}
                />
              </div>
            </div>
          </Modal>
        )}
      </motion.div>
    </div>
  );
};

export default SuccessModal;
