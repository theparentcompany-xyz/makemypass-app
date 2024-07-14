import { useNavigate } from 'react-router';
import SecondaryButton from '../../pages/app/Overview/components/SecondaryButton/SecondaryButton';
import styles from './Scanner.module.css';
import { QrScanner } from '@yudiel/react-qr-scanner';
import toast from 'react-hot-toast';
import { Dispatch } from 'react';
import { HashLoader } from 'react-spinners';

const Scanner = ({
  ticketId,
  setTicketId,
  trigger,
  setTrigger,
  checking,
}: {
  ticketId: string | undefined;
  setTicketId: Dispatch<React.SetStateAction<string>> | undefined;
  trigger: boolean;
  setTrigger: (trigger: boolean) => void;
  checking?: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <div className={styles.scannerContainer}>
      <p className={styles.scanHeader}>Scan QR Code Below</p>
      <div className={styles.scannerOuterContainer}>
        <div className={styles.scanner}>
          <div className={styles.closeButton}>
            <SecondaryButton
              buttonText='Close'
              onClick={() => {
                navigate(0);
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
        <SecondaryButton
          buttonText='Continue'
          onClick={() => {
            setTrigger(true);
          }}
        />
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
