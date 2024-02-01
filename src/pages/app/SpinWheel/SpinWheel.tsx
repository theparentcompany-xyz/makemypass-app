import { useEffect, useRef, useState } from 'react';
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

const SpinWheel = () => {
  const [mustSpin, setMustSpin] = useState(false);

  const [spinWheelData, setSpinWheelData] = useState<OptionStyle[]>();

  const [eventId, setEventId] = useState<string>('');
  const { eventTitle } = useParams<{ eventTitle: string }>();

  const [ticketId, setTicketId] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const [prizeNumber, setPrizeNumber] = useState<number>(0);

  useEffect(() => {
    if (eventTitle && !eventId) getEventUUID(eventTitle, setEventId);

    if (eventId) listSpinWheelItems(eventId, setSpinWheelData);

    console.log(eventId, spinWheelData);
  }, [eventId]);

  useEffect(() => {
    if (ticketId.length > 0 && spinWheelData) {
      spin(eventId, ticketId, setPrizeNumber, spinWheelData);
    }
  }, [isScanning]);

  const handleSpinClick = () => {
    if (ticketId) {
      if (!mustSpin) {
        setMustSpin(true);
      }
    } else {
      setIsScanning(true);
    }
  };

  return (
    <Theme>
      <>
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
                  }}
                />
                <div className={styles.spinButton}>
                  <SectionButton
                    buttonText='Spin The Wheel'
                    icon={<ImSpinner9 size={25} />}
                    buttonColor='#47C97E'
                    onClick={handleSpinClick}
                  />
                </div>
              </div>
            )
          ) : (
            <div className={styles.scannerContainer}>
              <p className={styles.scanHeader}>Scan QR Code Below</p>
              <div className={styles.scannerOuterContainer}>
                <div className={styles.scanner}>
                  <div className={styles.closeButton}>
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
