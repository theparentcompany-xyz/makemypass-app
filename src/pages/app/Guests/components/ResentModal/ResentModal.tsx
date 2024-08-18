import { Dispatch } from 'react';
import { resentGuestTicket } from '../../../../../apis/guests';
import { ResentTicket, SelectedGuest } from '../../types';
import styles from './ResentModal.module.css';
import Modal from '../../../../../components/Modal/Modal';

const ResentModal = ({
  resentTicket,
  setResentTicket,
  setSelectedGuestId,
}: {
  resentTicket: ResentTicket;
  setResentTicket: Dispatch<React.SetStateAction<ResentTicket>>;
  setSelectedGuestId: Dispatch<React.SetStateAction<SelectedGuest | null>>;
}) => {
  const handleTicketResend = () => {
    resentGuestTicket(resentTicket, setResentTicket);
  };

  return (
    <Modal
      onClose={() => {
        setResentTicket((prevState) => ({
          ...prevState,
          status: false,
        }));
      }}
      title='Resend Ticket'
    >
      <p className={styles.modalSubText}>
        By clicking on resend, the ticket with most resent will be sent to{' '}
        <span
          style={{
            fontWeight: '500',
            color: '#47C97E',
          }}
        >
          {resentTicket.name}
        </span>
      </p>
      <div className={styles.buttons}>
        <p
          onClick={() => {
            handleTicketResend();
          }}
          className={`pointer ${styles.button}`}
        >
          Resend
        </p>
        <p
          onClick={() => {
            setResentTicket((prevState) => ({
              ...prevState,
              status: false,
            }));

            setSelectedGuestId({
              id: resentTicket.guestId.toString(),
              type: 'view',
            });
          }}
          className={`pointer ${styles.button}`}
        >
          Cancel
        </p>
      </div>
    </Modal>
  );
};

export default ResentModal;
