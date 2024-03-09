import styles from './Modal.module.css';

type ModalProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClose: () => void;
};

const Modal = ({ children, onClose, ...inputProps }: ModalProps) => {
  return (
    <>
      <div onClick={onClose} className={styles.backgroundBlur}></div>
      <dialog {...inputProps} className={styles.onClickModal}>
        {children}
      </dialog>
    </>
  );
};

export default Modal;
