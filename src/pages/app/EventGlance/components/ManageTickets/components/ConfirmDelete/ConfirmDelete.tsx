import React from 'react';

import styles from './ConfirmDelete.module.css';
import { TicketType } from '../../../../../../../apis/types';
type Props = {
  selectedTicket: TicketType | undefined;
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteTicket: () => void;
};

const ConfirmDelete = ({ selectedTicket, setDeleteModal, onDeleteTicket }: Props) => {
  return (
    <>
      <div className={styles.modalContainer}>
        {/* Get Confirmation to continue event though user has not saved changes.*/}
        <div className={styles.sectionContent1}>
          <p className={styles.sectionSubTitle}>
            Are you sure you want to Delete{' '}
            {selectedTicket?.title ? selectedTicket?.title : 'this ticket'}?
          </p>
        </div>
        <div className={styles.modalButtons}>
          <button
            className={styles.confirmButton}
            onClick={() => {
              onDeleteTicket();
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
    </>
  );
};

export default ConfirmDelete;
