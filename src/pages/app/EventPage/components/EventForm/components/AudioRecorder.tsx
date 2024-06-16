import styles from './AudioRecorder.module.css';
import Modal from '../../../../../../components/Modal/Modal';
import { FaMicrophone, FaPause, FaPlay, FaStop, FaTrash } from 'react-icons/fa6';
import { VoiceVisualizer, useVoiceVisualizer } from 'react-voice-visualizer';
import { Dispatch, useEffect } from 'react';
import { AudioControlsType } from '../../../types';
import { PropagateLoader } from 'react-spinners';

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
  const {
    // ... (Extracted controls and states, if necessary)
    recordedBlob,
    error,
    audioRef,
  } = recorderControls;

  const closeAudioModal = () => {
    setShowAudioModal({
      showModal: false,
      transcribing: false,
    });
  };

  useEffect(() => {
    if (!error) return;
    console.error(error);
  }, [error]);

  return (
    <>
      <Modal title='Record your voice' onClose={closeAudioModal}>
        <div className={styles.voiceModalContainer}>
          <div className={styles.voiceImage}>
            <FaMicrophone size={50} color='#A0FFC8' />
          </div>
        </div>

        <div className={styles.visualizer}>
          <VoiceVisualizer
            ref={audioRef}
            controls={recorderControls}
            isControlPanelShown={false}
            isDefaultUIShown={false}
            height={'50'}
          />
        </div>

        <div className={styles.voiceButtons}>
          {!recorderControls.isCleared ? (
            <>
              <button className={styles.inModalVoiceButton} onClick={recorderControls.clearCanvas}>
                {<FaTrash />}
              </button>
            </>
          ) : (
            <button className={styles.inModalVoiceButton} onClick={recorderControls.startRecording}>
              Tap to record
            </button>
          )}
          {recorderControls.isRecordingInProgress && (
            <>
              <button className={styles.inModalVoiceButton}>
                {recorderControls.formattedRecordingTime}
              </button>
              <button
                className={styles.inModalVoiceButton}
                onClick={recorderControls.stopRecording}
              >
                {<FaStop />}
              </button>
              <button
                className={styles.inModalVoiceButton}
                onClick={recorderControls.togglePauseResume}
              >
                {recorderControls.isPausedRecording ? <FaPlay /> : <FaPause />}
              </button>
            </>
          )}
          {recorderControls.isAvailableRecordedAudio && (
            <>
              <button
                className={styles.inModalVoiceButton}
                onClick={recorderControls.togglePauseResume}
              >
                {recorderControls.isPausedRecordedAudio ? <FaPlay /> : <FaPause />}
              </button>
            </>
          )}
        </div>

        {(recorderControls.isRecordingInProgress || recorderControls.isAvailableRecordedAudio) && (
          <button
            className={styles.voiceSubmitButton}
            onClick={() => handleAudioSubmit(recordedBlob)}
            disabled={!recorderControls.isAvailableRecordedAudio}
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
              'Fill Form'
            )}
          </button>
        )}
      </Modal>
    </>
  );
};

export default AudioRecorder;
