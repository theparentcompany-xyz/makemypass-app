import Theme from '../../../components/Theme/Theme';
import styles from './PostEvent.module.css';
import SectionButton from '../../../components/SectionButton/SectionButton';
import { LuMailPlus, LuMailX } from 'react-icons/lu';
import { sentPostEventMail } from '../../../apis/postevent';
import { useContext, useState } from 'react';
import Glance from '../../../components/Glance/Glance';
import { GlobalContext } from '../../../contexts/globalContext';

const PostEvent = () => {
  const [openConfirmModal, setConfirmModal] = useState({
    confirm: false,
    value: false,
  });

  const { eventId } = useContext(GlobalContext);

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
