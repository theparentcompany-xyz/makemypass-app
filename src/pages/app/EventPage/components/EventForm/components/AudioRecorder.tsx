import styles from './AudioRecorder.module.css';
import Modal from '../../../../../../components/Modal/Modal';
import { FaMicrophone, FaPlay } from 'react-icons/fa6';
import { IoClose, IoPause } from 'react-icons/io5';
import { AudioControlsType } from '../../../types';

const AudioRecorder = ({
  audioControls,
  setAudioControls,
}: {
  audioControls: AudioControlsType;
  setAudioControls: React.Dispatch<React.SetStateAction<AudioControlsType>>;
}) => {
  const closeAudioModal = () => {
    setAudioControls({
      showModal: false,
      showAudioControls: false,
    });
  };
  return (
    <>
      <Modal title='Record your voice' onClose={closeAudioModal}>
        <div className={styles.voiceModalContainer}>
          <div className={styles.voiceImage}>
            <FaMicrophone size={50} color='#A0FFC8' />
          </div>
        </div>
        {audioControls.showAudioControls ? (
          <div className={styles.voiceButtons}>
            <button className={styles.inModalVoiceButton}>13.01s</button>
            <button className={styles.inModalVoiceButton}>
              <FaPlay />
            </button>
            <button className={styles.inModalVoiceButton}>
              <IoPause />
            </button>
            <button className={styles.inModalVoiceButton} onClick={closeAudioModal}>
              <IoClose />
            </button>
          </div>
        ) : (
          <div className={styles.voiceButtons}>
            <button
              onClick={() => {
                setAudioControls({
                  showModal: true,
                  showAudioControls: true,
                });
              }}
              className={styles.inModalVoiceButton}
            >
              Tap to record
            </button>
          </div>
        )}

        <button className={styles.voiceSubmitButton}>Submit</button>
      </Modal>
    </>
  );
};

export default AudioRecorder;
