import { useVoiceVisualizer, VoiceVisualizer } from 'react-voice-visualizer';
import styles from './AudioRecorder.module.css';
import { useEffect } from 'react';
import { FaMicrophone, FaPause, FaPlay, FaStop, FaTrash } from 'react-icons/fa6';

type Props = {
  handleSubmit: (recordedBlob: Blob | null) => void;
};
const AudioRecorder = ({ handleSubmit }: Props) => {
  const recorderControls = useVoiceVisualizer();
  const {
    // ... (Extracted controls and states, if necessary)
    recordedBlob,
    error,
    audioRef,
  } = recorderControls;

  // Get the error when it occurs

  useEffect(() => {
    if (!error) return;

    console.error(error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div>
        {!recorderControls.isCleared ? (
          <>
            <button className={styles.button} onClick={recorderControls.clearCanvas}>
              {<FaTrash />}
            </button>
          </>
        ) : (
          <button className={styles.button} onClick={recorderControls.startRecording}>
            <FaMicrophone />
          </button>
        )}
        {recorderControls.isRecordingInProgress && (
          <>
            <button className={styles.button} onClick={recorderControls.stopRecording}>
              {<FaStop />}
            </button>
            <button className={styles.button} onClick={recorderControls.togglePauseResume}>
              {recorderControls.isPausedRecording ? <FaPlay /> : <FaPause />}
            </button>
          </>
        )}
        {recorderControls.isAvailableRecordedAudio && (
          <>
            <button className={styles.button} onClick={recorderControls.togglePauseResume}>
              {recorderControls.isPausedRecordedAudio ? <FaPlay /> : <FaPause />}
            </button>
            <button className={styles.button} onClick={() => handleSubmit(recordedBlob)}>
              Submit
            </button>
          </>
        )}

        <div className={styles.visualizer}>
          <VoiceVisualizer
            ref={audioRef}
            controls={recorderControls}
            isControlPanelShown={false}
            isDefaultUIShown={false}
            height={'50'}
          />
        </div>

        {recorderControls.isRecordingInProgress && <p>{recorderControls.formattedRecordingTime}</p>}
        {recorderControls.isAvailableRecordedAudio && <p>{recorderControls.formattedDuration}</p>}
        {recorderControls.isCleared && <p>Press Mic to Start Recording</p>}
      </div>
    </div>
  );
};

export default AudioRecorder;
