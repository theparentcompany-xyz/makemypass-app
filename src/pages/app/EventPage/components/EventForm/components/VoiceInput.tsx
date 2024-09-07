/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IoMicOutline } from 'react-icons/io5';
import { PropagateLoader } from 'react-spinners';
import { useVoiceVisualizer, VoiceVisualizer } from 'react-voice-visualizer';

import { parseAudio } from '../../../../../../apis/publicpage';
import { FormDataType } from '../../../../../../apis/types';
import { FormEventData } from '../../../../Guests/types';
import { AudioControlsType } from '../../../types';
import styles from './VoiceInput.module.css';

const VoiceInput = ({
  eventFormData,
  formData,
  setFormData,
}: {
  eventFormData: FormEventData;
  formData: FormDataType;
  setFormData: Dispatch<React.SetStateAction<FormDataType>>;
}) => {
  const handleAudioSubmit = (recordedBlob: Blob | null) => {
    if (recordedBlob && eventFormData.id && formData && setFormData) {
      parseAudio(eventFormData.id, recordedBlob, formData, setFormData, setShowAudioModal);
    }
  };

  const [permissionError, setPermissionError] = useState<boolean>(false);

  const [showAudioModal, setShowAudioModal] = useState<AudioControlsType>({
    showModal: false,
    transcribing: false,
    noData: false,
  });

  const recorderControls = useVoiceVisualizer();
  const { recordedBlob, error, audioRef } = recorderControls;

  const closeAudioModal = () => {
    setShowAudioModal({
      showModal: false,
      transcribing: false,
      noData: false,
    });
    recorderControls.stopRecording();
  };

  useEffect(() => {
    if (error) {
      setPermissionError(true);
    }
  }, [error]);

  useEffect(() => {
    if (showAudioModal.noData) {
      recorderControls.clearCanvas();
    }
  }, [showAudioModal.noData]);

  useEffect(() => {
    if (recordedBlob && showAudioModal.showModal) {
      handleAudioSubmit(recordedBlob);
    }
  }, [recordedBlob]);

  return (
    <>
      {' '}
      {!(recorderControls.isRecordingInProgress || recorderControls.isAvailableRecordedAudio) ? (
        <button
          onClick={() => {
            if (permissionError) {
              toast.error('Audio permission denied');
              return;
            }

            recorderControls.startRecording();
            setShowAudioModal({
              ...showAudioModal,
              transcribing: false,
              noData: false,
            });
          }}
          className={styles.reocordUsingVoiceButton}
        >
          {showAudioModal.transcribing ? (
            <PropagateLoader
              color={'#fff'}
              loading={showAudioModal.transcribing}
              size={10}
              style={{
                padding: '0.75rem 1.5rem',
                paddingTop: '0.5rem',
              }}
            />
          ) : (
            <>
              <IoMicOutline
                size={18}
                style={{
                  marginRight: '0.5rem',
                }}
              />
              Record Voice to Fill <span>(Beta)</span>
            </>
          )}
        </button>
      ) : (
        <>
          <div className={styles.buttonsContainer}>
            <button className={styles.cancelButton} onClick={closeAudioModal}>
              Cancel
            </button>
            <div className={styles.durationContainer}>
              <p className={styles.duration}>{recorderControls.formattedRecordingTime}s</p>
              <div className={styles.vizualizer}>
                <VoiceVisualizer
                  ref={audioRef}
                  controls={recorderControls}
                  isControlPanelShown={false}
                  isDefaultUIShown={false}
                  height={'50'}
                  mainBarColor='#A0FFC8'
                  barWidth={3}
                  rounded={5}
                  speed={2}
                />
              </div>
            </div>
            <button
              className={styles.submitButton}
              onClick={() => {
                recorderControls.stopRecording();
                setShowAudioModal({
                  ...showAudioModal,
                  showModal: true,
                });
              }}
            >
              Submit
            </button>
          </div>
        </>
      )}
      <p className={styles.noDataAlert}>
        {showAudioModal.noData ? 'No data found in your audio. Please record again.' : ''}
      </p>
      <div className={styles.orContainer}>
        <hr />
        <p>OR</p>
        <hr />
      </div>
    </>
  );
};

export default VoiceInput;
