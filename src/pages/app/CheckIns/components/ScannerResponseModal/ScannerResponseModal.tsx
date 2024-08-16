import Modal from '../../../../../components/Modal/Modal';
import styles from './ScannerResponseModal.module.css';
import React, { Dispatch } from 'react';
import { multipleTicketCount } from '../../pages/ScanQR/types';
import InputField from '../../../../auth/Login/InputField';
import toast from 'react-hot-toast';

const ScannerResponseModal = ({
  message,
  setMessage,
  isError,
  setIsError,
  setTicketId,
  setTrigger,
  setMultipleTickets,
  multipleTickets,
}: {
  message: string;
  setMessage: (message: string) => void;
  isError: boolean;
  setIsError: (isError: boolean) => void;
  setTicketId: (ticketId: string) => void;
  setTrigger: Dispatch<React.SetStateAction<boolean>>;
  setMultipleTickets: Dispatch<React.SetStateAction<multipleTicketCount>>;
  multipleTickets: multipleTicketCount;
}) => {
  return (
    message &&
    message.length > 0 && (
      <>
        <div className={styles.backgroundBlur}></div>
        <Modal
          title={multipleTickets.hasMultipleTickets ? message : 'User Check-In'}
          onClose={() => {
            setMessage('');
            setIsError(false);
            setTicketId('');
            setTrigger(false);
            setMultipleTickets({
              hasMultipleTickets: false,
              triggerCheckIn: false,
            });
          }}
        >
          {!multipleTickets.hasMultipleTickets && (
            <>
              <p className={styles.modalSubText}>{message}</p>
              <button
                className={styles.modalButton}
                onClick={() => {
                  setMessage('');
                  setIsError(false);
                  setTicketId('');
                  setTrigger(false);
                  setMultipleTickets({
                    hasMultipleTickets: false,
                    triggerCheckIn: false,
                  });
                }}
              >
                Close
              </button>
            </>
          )}
          {
            // If there are multiple tickets for the user
            multipleTickets.hasMultipleTickets && (
              <>
                <div className={styles.multipleTicketsContainer}>
                  {multipleTickets.tickets?.map((ticket, index) => (
                    <InputField
                      key={index}
                      id='ticketId'
                      name='ticketId'
                      icon={<></>}
                      type='number'
                      placeholder={`Enter count for ${ticket.ticket_name}`}
                      description={`There are ${ticket.remaining_count} tickets remaining`}
                      value={ticket.checked_in_count?.toString() || '0'}
                      onChange={(e) => {
                        const newTickets = multipleTickets.tickets?.map((t, i) => {
                          if (i === index) {
                            if (Number(e.target.value) <= t.remaining_count)
                              return {
                                ...t,
                                checked_in_count: parseInt(e.target.value),
                              };
                            else {
                              toast.error('Ticket Limit Exceeded');
                            }
                          }
                          return t;
                        });

                        setMultipleTickets({
                          ...multipleTickets,
                          tickets: newTickets,
                        });
                      }}
                    />
                  ))}
                </div>
                <button
                  className={styles.modalButton}
                  onClick={() => {
                    setTrigger(true);
                    setMultipleTickets({
                      ...multipleTickets,
                      triggerCheckIn: true,
                    });
                  }}
                >
                  Check-In Users
                </button>
              </>
            )
          }
        </Modal>
      </>
    )
  );
};

export default ScannerResponseModal;
