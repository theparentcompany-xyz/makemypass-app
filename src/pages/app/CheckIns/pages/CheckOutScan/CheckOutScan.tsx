import { useEffect, useState } from 'react';
import Scanner from '../../../../../components/Scanner/Scanner';
import Theme from '../../../../../components/Theme/Theme';
import CheckInHeader from '../../components/CheckInHeader/CheckInHeader/CheckInHeader';
import { checkOutUser } from '../../../../../apis/scan';
import styles from './CheckOutScan.module.css';
import { MdError, MdVerified } from 'react-icons/md';

const CheckOutScan = () => {
  const [ticketId, setTicketId] = useState('');
  const [trigger, setTrigger] = useState(false);

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [checking, setChecking] = useState(false);

  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);

  useEffect(() => {
    if (ticketId.length > 0) {
      checkOutUser(ticketId, eventId, setMessage, setIsError, setChecking);
      setTimeout(() => {
        setTicketId('');
      }, 2500);
    }
  }, [trigger]);

  return (
    <Theme>
      <div className={styles.checkOutContainer}>
        <CheckInHeader title='Check-Out' buttonType='back' />

        <Scanner
          ticketId={ticketId}
          setTicketId={setTicketId}
          trigger={trigger}
          setTrigger={setTrigger}
          checking={checking}
        />

        {message && message.length > 0 && (
          <div className={styles.messageContainer}>
            {isError ? (
              <MdError color='#f04b4b' size={40} />
            ) : (
              <MdVerified color='#47c97e' size={40} />
            )}
            <p
              style={isError ? { color: '#f04b4b' } : { color: '#47c97e' }}
              className={styles.message}
            >
              {message}
            </p>
          </div>
        )}
      </div>
    </Theme>
  );
};

export default CheckOutScan;
