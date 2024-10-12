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
    total: number;
    category: string;
    youTicket: boolean;
    currency: string;
    is_fee: boolean;
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
              {ticket.is_fee && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    opacity: 0.7,
                  }}
                >
                  {' '}
                  +fee
                </span>
              )}
            </p>
            <p className={styles.receiptItemPrice}>
              {ticket.currency} {ticket.total > 0 && ticket.total.toFixed(2)}
            </p>
          </div>
        ))}
        <div className={styles.totalPrice}>
          <p>
            Total Price: {billReceipt[0].currency}{' '}
            {billReceipt.reduce((acc, ticket) => acc + ticket.total, 0).toFixed(2)}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ExpectedInvoice;
