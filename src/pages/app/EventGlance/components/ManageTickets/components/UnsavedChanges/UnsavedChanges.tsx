import React from 'react';
import styles from './UnsavedChanges.module.css';
import { TicketType } from '../../../../../../../apis/types';
type Props = {
  setIsChangedModal: React.Dispatch<React.SetStateAction<boolean>>;
  ticketData: TicketType[];
  ticketPair: TicketType[] | undefined;
  setIsTicketsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTicket: React.Dispatch<React.SetStateAction<TicketType | undefined>>;
  wantToClose: boolean;
  setWantToClose: React.Dispatch<React.SetStateAction<boolean>>;
  updateTicket: (ticket?: TicketType) => Promise<void>;
};

const UnsavedChanges = ({
  setIsChangedModal,
  ticketData,
  ticketPair,
  setIsTicketsOpen,
  setSelectedTicket,
  wantToClose,
  setWantToClose,
  updateTicket,
}: Props) => {
  return (
    <>
      <div className={styles.modalContainer}>
        {/* Get Confirmation to continue event though user has not saved changes.*/}
        <div className={styles.sectionContent1}>
          <p className={styles.sectionTitle}>You have unsaved changes</p>
          <p className={styles.sectionSubTitle}>
            Are you sure you want to continue without saving?
          </p>
        </div>
        <div className={styles.modalButtons}>
          <button
            className={styles.confirmButton}
            onClick={() => {
              setIsChangedModal(false);
              if (wantToClose) {
                setIsTicketsOpen(false);
                setWantToClose(false);
                return;
              }

              const [tempTicket, tempSelectedTicket] = ticketPair as TicketType[];
              tempTicket.id != tempSelectedTicket?.id &&
                setSelectedTicket(
                  Object.assign(
                    {},
                    ticketData.find((t) => t.id == tempTicket.id),
                  ),
                );
            }}
          >
            Continue without saving
          </button>
          <button
            onClick={() => {
              setIsChangedModal(false);
              const [tempTicket, tempSelectedTicket] = ticketPair as TicketType[];
              (tempTicket.id != tempSelectedTicket?.id || wantToClose) &&
                updateTicket(tempSelectedTicket as TicketType).then(() => {
                  setSelectedTicket(
                    Object.assign(
                      {},
                      ticketData.find((t) => t.id == tempTicket.id),
                    ),
                  );
                });
              if (wantToClose) {
                setIsTicketsOpen(false);
                setWantToClose(false);
                return;
              }
            }}
            className={styles.cancelButton}
          >
            Save changes and continue
          </button>
        </div>
      </div>
    </>
  );
};

export default UnsavedChanges;
