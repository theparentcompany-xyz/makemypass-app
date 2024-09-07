import { motion } from 'framer-motion';

import styles from './ManageTicketHeader.module.css';

const ManageTicketHeader = ({
  title,
  onClose,
}: {
  title: string | undefined;
  onClose?: () => void;
}) => {
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
            onClose && onClose();
          }}
          className={styles.backButton}
        >
          {'<'}
        </button>
        <p className={styles.manageTicketHeading}>{title}</p>
      </motion.div>

      <div className={styles.checkInActions}></div>
    </>
  );
};

export default ManageTicketHeader;
