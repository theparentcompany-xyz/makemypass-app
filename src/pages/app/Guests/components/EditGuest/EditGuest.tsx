import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import DynamicForm from '../../../../../components/DynamicForm/DynamicForm';
import Modal from '../../../../../components/Modal/Modal';
import styles from '../../Guests.module.css';
import { updateGuestSubmission } from '../../../../../apis/guests';
import { FormEventData, GuestsType, SelectedGuest } from '../../types';
import { FormDataType } from '../../../../../apis/types';

const EditGuest = ({
  formData,
  setFormData,
  eventFormData,
  setSelectedGuestId,
  eventId,
  onClose,
  setGuests,
}: {
  formData: any;
  setFormData: Dispatch<SetStateAction<FormDataType>>;
  eventFormData: FormEventData;
  setSelectedGuestId: Dispatch<React.SetStateAction<SelectedGuest | null>>;
  eventId: string;
  onClose: () => void;
  setGuests: Dispatch<SetStateAction<GuestsType[]>>;
}) => {
  const [formErrors, setFormErrors] = useState<any>({});

  const [updatedFormData, setUpdatedFormData] = useState<any>(formData);

  useEffect(() => {
    setUpdatedFormData(formData);
  }, [formData]);

  const onFieldChange = (fieldName: string, fieldValue: string | string[]) => {
    console.log(updatedFormData);

    setUpdatedFormData({
      ...updatedFormData,
      [fieldName]: fieldValue,
    });

    if (formErrors[fieldName]) {
      setFormErrors({
        ...formErrors,
        [fieldName]: '',
      });
    }
  };

  const handleSubmissionEdit = () => {
    updateGuestSubmission(
      eventId,
      updatedFormData,
      setSelectedGuestId,
      setFormData,
      setFormErrors,
      setGuests,
    );
  };

  return (
    <Modal title='Edit Guest' onClose={onClose} type='side'>
      <div className={styles.userInfoModalContainer}>
        {formData && eventFormData && (
          <>
            <div className={styles.formFields}>
              <DynamicForm
                formFields={eventFormData.form}
                formErrors={formErrors}
                formData={updatedFormData}
                onFieldChange={onFieldChange}
              />
            </div>
            <div className={styles.buttons}>
              <p
                onClick={() => {
                  handleSubmissionEdit();
                }}
                className={`pointer ${styles.primaryButton}`}
              >
                Save Changes
              </p>
              <p
                onClick={() => {
                  setSelectedGuestId({
                    id: '',
                    type: '',
                  });
                }}
                className={`pointer ${styles.button}`}
              >
                Cancel
              </p>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default EditGuest;
