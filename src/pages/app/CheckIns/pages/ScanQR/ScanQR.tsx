import Theme from '../../../../../components/Theme/Theme';
import CheckInHeader from '../../components/CheckInHeader/CheckInHeader/CheckInHeader';
import styles from './ScanQR.module.css';

import { QrScanner } from '@yudiel/react-qr-scanner';
import { useContext, useEffect, useState } from 'react';
import { checkInUser, getCheckInCount } from '../../../../../apis/scan';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import SectionButton from '../../../../../components/SectionButton/SectionButton';
import { CgClose } from 'react-icons/cg';
import { GlobalContext } from '../../../../../contexts/globalContext';

const ScanQR = () => {
  const [ticketId, setTicketId] = useState<string>('');
  const [trigger, setTrigger] = useState(false);

  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [scanCount, setScanCount] = useState<number>(0);

  const { eventId } = useContext(GlobalContext);

  useEffect(() => {
    if (eventId) getCheckInCount(eventId, setScanCount);
    if (ticketId.length > 0 && trigger) {
      checkInUser(ticketId, eventId, setMessage, setIsError);
      setTimeout(() => {
        setTicketId('');
      }, 2000);

      setTimeout(() => {
        setMessage('');
      }, 1150);
    }
  }, [ticketId, trigger, eventId]);

  const navigate = useNavigate();

  return (
    <Theme>
      <>
        {message && message.length > 0 && (
          <>
            <div className={styles.backgroundBlur}></div>
            <dialog
              style={
                isError
                  ? {
                      borderBottom: '3px solid #f71e1e',
                      background: 'rgba(185, 31, 31, 0.09)',
                    }
                  : {
                      borderBottom: '3px solid #47c97e',
                      background: 'rgba(31, 185, 31, 0.09)',
                    }
              }
              open
              className={styles.onClickModal}
            >
              <br />
              <p className={styles.modalSubText}>{message}</p>
              <SectionButton
                buttonText='Close'
                onClick={() => {
                  setMessage('');
                }}
                buttonColor='red'
                icon={<CgClose />}
              />
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
              <div className={styles.scanCount}>
                <SecondaryButton buttonText={`${scanCount} Scans`} />
              </div>
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
