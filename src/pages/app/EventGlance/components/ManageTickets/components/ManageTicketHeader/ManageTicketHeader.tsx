import styles from './ManageTicketHeader.module.css';
import { motion } from 'framer-motion';

type Props = {
  setIsTicketsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ManageTicketHeader = ({ setIsTicketsOpen }: Props) => {
  return (
    <>
      <motion.div
        className={styles.manageTicketHeader}
        initial={{ opacity: 0, x: -25 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => {
            setIsTicketsOpen(false);
          }}
          className={styles.backButton}
        >
          {'<'}
        </button>
        <p className={styles.manageTicketHeading}>Manage Tickets</p>
      </motion.div>

      <div className={styles.checkInActions}></div>
    </>
  );
};

export default ManageTicketHeader;
