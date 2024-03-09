import { useEffect, useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { listSpinWheelItems, spin } from '../../../apis/spinwheel';
import { OptionStyle } from './types';
import { useParams } from 'react-router-dom';
import { getEventUUID } from '../../../common/commonFunctions';
import styles from './SpinWheel.module.css';
import Theme from '../../../components/Theme/Theme';
import Glance from '../../../components/Glance/Glance';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import { QrScanner } from '@yudiel/react-qr-scanner';
import toast from 'react-hot-toast';

import SectionButton from '../../../components/SectionButton/SectionButton';
import { ImSpinner9 } from 'react-icons/im';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';

const SpinWheel = () => {
  const [mustSpin, setMustSpin] = useState(false);

  const [spinWheelData, setSpinWheelData] = useState<OptionStyle[]>();

  const [eventId, setEventId] = useState<string>('');
  const { eventTitle } = useParams<{ eventTitle: string }>();

  const [ticketId, setTicketId] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const [prizeNumber, setPrizeNumber] = useState<number>(0);

  const [cameraType, setCameraType] = useState<'user' | 'environment'>('user');

  useEffect(() => {
    if (eventTitle && !eventId) getEventUUID(eventTitle, setEventId);

    if (eventId) listSpinWheelItems(eventId, setSpinWheelData);
  }, [eventId]);

  useEffect(() => {
    if (ticketId.length > 0 && spinWheelData) {
      spin(eventId, ticketId, setPrizeNumber, spinWheelData, setTicketId);
    }
  }, [isScanning]);

  const handleSpinClick = () => {
    if (!ticketId) {
      setIsScanning(true);
    }
  };

  useEffect(() => {
    if (prizeNumber && ticketId) {
      if (!mustSpin) {
        setMustSpin(true);
      }
    }
  }, [prizeNumber]);

  return (
    <Theme>
      <>
        {showMessage && (
          <>
            <div className={styles.backgroundBlur}></div>
            <Confetti className={styles.confetti} />
            <motion.dialog
              initial={{
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.5,
              }}
              open
              className={styles.congratzContainer}
            >
              <img
                src='/app/congrats.webp'
                alt='congratulation image for winning the spinwheel game'
                className={styles.image}
              />
              <div className={styles.welcomeText}>
                <p className={styles.youWon}>You Won</p>
                <p className={styles.prize}>{spinWheelData && spinWheelData[prizeNumber].option}</p>
              </div>
            </motion.dialog>
          </>
        )}
        <Glance tab='spinwheel' />
        <div className={styles.spinWheelContainer}>
          {!isScanning ? (
            spinWheelData &&
            spinWheelData.length > 0 && (
              <div className={styles.wheel}>
                <Wheel
                  innerBorderWidth={0}
                  outerBorderWidth={0}
                  radiusLineWidth={1}
                  fontSize={15}
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber}
                  data={spinWheelData}
                  fontFamily='Inter, sans-serif'
                  onStopSpinning={() => {
                    setMustSpin(false);
                    setTicketId('');
                    setShowMessage(true);

                    setTimeout(() => {
                      setShowMessage(false);
                    }, 3000);
                  }}
                />
                {!mustSpin && (
                  <div className={styles.spinButton}>
                    <SectionButton
                      buttonText='Spin The Wheel'
                      icon={<ImSpinner9 size={25} />}
                      buttonColor='#47C97E'
                      onClick={handleSpinClick}
                    />
                  </div>
                )}
              </div>
            )
          ) : (
            <div className={styles.scannerContainer}>
              <p className={styles.scanHeader}>Scan QR Code Below</p>
              <div className={styles.scannerOuterContainer}>
                <div className={styles.scanner}>
                  <div className={styles.closeButton}>
                    <SecondaryButton
                      buttonText='Switch'
                      onClick={() => {
                        setCameraType((prevState) =>
                          prevState === 'user' ? 'environment' : 'user',
                        );
                      }}
                    />
                    <SecondaryButton
                      buttonText='Close'
                      onClick={() => {
                        setIsScanning(false);
                      }}
                    />
                  </div>
                  <QrScanner
                    containerStyle={{
                      backgroundColor: '#000',
                    }}
                    onResult={(result) => {
                      setTicketId(result.getText());
                      setIsScanning(false);
                    }}
                    onError={(error) => {
                      toast.error(error.message);
                    }}
                    constraints={
                      {
                        facingMode: cameraType,
                      } as any
                    }
                  />
                </div>
              </div>

              <div className={styles.inputContainer}>
                <br />
                <p className={styles.inputText}>Or Enter Code Below</p>
                <input
                  className={styles.input}
                  placeholder='Enter Ticket Code'
                  value={ticketId}
                  onChange={(e) => {
                    setTicketId(e.target.value);
                  }}
                />
                <SecondaryButton
                  onClick={() => {
                    setIsScanning(false);
                  }}
                  buttonText='Confirm Ticket Number'
                />
              </div>
            </div>
          )}
        </div>
      </>
    </Theme>
  );
};

export default SpinWheel;
