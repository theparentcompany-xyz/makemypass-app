import styles from './AudioRecorder.module.css';
import Modal from '../../../../../../components/Modal/Modal';
import { VoiceVisualizer, useVoiceVisualizer } from 'react-voice-visualizer';
import { Dispatch, useEffect } from 'react';
import { AudioControlsType } from '../../../types';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { FaMicrophone } from 'react-icons/fa6';

const AudioRecorder = ({
  showAudioModal,
  setShowAudioModal,
  handleAudioSubmit,
}: {
  showAudioModal: AudioControlsType;
  setShowAudioModal: Dispatch<React.SetStateAction<AudioControlsType>>;
  handleAudioSubmit: (recordedBlob: Blob | null) => void;
}) => {
  const recorderControls = useVoiceVisualizer();
  const { recordedBlob, error, audioRef } = recorderControls;

  const closeAudioModal = () => {
    setShowAudioModal({
      showModal: false,
      transcribing: false,
      noData: false,
    });
  };

  useEffect(() => {
    if (!error) return;
    toast.error('Audio input not detected');
  }, [error]);

  useEffect(() => {
    if (showAudioModal.noData) {
      recorderControls.clearCanvas();
    }
  }, [showAudioModal.noData]);

  useEffect(() => {
    recorderControls.startRecording();
    setShowAudioModal({
      ...showAudioModal,
      transcribing: false,
      noData: false,
    });
  }, []);

  useEffect(() => {
    if (recordedBlob) {
      handleAudioSubmit(recordedBlob);
    }
  }, [recordedBlob]);

  return (
    <>
      <Modal title='Record your voice' onClose={closeAudioModal}>
        <div className={styles.voiceModalContainer}>
          <div className={styles.voiceImage} onClick={() => {}}>
            {(recorderControls.isCleared ||
              (!recorderControls.isRecordingInProgress && !recordedBlob)) && (
              <FaMicrophone className={styles.micImage} size={50} />
            )}
            <div className={styles.visualizer}>
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
        </div>

        <p className={styles.noDataAlert}>
          {showAudioModal.noData
            ? 'We found no field from your audio to fill in, Kindly record again.'
            : ''}
        </p>

        {(recorderControls.isRecordingInProgress || recorderControls.isAvailableRecordedAudio) && (
          <button
            className={styles.voiceSubmitButton}
            onClick={() => {
              recorderControls.stopRecording();
              handleAudioSubmit(recordedBlob);
            }}
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
              'Submit'
            )}
          </button>
        )}
      </Modal>
    </>
  );
};

export default AudioRecorder;
