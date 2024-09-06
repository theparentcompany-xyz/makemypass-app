import Theme from '../../../components/Theme/Theme';
import styles from './PostEvent.module.css';
import SectionButton from '../../../components/SectionButton/SectionButton';
import { LuMailPlus, LuMailX } from 'react-icons/lu';
import { TiTick } from 'react-icons/ti';
import { sentPostEventMail, getPostEventStatus } from '../../../apis/postevent';
import { useState, useEffect } from 'react';
import Modal from '../../../components/Modal/Modal';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';

const PostEvent = () => {
  const [openConfirmModal, setConfirmModal] = useState({
    confirm: false,
    value: false,
  });

  const [postEventStatus, setPostEventStatus] = useState<PostEventStatus>();
  useEffect(() => {
    getPostEventStatus(setPostEventStatus);
  }, []);
  return (
    <>
      {openConfirmModal && openConfirmModal.confirm && (
        <Modal>
          <p className={styles.modalHeader}>Send Mail</p>
          <p className={styles.modalSubText}>
            {(openConfirmModal.value && postEventStatus?.AfterEventThankYou) ||
            (!openConfirmModal.value && postEventStatus?.AfterEventSorry)
              ? `Are You Sure you want to send the mails to the ${postEventStatus?.AfterEventThankYou ? 'Participants' : 'Non-Participants'} again?`
              : 'Are you sure you want to send mails?'}
          </p>
          <div className={styles.buttons}>
            <p
              onClick={() => {
                sentPostEventMail(openConfirmModal.value).then(() => {
                  setPostEventStatus(
                    (prevStatus) =>
                      ({
                        ...prevStatus,
                        ...(openConfirmModal.value
                          ? { AfterEventThankYou: true }
                          : { AfterEventSorry: true }),
                      }) as PostEventStatus,
                  );
                });
                setTimeout(() => {
                  setConfirmModal({ confirm: false, value: false });
                }, 1000);
              }}
              className={`pointer ${styles.button}`}
            >
              Send Mails
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
        <DashboardLayout prevPage='-1' tabName='postevent'>
          <p className={styles.text}>Sent Mails</p>
          <div className={styles.postEventContainer}>
            <div className={styles.sbutton}>
              <SectionButton
                buttonText={`Participant`}
                onClick={() => {
                  setConfirmModal({ confirm: true, value: true });
                }}
                iconBefore={
                  postEventStatus?.AfterEventThankYou ? <TiTick size={28} color='' /> : <></>
                }
                icon={<LuMailPlus size={28} color='' />}
              />
            </div>
            <div className={styles.sbutton}>
              <SectionButton
                buttonText='Non Participant'
                onClick={() => {
                  setConfirmModal({ confirm: true, value: false });
                }}
                iconBefore={
                  postEventStatus?.AfterEventSorry ? <TiTick size={28} color='' /> : <></>
                }
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
