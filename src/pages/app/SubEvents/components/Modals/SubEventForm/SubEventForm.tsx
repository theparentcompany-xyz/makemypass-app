import { motion } from 'framer-motion';
import React from 'react';

import { subEventRegister } from '../../../../../../apis/subevents';
import { FormFieldType } from '../../../../../../apis/types';
import DynamicForm from '../../../../../../components/DynamicForm/DynamicForm';
import Modal from '../../../../../../components/Modal/Modal';
import styles from '../../../User/ListSubEvents.module.css';
import type { SelectedSubEventsType } from '../../../User/types';

const SubEventForm = ({
  subEventForm,
  setSubEventForm,
  formErrors,
  formData,
  onFieldChange,
  eventId,
  eventRegisterId,
  selectedEvents,
  setFormErrors,
  setTriggerFetch,
  setShowFormModal,
  showFormModal,
}: {
  subEventForm: FormFieldType[];
  setSubEventForm: React.Dispatch<React.SetStateAction<FormFieldType[]>>;
  formErrors: Record<string, string[]>;
  formData: Record<string, string | string[]>;
  onFieldChange: (field: string, value: string | string[]) => void;
  eventId: string;
  eventRegisterId: string | undefined;
  selectedEvents: SelectedSubEventsType[];
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  setTriggerFetch: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFormModal: React.Dispatch<React.SetStateAction<boolean>>;
  showFormModal: boolean;
}) => {
  if (!(showFormModal && subEventForm && subEventForm.length > 0)) return null;
  return (
    <Modal title='Enter Additional Information' onClose={() => setSubEventForm([])} type='side'>
      <p className={styles.modalDescription}>
        Required below are the fields which are newly required for the selected events.
      </p>
      <div className={styles.formContainer}>
        <DynamicForm
          formFields={subEventForm}
          formErrors={formErrors}
          formData={formData}
          onFieldChange={onFieldChange}
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        className={styles.submitButton}
        onClick={() => {
          if (eventId && eventRegisterId)
            subEventRegister(
              eventId,
              eventRegisterId,
              formData,
              selectedEvents,
              setFormErrors,
              setTriggerFetch,
              setShowFormModal,
            );
        }}
      >
        Submit
      </motion.button>
    </Modal>
  );
};

export default SubEventForm;
