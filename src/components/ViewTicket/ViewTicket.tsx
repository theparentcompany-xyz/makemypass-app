import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { viewGuestTicket } from '../../apis/guests';
import Theme from '../Theme/Theme';
import styles from './ViewTicket.module.css';

const ViewTicket = () => {
  const location = useLocation();
  const [eventRegisterId, setEventRegisterId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const eventId = JSON.parse(sessionStorage.getItem('eventData')!).event_id;

  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const eventRegistrationId = pathSegments[pathSegments.length - 1];

    setEventRegisterId(eventRegistrationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    if (eventRegisterId) {
      viewGuestTicket(eventId, eventRegisterId, setImageUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventRegisterId]);

  return (
    <>
      <Theme>
        <div className={styles.ticketDisplayContainer}>
          <img src={imageUrl} alt='' className={styles.ticketImage} />
        </div>
      </Theme>
    </>
  );
};

export default ViewTicket;
