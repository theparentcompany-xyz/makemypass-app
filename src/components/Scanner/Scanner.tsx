import { useNavigate } from 'react-router';
import SecondaryButton from '../../pages/app/Overview/components/SecondaryButton/SecondaryButton';
import styles from './Scanner.module.css';
import { QrScanner } from '@yudiel/react-qr-scanner';
import toast from 'react-hot-toast';

const Scanner = ({
  ticketId,
  setTicketId,
  trigger,
  setTrigger,
  scanCount,
}: {
  ticketId: string;
  setTicketId: (ticketId: string) => void;
  trigger: boolean;
  setTrigger: (trigger: boolean) => void;
  scanCount: number;
}) => {
  const navigate = useNavigate();
  return (
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
  );
};

export default Scanner;
