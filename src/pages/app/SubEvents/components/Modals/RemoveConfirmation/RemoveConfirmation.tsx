import { motion } from 'framer-motion';
import React from 'react';

import { removeSubEvent } from '../../../../../../apis/subevents';
import Modal from '../../../../../../components/Modal/Modal';
import type { SelectedSubEventsType } from '../../../User/types';
import styles from './RemoveConfirmation.module.css';

const RemoveConfirmation = ({
  eventId,
  eventRegisterId,
  setSubEventToRemove,
  setSelectedEvents,
  setTriggerFetch,
  subEventToRemove,
}: {
  eventId: string;
  eventRegisterId: string | undefined;
  setSubEventToRemove: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedEvents: React.Dispatch<React.SetStateAction<SelectedSubEventsType[]>>;
  setTriggerFetch: React.Dispatch<React.SetStateAction<boolean>>;
  subEventToRemove: string | null;
}) => {
  if (subEventToRemove === null) return null;
  return (
    <Modal title='Cancel Sub Event' onClose={() => setSubEventToRemove(null)}>
      <p className={styles.modalDescription}>Are you sure you want to cancel this sub event?</p>
      <div className='row'>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className={styles.submitButton}
          onClick={() => {
            if (eventId && eventRegisterId && subEventToRemove)
              removeSubEvent(
                eventId,
                eventRegisterId,
                subEventToRemove,
                setSelectedEvents,
                setSubEventToRemove,
                setTriggerFetch,
              );
          }}
        >
          Yes
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className={styles.cancelButton}
          onClick={() => setSubEventToRemove(null)}
        >
          No
        </motion.button>
      </div>
    </Modal>
  );
};

export default RemoveConfirmation;
