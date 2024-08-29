import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import DynamicForm from '../../../../../components/DynamicForm/DynamicForm';
import Modal from '../../../../../components/Modal/Modal';
import styles from '../../Guests.module.css';
import { updateGuestSubmission } from '../../../../../apis/guests';
import { FormEventData, GuestsType, SelectedGuest } from '../../types';
import { FormDataType } from '../../../../../apis/types';
import { previewType } from '../../../EventGlance/components/UpdateMail/types';

const EditGuest = ({
  formData,
  eventRegisterId,
  setFormData,
  eventFormData,
  setSelectedGuestId,
  eventId,
  onClose,
  setGuests,
}: {
  formData: FormDataType;
  eventRegisterId: string;
  setFormData: Dispatch<SetStateAction<FormDataType>>;
  eventFormData: FormEventData;
  setSelectedGuestId: Dispatch<React.SetStateAction<SelectedGuest | null>>;
  eventId: string;
  onClose: () => void;
  setGuests: Dispatch<SetStateAction<GuestsType[]>>;
}) => {
  const [formErrors, setFormErrors] = useState<any>({});
  const [previews, setPreviews] = useState<previewType[]>([]);
  const [attachements, setAttachements] = useState<{
    field_key: string;
    fieldAttachements: File[];
  }>({
    field_key: '',
    fieldAttachements: [],
  });

  const onFieldChange = (fieldName: string, fieldValue: string | string[]) => {
    setFormData({
      ...formData,
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
      eventRegisterId,
      formData,
      setSelectedGuestId,
      setFormData,
      setFormErrors,
      setGuests,
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: FormFieldType) => {
    let withinSize = true;
    let isWithinFileCount = true;
    Array.from(event.target.files || []).forEach((file) => {
      if (file.size <= (field.property?.max_size ?? 0) * 1024) {
        withinSize = withinSize && true;
      } else {
        withinSize = false;
      }
    });

    if (field.property?.max_no_of_files) {
      isWithinFileCount =
        attachements.fieldAttachements.length + Array.from(event.target.files || []).length <=
        field.property?.max_no_of_files;
    }

    if (event.target.files && withinSize && isWithinFileCount) {
      const newAttachments = [
        ...attachements.fieldAttachements,
        ...Array.from(event.target.files || []),
      ];
      onFieldChange(field.field_key, newAttachments as any);
      setAttachements({
        field_key: field.field_key,
        fieldAttachements: newAttachments,
      });
      setPreviews([
        ...previews,
        ...Array.from(event.target.files || []).map((file) => {
          return {
            previewURL: URL.createObjectURL(file),
            previewExtension: file.type,
            previewName: file.name,
          };
        }),
      ]);
    } else {
      if (!withinSize) {
        setFormErrors &&
          setFormErrors({
            ...formErrors,
            [field.field_key]: ['File size exceeds the limit'],
          });
      } else {
        if (!isWithinFileCount) {
          setFormErrors &&
            setFormErrors({
              ...formErrors,
              [field.field_key]: [`You can only upload ${field.property?.max_no_of_files} files`],
            });
        }
      }
    }
  };

  const handleDeleteAttachment = (index: number) => {
    const newAttachements = attachements.fieldAttachements.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    onFieldChange(attachements.field_key, newAttachements as any);

    setAttachements({
      field_key: attachements.field_key,
      fieldAttachements: newAttachements,
    });

    setPreviews(newPreviews);
  };

  useEffect(() => {
    if (previews.length === 0) {
      eventFormData.form.forEach((field) => {
        if (field.type === 'file' && formData[field.field_key]) {
          setPreviews([
            ...previews,
            ...Array.from(formData[field.field_key] as unknown as string[]).map((file: string) => {
              const fileName = file.split('/').pop() || 'file';
              const fileExtension = file.split('.').pop();
              const fileType =
                fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png'
                  ? `image/${fileExtension}`
                  : fileExtension === 'mp3'
                    ? 'audio/mp3'
                    : fileExtension === 'mp4'
                      ? 'video/mp4'
                      : fileExtension === 'pdf'
                        ? 'application/pdf'
                        : 'application/octet-stream';
              return {
                previewURL: file,
                previewExtension: fileType,
                previewName: fileName,
              };
            }),
          ]);

          setAttachements({
            field_key: field.field_key,
            fieldAttachements: formData[field.field_key] as unknown as File[],
          });
        }
      });
    }
  }, [formData]);

  return (
    <Modal title='Edit Guest' onClose={onClose} type='side'>
      <div className={styles.userInfoModalContainer}>
        {formData && eventFormData && (
          <>
            <div className={styles.formFields}>
              <DynamicForm
                formFields={eventFormData.form}
                formErrors={formErrors}
                formData={formData}
                onFieldChange={onFieldChange}
                handleFileChange={handleFileChange}
                handleDeleteAttachment={handleDeleteAttachment}
                previews={previews}
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
