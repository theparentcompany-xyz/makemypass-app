import { motion } from 'framer-motion';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { HashLoader } from 'react-spinners';

import { claimScratchCard } from '../../../../../apis/publicpage';
import Modal from '../../../../../components/Modal/Modal';
import type { SuccessModalProps } from '../../types';
import ScratchCard from './ScratchCardComponent/ScratchCardComponent';
import image from './scratchImage.png';
import styles from './SuccessModal.module.css';

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

                        {success.ticketURL && (
                          <button
                            onClick={async () => {
                              try {
                                const response = await fetch(success.ticketURL || '');
                                const blob = await response.blob();

                                const link = document.createElement('a');
                                link.href = URL.createObjectURL(blob);
                                link.setAttribute('download', 'ticket.png');

                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);

                                URL.revokeObjectURL(link.href);
                              } catch (error) {
                                toast.error('Failed to download ticket');
                              }
                            }}
                            className={styles.downloadTicketButton}
                          >
                            Download Ticket
                          </button>
                        )}
                      </>
                    )}

                    {hasScratchCard && (
                      <button
                        onClick={() => {
                          setSuccess({ showModal: false });

                          if (success.eventRegisterId)
                            claimScratchCard(success.eventRegisterId, setScratchCard);
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
