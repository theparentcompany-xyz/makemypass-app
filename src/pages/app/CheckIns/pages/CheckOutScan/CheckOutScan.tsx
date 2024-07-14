import { useEffect, useState } from 'react';
import Scanner from '../../../../../components/Scanner/Scanner';
import Theme from '../../../../../components/Theme/Theme';
import CheckInHeader from '../../components/CheckInHeader/CheckInHeader/CheckInHeader';
import { checkOutUser } from '../../../../../apis/scan';
import styles from './CheckOutScan.module.css';
import { LogType } from '../Venue/Venue';
import ScannerResponseModal from '../../components/ScannerResponseModal/ScannerResponseModal';
import ScanLogs from '../../components/ScanLogs/ScanLogs';

const CheckOutScan = () => {
  const [ticketId, setTicketId] = useState('');
  const [trigger, setTrigger] = useState(false);

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [checking, setChecking] = useState(false);

  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);

  const [scanLogs, setScanLogs] = useState<LogType[]>([]);

  useEffect(() => {
    if (ticketId.length > 0) {
      checkOutUser(ticketId, eventId, setScanLogs, setMessage, setIsError, setChecking);
      setTimeout(() => {
        setTicketId('');
        setTrigger(false);
      }, 2500);
    }
  }, [trigger]);

  return (
    <Theme>
      <div className={styles.checkOutContainer}>
        <CheckInHeader title='Check-Out' buttonType='back' />
        <hr className={styles.line} />
        <ScannerResponseModal
          message={message}
          setMessage={setMessage}
          isError={isError}
          setIsError={setIsError}
        />
        <Scanner
          ticketId={ticketId}
          setTicketId={setTicketId}
          trigger={trigger}
          setTrigger={setTrigger}
          checking={checking}
        />
        <ScanLogs scanLogs={scanLogs} />
      </div>
    </Theme>
  );
};

export default CheckOutScan;
