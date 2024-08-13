import { Dispatch, SetStateAction, useRef } from 'react';
import { SpeakerCRUDType } from '../../../../../apis/types';
import Modal from '../../../../../components/Modal/Modal';
import InputField from '../../../../auth/Login/InputField';
import styles from './SpeakerModal.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
// import toast from 'react-hot-toast';
// import { listSpeakers, updateSpeakerList } from '../../../../../apis/speakers';
// import { v4 as uuidv4 } from 'uuid';

const SpeakerModal = ({
  eventId,
  speakers,
  setSpeakers,
}: {
  eventId: string;
  speakers: SpeakerCRUDType;
  setSpeakers: Dispatch<SetStateAction<SpeakerCRUDType>>;
}) => {
  const newSpeakerName = useRef<HTMLInputElement>(null);
  //   const selectedVenueId = useRef<string | null>(null);
  console.log(eventId);

  //   const updateStateVenueList = ({
  //     speakerName,
  //     speakerId,
  //   }: {
  //     speakerName: string;
  //     speakerId?: string;
  //   }) => {
  //     if (speakerId) {
  //       const newSpeakers = speakers.speakerList.map((speaker) => {
  //         if (speaker.id === speakerId) {
  //           return {
  //             ...speaker,
  //             name: speakerName,
  //           };
  //         }
  //         return speaker;
  //       });

  //       updateSpeakerList(newSpeakers, eventId)
  //         .then(() => {
  //           listSpeakers(eventId, setSpeakers);
  //         })
  //         .catch(() => {
  //           toast.error('Failed to update venue');
  //         });
  //     } else {
  //       const newSpeaker = {
  //         id: uuidv4(),
  //         name: speakerName,
  //         position: '',
  //         image: '',
  //       };

  //       updateSpeakerList([...speakers.speakerList, newSpeaker], eventId)
  //         .then(() => {
  //           listSpeakers(eventId, setSpeakers);
  //         })
  //         .catch(() => {
  //           toast.error('Failed to add venue');
  //         });
  //     }
  //   };

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
          ref={newSpeakerName}
        />
      </div>

      <button
        // onClick={() => {
        //   if (newSpeakerName.current?.value && !selectedVenueId.current) {
        //     updateStateVenueList({ venueName: newSpeakerName.current.value });
        //     newSpeakerName.current.value = '';
        //   } else if (newSpeakerName.current?.value && selectedVenueId.current) {
        //     updateStateVenueList({
        //       speakerName: newVenueName.current.value,
        //       speakerId: selectedVenueId.current,
        //     });
        //     newSpeakerName.current.value = '';
        //     selectedVenueId.current = null;
        //   } else {
        //     toast.error('Please enter a venue name');
        //   }
        // }}
        className={styles.uploadButton}
      >
        Save Venue
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
              <FaTrash
                title='Download Report'
                color='#8e8e8e'
                className={styles.reportIcon}
                onClick={() => {
                  //   if (venues.venueList.length > 1) {
                  //     setShowDeleteModal(true);
                  //   } else {
                  //     const newVenues = venues.venueList.filter((v) => v.id !== venue.id);
                  //     updateVenueList(newVenues, eventId);
                  //   }
                }}
              />
              <FaEdit title='Edit Venue' color='#8e8e8e' className={styles.reportIcon} />
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default SpeakerModal;
