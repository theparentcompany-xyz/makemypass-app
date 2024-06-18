import styles from './ScanTicket.module.css';

const ScanTicket = ({
  ticketCode,
  setTicketCode,
  setShowScanner,
}: {
  ticketCode: string;
  setTicketCode: React.Dispatch<React.SetStateAction<string>> | undefined;
  setShowScanner: React.Dispatch<React.SetStateAction<boolean>> | undefined;
}) => {
  return (
    <div
      style={{
        marginBottom: '1rem',
      }}
    >
      <p className={styles.formLabel}>Scan Ticket Type</p>
      <div className={styles.scanTicketCodeContainer}>
        <input
          disabled
          type='text'
          id='ticket_code'
          name='ticket_code'
          value={ticketCode}
          className={styles.scanTicketCodeInput}
          placeholder='Enter Ticket Code'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setTicketCode && setTicketCode(e.target.value);
          }}
        />
        <button
          onClick={() => {
            if (setShowScanner) setShowScanner(true);
          }}
          className={styles.scanTicketCodeButton}
        >
          Scan
        </button>
      </div>
    </div>
  );
};

export default ScanTicket;
