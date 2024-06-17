import styles from './AudioRecorder.module.css';
import Modal from '../../../../../../components/Modal/Modal';
import { FaMicrophone, FaPause, FaPlay, FaStop, FaTrash } from 'react-icons/fa6';
import { VoiceVisualizer, useVoiceVisualizer } from 'react-voice-visualizer';
import { Dispatch, useEffect } from 'react';
import { AudioControlsType } from '../../../types';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';

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

  return (
    <>
      <Modal title='Record your voice' onClose={closeAudioModal}>
        <div className={styles.voiceModalContainer}>
          <div className={styles.voiceImage}>
            <FaMicrophone className={styles.micImage} size={50} color='#A0FFC8' />
            <div className={styles.visualizer}>
              <VoiceVisualizer
                ref={audioRef}
                controls={recorderControls}
                isControlPanelShown={false}
                isDefaultUIShown={false}
                height={'50'}
                mainBarColor='#5E5D5D'
                barWidth={3}
                rounded={5}
                speed={2}
              />
            </div>
          </div>
        </div>

        <div className={styles.voiceButtons}>
          {!recorderControls.isCleared ? (
            <>
              <button className={styles.inModalVoiceButton} onClick={recorderControls.clearCanvas}>
                {<FaTrash />}
              </button>
            </>
          ) : (
            <button
              className={styles.inModalVoiceButton}
              onClick={() => {
                recorderControls.startRecording();
                setShowAudioModal({
                  ...showAudioModal,
                  noData: false,
                });
              }}
            >
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

        <p className={styles.noDataAlert}>
          {showAudioModal.noData
            ? 'We found no field from your audio to fill in, Kindly record again.'
            : ''}
        </p>

        {(recorderControls.isRecordingInProgress || recorderControls.isAvailableRecordedAudio) && (
          <button
            className={styles.voiceSubmitButton}
            onClick={() => handleAudioSubmit(recordedBlob)}
            disabled={
              !recorderControls.isAvailableRecordedAudio ||
              showAudioModal.transcribing ||
              recorderControls.isRecordingInProgress
            }
            style={
              !recorderControls.isAvailableRecordedAudio || recorderControls.isRecordingInProgress
                ? { opacity: 0.5 }
                : {}
            }
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
