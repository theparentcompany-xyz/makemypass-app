import Theme from '../../../../../components/Theme/Theme';
import CheckInHeader from '../../components/CheckInHeader/CheckInHeader/CheckInHeader';
import styles from './ScanQR.module.css';

import { QrScanner } from '@yudiel/react-qr-scanner';
import { useEffect, useState } from 'react';
import { getUserInfo } from '../../../../../apis/scan';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ScanQR = () => {
  const [ticketId, setTicketId] = useState<string>('');
  const [trigger, setTrigger] = useState(false);

  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (ticketId.length > 0 && trigger) {
      getUserInfo(ticketId, setMessage);
      setTimeout(() => {
        setTicketId('');
      }, 2000);

      setTimeout(() => {
        setMessage('');
      }, 4000);
    }
  }, [ticketId, trigger]);

  const navigate = useNavigate();

  return (
    <Theme>
      <>
        {message && message.length > 0 && (
          <>
            <div className={styles.backgroundBlur}></div>
            <dialog open className={styles.onClickModal}>
              <p className={styles.modalHeader}>User Check-In Status</p>
              <hr className={styles.line} />
              <br />
              <p className={styles.modalSubText}>{message}</p>
            </dialog>
          </>
        )}

        <div className={styles.scanContainer}>
          <CheckInHeader buttonType='back' />

          <hr className={styles.line} />
        </div>

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

                  if (result.getText().length > 0 && result.getText() !== ticketId) {
                    setTrigger(true);
                  }
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

                if (trigger) {
                  setTrigger(false);
                }
              }}
            />
            <SecondaryButton
              buttonText='Check In'
              onClick={() => {
                setTrigger(true);
              }}
            />
          </div>
        </div>
      </>
    </Theme>
  );
};

export default ScanQR;
