import { motion } from 'framer-motion';
import styles from './SuccessModal.module.css';
import Modal from '../../../../../components/Modal/Modal';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { SuccessModalProps } from '../../types';
import { HashLoader } from 'react-spinners';
import ScratchCard from './ScratchCardComponent/ScratchCardComponent';
import image from './scratchImage.png';
import { claimRegisterGift } from '../../../../../apis/publicpage';
const SuccessModal = ({
  success,
  setSuccess,
  hasScratchCard,
}: {
  success: SuccessModalProps;
  setSuccess: Dispatch<SetStateAction<SuccessModalProps>>;
  hasScratchCard?: boolean;
}) => {
  const [scratchCard, setScratchCard] = useState({
    name: '',
    image: '',
    isFetching: false,
  });

  const [isRevealed, setIsRevealed] = useState(false);
  const redirectButtonRef = useRef<HTMLButtonElement>(null);
  const scratchRedirectButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!hasScratchCard && success.redirection && success.redirection.type === 'on_submit') {
      redirectButtonRef.current?.click();
    }

    if (hasScratchCard && isRevealed && success.redirection?.type === 'on_submit') {
      scratchRedirectButtonRef.current?.click();
      console.log('redirecting');
    }
  }, [success, isRevealed, hasScratchCard]);

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
                    {/* <p className={styles.modalTitle}>Registration Successful!</p> */}
                    {/* <p>Thank you for booking your spot at {success.eventTitle}!</p> */}
                    <div dangerouslySetInnerHTML={{ __html: success.followupMessage || '' }}></div>

                    {success.ticketURL && import.meta.env.VITE_CURRENT_ENV === 'dev' && (
                      <>
                        <button
                          onClick={() => {
                            const eventTitle = JSON.parse(
                              sessionStorage.getItem('eventData')!,
                            ).event_name;
                            window.open(
                              `/${eventTitle}/ticket?ticketURL=${success.ticketURL}`,
                              '_blank',
                            );
                          }}
                          className={styles.downloadTicketButton}
                        >
                          View Ticket
                        </button>
                      </>
                    )}

                    {hasScratchCard && (
                      <button
                        onClick={() => {
                          setSuccess({ showModal: false });

                          if (success.eventRegisterId)
                            claimRegisterGift(success.eventRegisterId, setScratchCard);
                        }}
                        className={styles.viewTicketButton}
                      >
                        Next
                      </button>
                    )}

                    {!hasScratchCard && success?.redirection?.url && (
                      <button
                        onClick={() => {
                          window.open(success.redirection?.url, '_blank');
                        }}
                        ref={redirectButtonRef}
                        className={styles.viewTicketButton}
                      >
                        Next
                      </button>
                    )}

                    <p className={styles.contactUs}>
                      If you have any questions or need assistance, please contact us at
                      hello@makemypass.com
                    </p>
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

        {!success.showModal &&
          (scratchCard.isFetching ||
            scratchCard.name.length > 0 ||
            scratchCard.image.length > 0) && (
            <Modal
              title='Scratch to Reveal'
              onClose={() => {
                setScratchCard({ name: '', image: '', isFetching: false });
              }}
            >
              <div className={styles.scratchCardContainer}>
                <div className={styles.scratchCard}>
                  {scratchCard.isFetching ? (
                    <>
                      <br />
                      <HashLoader color='#46BF75' size={50} />
                      <br />
                    </>
                  ) : (
                    <>
                      <ScratchCard
                        width={150}
                        height={150}
                        coverImage={image}
                        revealContent={scratchCard.name}
                        revealImage={scratchCard.image}
                        brushSize={30}
                        revealThreshold={60}
                        isRevealed={isRevealed}
                        setIsRevealed={setIsRevealed}
                      />
                      {isRevealed && success.redirection?.url && (
                        <button
                          onClick={() => {
                            window.open(success.redirection?.url, '_blank');
                          }}
                          ref={scratchRedirectButtonRef}
                          className={styles.viewTicketButton}
                        >
                          Next
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Modal>
          )}
      </motion.div>
    </div>
  );
};

export default SuccessModal;
