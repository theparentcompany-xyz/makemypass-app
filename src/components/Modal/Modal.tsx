import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

type ModalProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClose?: () => void;
  type?: string;
};

const Modal = ({ children, onClose, style, type, ...inputProps }: ModalProps) => {
  return ReactDOM.createPortal(
    type && type == 'side' ? (
      <>
        <div onClick={onClose} className={styles.backgroundBlur} style={style}></div>
        <dialog {...inputProps} className={styles.sideModal} style={style}>
          {children}
        </dialog>
      </>
    ) : (
      <>
        <div onClick={onClose} className={styles.backgroundBlur} style={style}></div>
        <dialog {...inputProps} className={styles.onClickModal} style={style}>
          {children}
        </dialog>
      </>
    ),
    document.getElementById('root') as Element,
  );
};

export default Modal;
