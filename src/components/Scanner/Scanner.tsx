import { QrScanner } from '@yudiel/react-qr-scanner';
import { Dispatch } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { HashLoader } from 'react-spinners';

import { RoomType } from '../../pages/app/CheckIns/pages/ScanQR/types';
import SecondaryButton from '../../pages/app/Overview/components/SecondaryButton/SecondaryButton';
import styles from './Scanner.module.css';

const Scanner = ({
  ticketId,
  setTicketId,
  trigger,
  setTrigger,
  checking,
  onClose,
  setRoomNumber,
}: {
  ticketId: string | undefined;
  setTicketId: Dispatch<React.SetStateAction<string>> | undefined;
  trigger: boolean;
  setTrigger: (trigger: boolean) => void;
  checking?: boolean;
  onClose?: () => void;
  setRoomNumber?: Dispatch<React.SetStateAction<RoomType>>;
}) => {
  const navigate = useNavigate();
  return (
    <div className={styles.scannerContainer}>
      <p className={styles.scanHeader}>Scan QR Code Below</p>
      <div className={styles.scannerOuterContainer}>
        <div className={styles.scanner}>
          <div className={styles.closeButton}>
            <SecondaryButton
              buttonText='Set Room'
              onClick={() => {
                if (setRoomNumber) {
                  setRoomNumber({
                    roomNumber: '',
                    showModel: true,
                  });
                }
              }}
            />
            <SecondaryButton
              buttonText='Close'
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  navigate(-1);
                }
              }}
            />
          </div>
          <QrScanner
            containerStyle={{
              backgroundColor: '#000',
            }}
            onResult={(result) => {
              if (setTicketId) {
                setTicketId(result.getText());
              }

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
            if (setTicketId) setTicketId(e.target.value);

            if (trigger) {
              setTrigger(false);
            }
          }}
        />
        <div className={styles.secondaryButtons}>
          <SecondaryButton
            buttonText='Continue'
            onClick={() => {
              setTrigger(true);
            }}
          />
          <SecondaryButton
            buttonText='Clear Scan'
            onClick={() => {
              if (setTicketId) setTicketId('');
              setTrigger(false);
            }}
          />
        </div>
      </div>

      {checking && (
        <div className={styles.checkingContainer}>
          <HashLoader color='#47c97e' size={50} />
          <p className={styles.checkingText}>Checking...</p>
        </div>
      )}
    </div>
  );
};

export default Scanner;
