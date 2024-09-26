import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash } from 'react-icons/fa';

import {
  createEventSpeaker,
  deleteEventSpeaker,
  updateEventSpeaker,
} from '../../../../../apis/speakers';
import { SpeakerCRUDType } from '../../../../../apis/types';
import { isUserEditor } from '../../../../../common/commonFunctions';
import Modal from '../../../../../components/Modal/Modal';
import InputField from '../../../../auth/Login/InputField';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import styles from './SpeakerModal.module.css';
import { SpeakerType } from './types';

const SpeakerModal = ({
  speakers,
  setSpeakers,
}: {
  eventId: string;
  speakers: SpeakerCRUDType;
  setSpeakers: Dispatch<SetStateAction<SpeakerCRUDType>>;
}) => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [speakerData, setSpeakerData] = useState<SpeakerType>({
    id: '',
    name: '',
    position: '',
    image: null,
    type: '',
  });

  useEffect(() => {
    console.log(speakers.speakerList);
  }, [speakers]);

  return (
    <>
      {(speakerData.type === 'CREATE' || speakerData.type === 'EDIT') && (
        <Modal
          title='Add Speaker'
          onClose={() => {
            setSpeakers((prev) => ({
              ...prev,
              showModal: false,
            }));
          }}
        >
          <>
            <div className={styles.bulkUploadContainer}>
              <InputField
                placeholder='Enter Speaker Name'
                type='text'
                name='speaker_name'
                id='speaker_name'
                icon={<></>}
                value={speakerData?.name}
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
                value={speakerData.position}
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
                    image: event.target.files![0],
                  });
                }}
              />
            </div>

            <div className={styles.createButtons}>
              <button
                className={styles.uploadButton}
                onClick={() => {
                  if (speakerData.type === 'CREATE')
                    createEventSpeaker(eventId, speakerData, setSpeakers);
                  else if (speakerData.type === 'EDIT')
                    updateEventSpeaker(eventId, speakerData, setSpeakers);

                  setSpeakerData({
                    id: '',
                    name: '',
                    position: '',
                    image: null,
                    type: '',
                  });
                }}
              >
                Save Speaker
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setSpeakerData({
                    id: '',
                    name: '',
                    position: '',
                    image: null,
                    type: '',
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </>
        </Modal>
      )}

      {speakerData.type === 'DELETE' && speakerData.id ? (
        <Modal
          title='Delete Confirmation'
          onClose={() => {
            setSpeakerData(
              (prev) =>
                ({
                  ...prev,
                  type: '',
                }) as SpeakerType,
            );
          }}
        >
          <p className={styles.deleteText}>Are you sure you want to delete this speaker?</p>
          <div className={styles.deleteButtons}>
            <button
              className={styles.deleteButton}
              onClick={() => {
                deleteEventSpeaker(eventId, speakerData.id, setSpeakers);
                setSpeakerData({
                  id: '',
                  name: '',
                  position: '',
                  image: null,
                  type: '',
                });
              }}
            >
              Delete
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => {
                setSpeakerData(
                  (prev) =>
                    ({
                      ...prev,
                      type: '',
                    }) as SpeakerType,
                );
              }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      ) : (
        <Modal
          title='Add Speaker'
          onClose={() => {
            setSpeakers((prev) => ({
              ...prev,
              showModal: false,
            }));
          }}
        >
          <div className={styles.listHeader}>
            <p
              className={styles.sectionHeader}
            >{`Current Speaker (${speakers.speakerList.length})`}</p>
            {isUserEditor() && (
              <SecondaryButton
                buttonText='Add Speaker'
                onClick={() => {
                  setSpeakerData({
                    id: '',
                    name: '',
                    position: '',
                    image: null,
                    type: 'CREATE',
                  });
                }}
              />
            )}
          </div>
          <div className={styles.logsListingContainer}>
            {speakers.speakerList &&
              speakers.speakerList.length > 0 &&
              speakers.speakerList.map((speaker) => (
                <div className={styles.log}>
                  <div className={styles.logDetails}>
                    {(typeof speaker?.image === 'string' || speaker.image instanceof File) && (
                      <img
                        className={styles.speakerImage}
                        src={
                          typeof speaker.image === 'string'
                            ? speaker.image
                            : speaker.image
                              ? URL.createObjectURL(speaker.image)
                              : ''
                        }
                        alt=''
                      />
                    )}
                    <div>
                      {speaker?.name && <p className={styles.venueName}>{speaker.name}</p>}
                      {speaker?.position && (
                        <p className={styles.total} style={{ marginTop: '0.25rem' }}>
                          {speaker.position}
                        </p>
                      )}
                    </div>
                  </div>

                  {isUserEditor() && (
                    <div className='row'>
                      <FaTrash
                        title='Delete User'
                        color='#8e8e8e'
                        className={styles.reportIcon}
                        onClick={() => {
                          setSpeakerData({
                            id: speaker.id,
                            name: speaker.name,
                            position: speaker.position,
                            image: null,
                            type: 'DELETE',
                          });
                        }}
                      />
                      <FaEdit
                        title='Edit Speaker'
                        color='#8e8e8e'
                        className={styles.reportIcon}
                        onClick={() => {
                          if (!speaker) return;
                          const imageURL = speaker?.image;
                          if (typeof imageURL === 'string')
                            fetch(imageURL)
                              .then((response) => response.blob())
                              .then((blob) => {
                                const file = new File([blob], speaker.name);
                                setSpeakerData((prev) => ({
                                  ...prev,
                                  image: file,
                                }));
                              })
                              .catch((error) => {
                                toast.error(
                                  error.response.data.message.general[0] ||
                                    'Unable to process the request',
                                );
                              });
                          else
                            setSpeakerData((prev) => ({
                              ...prev,
                              image: speaker.image,
                            }));

                          setSpeakerData((prev) => ({
                            ...prev,
                            id: speaker.id,
                            name: speaker.name,
                            position: speaker.position,
                            type: 'EDIT',
                          }));
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
          </div>
        </Modal>
      )}
    </>
  );
};

export default SpeakerModal;
