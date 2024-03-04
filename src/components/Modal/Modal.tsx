import styles from './Modal.module.css';

type ModalProps = {
  style?: React.CSSProperties;
  children: React.ReactNode;
};

const Modal = ({ children, ...inputProps }: ModalProps) => {
  return (
    <>
      <div className={styles.backgroundBlur}></div>
      <dialog {...inputProps} className={styles.onClickModal}>
        {children}
      </dialog>
    </>
  );
};

export default Modal;
