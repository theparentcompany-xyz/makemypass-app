import { useEffect, useState } from 'react';
import styles from './Header.module.css';
import { getEventData, getEventId } from '../../../../../apis/events';
import { useParams } from 'react-router-dom';

const Header = ({ setRole }: { setRole?: React.Dispatch<React.SetStateAction<string>> }) => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    role: '',
  });
  const [eventId, setEventId] = useState<string>('');
  const { eventTitle } = useParams<{ eventTitle: string }>();

  useEffect(() => {
    let eventData = JSON.parse(localStorage.getItem('eventData') as string);

    if (!eventData)
      setTimeout(() => {
        eventData = JSON.parse(localStorage.getItem('eventData') as string);

        if (eventData) {
          if (eventData.event_name !== eventTitle) {
            localStorage.removeItem('eventData');
            getEventId(eventTitle ?? '');
          } else {
            setEventId(eventData.event_id);
          }
        }
      }, 2000);

    setEventId(eventData?.event_id);
  }, [eventTitle]);

  useEffect(() => {
    if (eventId) getEventData(eventId, setEventData);
  }, [eventId]);

  useEffect(() => {
    if (setRole) setRole(eventData.role);
  }, [eventData, setRole]);

  return (
    <>
      <div className={styles.headerRow}>
        <p className={styles.headerText}>
          <img className={styles.headerImage} src='/scale.webp' alt='' />
          {eventData?.title}
        </p>
        <div className='row'>
          <p className={styles.date}>{eventData?.date}</p>
          <img src='/app/live.gif' alt='' className={styles.gif} />
        </div>
      </div>
      <hr className={styles.line} />
    </>
  );
};

export default Header;
