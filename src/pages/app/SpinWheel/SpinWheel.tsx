import { useState, useEffect } from 'react';
import Theme from '../../../components/Theme/Theme';
import styles from './SpinWheel.module.css';
import SectionButton from '../../../components/SectionButton/SectionButton';

import { Wheel } from 'react-custom-roulette';
import { ImSpinner9 } from 'react-icons/im';
import { listSpinWheelItems, listUserGifts, spin } from '../../../apis/spinwheel';
import { useParams } from 'react-router-dom';
import { getEventId } from '../../../apis/events';
import { HashLoader } from 'react-spinners';
import { OptionStyle } from './types';
import { useNavigate } from 'react-router-dom';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import { QrScanner } from '@yudiel/react-qr-scanner';
import toast from 'react-hot-toast';
import Glance from '../../../components/Glance/Glance';

const SpinWheel = () => {
  const getLocalEventId = () => {
    if (eventTitle) {
      const eventData = JSON.parse(localStorage.getItem('eventData') as string);

      if (eventData) {
        if (eventData.event_name !== eventTitle) {
          localStorage.removeItem('eventData');
          getEventId(eventTitle);
        } else {
          return eventData.event_id;
        }
      }
    }
  };

  const navigate = useNavigate();

  const { eventTitle } = useParams<{ eventTitle: string }>();
  const eventId = getLocalEventId();

  const [ticketId, setTicketId] = useState<string>('');

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState<number | null>();
  const [giftName, setGiftName] = useState<string>('');
  const [spinWheelData, setSpinWheelData] = useState<OptionStyle[]>([]);

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [idTrigger, setIdTrigger] = useState<boolean>(false);
  const [prizeTrigger, setPrizeTrigger] = useState<boolean>(true);

  const [winMessage, setWinMessage] = useState('');

  useEffect(() => {
    listSpinWheelItems(eventId, setSpinWheelData);
  }, []);

  useEffect(() => {
    if (idTrigger && ticketId.length > 0) {
      setPrizeTrigger(false);
      setIsScanning(false);
      spin(eventId, ticketId, setGiftName, setPrizeTrigger);
    }
  }, [idTrigger, ticketId]);

  useEffect(() => {
    if (giftName.length > 0) {
      const prizeIndex = spinWheelData.findIndex((item) => item.option === giftName);
      setPrizeNumber(prizeIndex);
      setPrizeTrigger(true);
      setMustSpin(true);
    }
  }, [giftName]);

  return (
    <Theme>
      <div className={styles.outerContainer}>
        <Glance tab='spinwheel' />
      </div>

      {spinWheelData && spinWheelData.length > 0 ? (
        <div className={styles.spinWheelContainer}>
          {isScanning && (
            <div className={styles.scannerContainer}>
              <p className={styles.scanHeader}>Scan QR Code Below</p>
              <div className={styles.scannerOuterContainer}>
                <div className={styles.scanner}>
                  <div className={styles.closeButton}>
                    <SecondaryButton
                      buttonText='Close'
                      onClick={() => {
                        navigate(-1);
                      }}
                    />
                  </div>
                  <QrScanner
                    containerStyle={{
                      backgroundColor: '#000',
                    }}
                    onResult={(result) => {
                      setTicketId(result.getText());
                      setIdTrigger(true);
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
                    setIdTrigger(true);
                  }}
                  buttonText='Confirm Ticket Number'
                />
              </div>
            </div>
          )}

          {!isScanning && prizeTrigger && prizeNumber && !isNaN(prizeNumber) && (
            <div className={styles.wheel}>
              <Wheel
                innerBorderWidth={0}
                outerBorderWidth={0}
                radiusLineWidth={1}
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                fontFamily='Inter, sans-serif'
                data={spinWheelData}
                onStopSpinning={() => {
                  setMustSpin(false);
                }}
                fontSize={15}
                radiusLineColor='#232A2B'
              />
            </div>
          )}

          {!isScanning && (
            <div className={styles.spinButton}>
              <SectionButton
                buttonText='Spin The Wheel'
                icon={<ImSpinner9 size={25} />}
                buttonColor='#47C97E'
                onClick={() => {
                  if (!ticketId) {
                    setIsScanning(true);
                  } else {
                    setTicketId('');
                    setIsScanning(true);
                    setWinMessage('');
                  }
                }}
              />
            </div>
          )}
          {!mustSpin && <p className={styles.messageText}>{winMessage}</p>}
        </div>
      ) : (
        <div className={styles.center}>
          <HashLoader color='#47C97E' size={50} />
        </div>
      )}
    </Theme>
  );
};

export default SpinWheel;
