import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Theme from '../Theme/Theme';
import styles from './ViewTicket.module.css';

const ViewTicket = () => {
  const location = useLocation();
  const [ticketURL, setTicketURL] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const ticketURLParam = searchParams.get('ticketURL');
    if (ticketURLParam) setTicketURL(ticketURLParam);
  }, [location.search]);

  return (
    <>
      <Theme>
        <div className={styles.ticketDisplayContainer}>
          <img src={ticketURL} alt='' className={styles.ticketImage} />
        </div>
      </Theme>
    </>
  );
};

export default ViewTicket;
