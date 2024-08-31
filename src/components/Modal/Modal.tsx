import ReactDOM from 'react-dom';
import styles from './Modal.module.css';
import ManageTicketHeader from '../../pages/app/EventGlance/components/ManageTickets/components/ManageTicketHeader/ManageTicketHeader';

type ModalProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClose?: () => void;
  type?: string;
  title?: string;
  zIndexCount?: number;
};

const Modal = ({
  children,
  onClose,
  style,
  type,
  title,
  zIndexCount,
  ...inputProps
}: ModalProps) => {
  return ReactDOM.createPortal(
    type && type == 'side' ? (
      <>
        <div
          onClick={onClose}
          className={styles.backgroundBlur}
          style={{
            zIndex: zIndexCount,
          }}
        ></div>
        <dialog {...inputProps} className={styles.sideModal}>
          <ManageTicketHeader title={title} onClose={onClose} />
          {children}
        </dialog>
      </>
    ) : (
      <>
        <div onClick={onClose} className={styles.backgroundBlur}></div>
        <dialog {...inputProps} className={styles.onClickModal} style={style}>
          {title && (
            <div className={styles.modalHeader}>
              <p className={styles.modalHeaderText}>{title}</p>
              <button onClick={onClose} className={styles.closeButton}>
                X
              </button>
            </div>
          )}
          {children}
        </dialog>
      </>
    ),
    document.getElementById('root') as Element,
  );
};

export default Modal;
