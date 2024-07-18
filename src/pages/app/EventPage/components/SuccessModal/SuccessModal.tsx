import { motion } from 'framer-motion';
import styles from './SuccessModal.module.css';
import Modal from '../../../../../components/Modal/Modal';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { SuccessModalProps } from '../../types';
import { HashLoader } from 'react-spinners';
import { BsDownload } from 'react-icons/bs';

import ScratchCard from 'reactjs-scratchcard';
import scratchImage from './scratchImage.png';

const SuccessModal = ({
  success,
  setSuccess,
}: {
  success: SuccessModalProps;
  setSuccess: Dispatch<SetStateAction<SuccessModalProps>>;
}) => {
  const [scratchCard, setScratchCard] = useState(false);

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

                    {success.ticketURL && (
                      <>
                        <button
                          onClick={() => {
                            if (success.ticketURL) {
                              fetch('https://cors-anywhere.herokuapp.com/' + success.ticketURL, {
                                headers: {
                                  'Access-Control-Allow-Origin': '*',
                                  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                                  'Access-Control-Allow-Headers': 'Content-Type',
                                },
                              })
                                .then((response) => response.blob())
                                .then((blob) => {
                                  const link = document.createElement('a');
                                  link.href = window.URL.createObjectURL(blob);
                                  link.download = 'Ticket.png';
                                  link.click();
                                })
                                .catch((error) =>
                                  console.error('Error downloading the ticket:', error),
                                );
                            }
                          }}
                          className={styles.downloadTicketButton}
                        >
                          <BsDownload /> <span>Download Ticket</span>
                        </button>
                        <button
                          onClick={() => {
                            window.open(success.ticketURL, '_blank');
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

                    <button
                      onClick={() => {
                        setSuccess({ showModal: false });
                        setScratchCard(true);
                      }}
                      className={styles.viewTicketButton}
                    >
                      Next
                    </button>
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

        {!success.showModal && scratchCard && (
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
                  brushSize={10}
                  fadeOutOnComplete={true}
                  finishPercent={50}
                  height={'10rem'}
                  image={scratchImage}
                  transitionProps={{ timeout: 200 }}
                  onComplete={() => {
                    console.log('completed');
                  }}
                  width={'10rem'}
                >
                  <span
                    style={{
                      width: '100%',
                      height: '100%',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    hehehehehe
                  </span>
                </ScratchCard>
              </div>
            </div>
          </Modal>
        )}
      </motion.div>
    </div>
  );
};

export default SuccessModal;
