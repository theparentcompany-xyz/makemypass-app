import { motion } from 'framer-motion';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { HashLoader } from 'react-spinners';

import Modal from '../../../../../components/Modal/Modal';
import type { SuccessModalProps } from '../../types';
import ScratchCard from './ScratchCardComponent/ScratchCardComponent';
import SuccessButtonsContainer from './ScratchCardComponent/SuccessButtonsContainer';
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
            {success.newPage ? (
              <div className='center'>
                <p className={styles.thankyouText}>
                  {success.eventTitle
                    ? `Thank you for Registering for ${success.eventTitle}`
                    : 'Thank you for Registering'}
                </p>
                <div className={styles.modalTexts}>
                  <SuccessButtonsContainer
                    success={success}
                    setSuccess={setSuccess}
                    hasScratchCard={hasScratchCard}
                    setScratchCard={setScratchCard}
                    redirectButtonRef={redirectButtonRef}
                  />
                </div>
              </div>
            ) : (
              <Modal
                title='Registration Successful'
                onClose={() => {
                  setSuccess((prev) => {
                    return { ...prev, showModal: false };
                  });
                }}
              >
                <div className={styles.modalTexts}>
                  <SuccessButtonsContainer
                    success={success}
                    setSuccess={setSuccess}
                    hasScratchCard={hasScratchCard}
                    setScratchCard={setScratchCard}
                    redirectButtonRef={redirectButtonRef}
                  />
                </div>
              </Modal>
            )}
          </>
        )}

        {!success.showModal &&
          (scratchCard.isFetching || scratchCard.name.length > 0 || scratchCard.image.length > 0) &&
          (success.newPage ? (
            <div className={`${styles.scratchCardContainer} center`}>
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
          ) : (
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
          ))}
      </motion.div>
    </div>
  );
};

export default SuccessModal;
