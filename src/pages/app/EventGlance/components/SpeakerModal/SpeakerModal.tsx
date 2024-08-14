import { Dispatch, SetStateAction, useState } from 'react';
import { SpeakerCRUDType } from '../../../../../apis/types';
import Modal from '../../../../../components/Modal/Modal';
import InputField from '../../../../auth/Login/InputField';
import styles from './SpeakerModal.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { updateSpeakerList } from '../../../../../apis/speakers';
// import toast from 'react-hot-toast';
// import { listSpeakers, updateSpeakerList } from '../../../../../apis/speakers';
import { v4 as uuidv4 } from 'uuid';

const SpeakerModal = ({
  eventId,
  speakers,
  setSpeakers,
}: {
  eventId: string;
  speakers: SpeakerCRUDType;
  setSpeakers: Dispatch<SetStateAction<SpeakerCRUDType>>;
}) => {
  const [speakerData, setSpeakerData] = useState({
    id: uuidv4(),
    name: '',
    position: '',
    image: '',
  });

  const updateSpeakerInformation = () => {
    updateSpeakerList([...speakers.speakerList, speakerData], eventId);
  };

  return (
    <Modal
      title='Add Speaker'
      onClose={() => {
        setSpeakers((prev) => ({
          ...prev,
          showModal: false,
        }));
      }}
    >
      <div className={styles.bulkUploadContainer}>
        <InputField
          placeholder='Enter Speaker Name'
          type='text'
          name='speaker_name'
          id='speaker_name'
          icon={<></>}
          onChange={(event) => {
            setSpeakerData({
              ...speakerData,
              name: event.target.value,
            });
          }}
        />
        <InputField
          placeholder='Enter Speaker Position'
          type='text'
          name='speaker_name'
          id='speaker_name'
          icon={<></>}
          onChange={(event) => {
            setSpeakerData({
              ...speakerData,
              position: event.target.value,
            });
          }}
        />

        <InputField
          placeholder='Enter Speaker Image URL'
          type='file'
          name='speaker_name'
          id='speaker_name'
          icon={<></>}
          onChange={(event) => {
            setSpeakerData({
              ...speakerData,
              image: event.target.value,
            });
          }}
        />
      </div>

      <button
        className={styles.uploadButton}
        onClick={() => {
          updateSpeakerInformation();
          setSpeakers((prev) => ({
            ...prev,
            showModal: false,
          }));
        }}
      >
        Save Speaker
      </button>

      <hr className={styles.line} />

      <p className={styles.sectionHeader}>Upload Logs</p>
      <div className={styles.logsListingContainer}>
        {speakers.speakerList.map((speaker) => (
          <div className={styles.log}>
            <div className={styles.logDetails}>
              <img className={styles.speakerImage} src={speaker.image} alt='' />
              <div>
                <p className={styles.logName}>{speaker.name}</p>
                <p className={styles.total} style={{ marginTop: '0.25rem' }}>
                  {speaker.position}
                </p>
              </div>
            </div>

            <div className='row'>
              <FaTrash title='Download Report' color='#8e8e8e' className={styles.reportIcon} />
              <FaEdit
                title='Edit Venue'
                color='#8e8e8e'
                className={styles.reportIcon}
                onClick={() => {
                  setSpeakerData({
                    id: speaker.id,
                    name: speaker.name,
                    position: speaker.position,
                    image: speaker.image,
                  });
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default SpeakerModal;
