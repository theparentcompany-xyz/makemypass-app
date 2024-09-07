import React from 'react';

import Modal from '../Modal';
import styles from './DeleteModal.module.css';

type Props = {
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: () => void;
  deleteText: string;
  style?: React.CSSProperties;
};

const ConfirmDelete = ({ setDeleteModal, onDelete, deleteText, style }: Props) => {
  return (
    <>
      <Modal onClose={() => setDeleteModal(false)} style={style} title=' '>
        <div className={styles.modalContainer}>
          <div className={styles.sectionContent1}>
            <p className={styles.sectionSubTitle}>{deleteText}</p>
          </div>
          <div className={styles.modalButtons}>
            <button
              className={styles.confirmButton}
              onClick={() => {
                onDelete();
                setDeleteModal(false);
              }}
            >
              Delete
            </button>
            <button
              onClick={() => {
                setDeleteModal(false);
              }}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmDelete;
