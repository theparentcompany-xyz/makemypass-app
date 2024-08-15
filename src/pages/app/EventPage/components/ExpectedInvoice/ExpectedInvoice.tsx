import Modal from '../../../../../components/Modal/Modal';
import styles from './ExpectedInvoice.module.css';

const ExpectedInvoice = ({
  billReceipt,
  setShowReceiptModal,
}: {
  billReceipt: {
    ticketName: string;
    ticketPrice: number;
    ticketCount: number;
    currency: string;
    youTicket: boolean;
  }[];
  setShowReceiptModal: (value: boolean) => void;
}) => {
  return (
    <Modal title='Expected Invoice' onClose={() => setShowReceiptModal(false)}>
      <div className={styles.receiptContainer}>
        {billReceipt.map((ticket) => (
          <div className={styles.receiptItem}>
            <p className={styles.receiptItemName}>
              {ticket.ticketName} {ticket.youTicket && <span>(Your Ticket)</span>}
            </p>
            <p className={styles.receiptItemPrice}>
              {ticket.currency} {ticket.ticketPrice > 0 && ticket.ticketPrice} x{' '}
              {ticket.ticketCount}
            </p>
            <p className={styles.receiptItemPrice}>
              {ticket.currency} {ticket.ticketPrice > 0 && ticket.ticketPrice * ticket.ticketCount}
            </p>
          </div>
        ))}
        <div className={styles.totalPrice}>
          <p>
            Total Price: {billReceipt[0].currency}{' '}
            {billReceipt.reduce((acc, ticket) => acc + ticket.ticketPrice * ticket.ticketCount, 0)}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ExpectedInvoice;
