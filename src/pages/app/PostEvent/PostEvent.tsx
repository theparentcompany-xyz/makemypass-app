import Theme from '../../../components/Theme/Theme';
import styles from './PostEvent.module.css';
import SectionButton from '../../../components/SectionButton/SectionButton';
import { LuMailPlus, LuMailX } from 'react-icons/lu';
import { sentPostEventMail } from '../../../apis/postevent';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getEventId } from '../../../apis/events';

const PostEvent = () => {
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

  return (
    <>
      <Theme>
        <p className={styles.text}>Sent Mails</p>
        <div className={styles.postEventContainer}>
          <div className={styles.button}>
            <SectionButton
              buttonText='Participant'
              onClick={() => {
                sentPostEventMail(eventId, true);
              }}
              icon={<LuMailPlus size={28} color='' />}
            />
          </div>
          <div className={styles.button}>
            <SectionButton
              buttonText='Non Participant'
              onClick={() => {
                sentPostEventMail(eventId, false);
              }}
              icon={<LuMailX size={28} color='' />}
            />
          </div>
        </div>
      </Theme>
    </>
  );
};

export default PostEvent;
