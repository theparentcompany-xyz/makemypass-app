import Theme from '../../../components/Theme/Theme';
import styles from './PostEvent.module.css';
import SectionButton from '../../../components/SectionButton/SectionButton';
import { LuMailPlus, LuMailX } from 'react-icons/lu';
import { sentPostEventMail } from '../../../apis/postevent';
import { useState } from 'react';
import Modal from '../../../components/Modal/Modal';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';

const PostEvent = () => {
  const [openConfirmModal, setConfirmModal] = useState({
    confirm: false,
    value: false,
  });

  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);

  return (
    <>
      {openConfirmModal && openConfirmModal.confirm && (
        <Modal>
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
              className={`pointer ${styles.button}`}
            >
              Sent Mails
            </p>
            <p
              onClick={() => {
                setConfirmModal({ confirm: false, value: false });
              }}
              className={`pointer ${styles.button}`}
            >
              Cancel
            </p>
          </div>
        </Modal>
      )}
      <Theme>
        <DashboardLayout prevPage='-1'>
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
        </DashboardLayout>
      </Theme>
    </>
  );
};

export default PostEvent;
