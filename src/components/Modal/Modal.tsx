import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

type ModalProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClose?: () => void;
};

const Modal = ({ children, onClose, ...inputProps }: ModalProps) => {
  return ReactDOM.createPortal(
    <>
      <div onClick={onClose} className={styles.backgroundBlur}></div>
      <dialog {...inputProps} className={styles.onClickModal} style={inputProps.style}>
        {children}
      </dialog>
    </>,
    document.getElementById('root') as Element,
  );
};

export default Modal;
