import Theme from '../../../components/Theme/Theme';
import styles from './PostEvent.module.css';
import SectionButton from '../../../components/SectionButton/SectionButton';
import { LuMailPlus, LuMailX } from 'react-icons/lu';
import { sentPostEventMail } from '../../../apis/postevent';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getEventId } from '../../../apis/events';
import EventHeader from '../EventPage/components/EventHeader';
import Glance from '../../../components/Glance/Glance';

const PostEvent = () => {
  const [eventId, setEventId] = useState<string>('');
  const { eventTitle } = useParams<{ eventTitle: string }>();
  const [openConfirmModal, setConfirmModal] = useState({
    confirm: false,
    value: false,
  });

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
      {openConfirmModal && openConfirmModal.confirm && (
        <dialog className={styles.onClickModal}>
          <p className={styles.modalHeader}>Remove Host</p>
          <p className={styles.modalSubText}>Are you sure you want to sent mails?</p>
          <div className={styles.buttons}>
            <p
              onClick={() => {
                sentPostEventMail(eventId, openConfirmModal.value);
                setTimeout(() => {
                  setConfirmModal({ confirm: false, value: false });
                }, 1000);
              }}
              className={styles.button}
            >
              Sent Mails
            </p>
            <p
              onClick={() => {
                setConfirmModal({ confirm: false, value: false });
              }}
              className={styles.button}
            >
              Cancel
            </p>
          </div>
        </dialog>
      )}
      <Theme>
        <Glance tab='postevent' />
        <p className={styles.text}>Sent Mails</p>
        <div className={styles.postEventContainer}>
          <div className={styles.sbutton}>
            <SectionButton
              buttonText='Participant'
              onClick={() => {
                setConfirmModal({ confirm: true, value: true });
              }}
              icon={<LuMailPlus size={28} color='' />}
            />
          </div>
          <div className={styles.sbutton}>
            <SectionButton
              buttonText='Non Participant'
              onClick={() => {
                setConfirmModal({ confirm: true, value: false });
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
