import React, { useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners';

import { TillRoles } from '../../../../../../../services/enums';
import { getEventMailData, updateEventMail } from '../../../../../../apis/mails';
import { MailType } from '../../../../../../apis/types';
import { isUserAuthorized, isUserEditor } from '../../../../../../common/commonFunctions';
import UploadAttachement from './components/UploadAttachement/UploadAttachements';
import type { previewType, PropTypes } from './types';
import styles from './UpdateMail.module.css';

const UpdateMail = ({ selectedMail, setCustomMail, setSelectedMail, setMails }: PropTypes) => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [mailData, setMailData] = useState<MailType>();
  const [fetchedMail, setFetchedMail] = useState<MailType>();
  const [attachments, setAttachments] = useState<(string | File)[]>([]);
  const [previews, setPreviews] = useState<previewType[]>([]);

  const onUpdateEmail = () => {
    const formData = new FormData();

    Object.entries(mailData ?? {}).forEach(([key, value]) => {
      if (key === 'attachments' || key === 'id' || key === 'attachment') {
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, value);
      }
    });

    attachments.forEach((attachment) => {
      formData.append('attachments[]', attachment);
    });

    const changedData = formData;

    updateEventMail(
      eventId,
      mailData as MailType,
      changedData,
      setMails,
      setFetchedMail,
      setSelectedMail,
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...attachments, ...e.target.files!];

    setAttachments(files);
    setPreviews([
      ...previews,
      ...Array.from(e.target.files || []).map((file) => {
        return {
          previewURL: URL.createObjectURL(file),
          previewExtension: file.type,
          previewName: file.name,
        };
      }),
    ]);
  };

  const handleDeleteAttachment = (index: number) => {
    if (isUserEditor()) {
      const newAttachments = attachments.filter((_, i) => i !== index);

      setAttachments(newAttachments);
      setPreviews(previews.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    if (selectedMail) {
      getEventMailData(eventId, selectedMail?.id, setFetchedMail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fetchedMail) {
      setMailData(fetchedMail);

      const attachmentList = fetchedMail?.attachments?.map((attachment) => {
        const fileName = attachment.split('/').pop() || 'file';
        const fileExtension = attachment.split('.').pop();
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
          file: new File([], fileName, { type: fileType }),
          name: fileName,
          fileURL: attachment,
        };
      });

      setAttachments(fetchedMail.attachments);

      setPreviews(
        attachmentList?.map((attachment) => {
          return {
            previewURL: attachment.fileURL!,
            previewExtension: attachment.file.type,
            previewName: attachment.name,
          };
        }),
      );
    }
  }, [fetchedMail]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 's' && (navigator.userAgent.includes('Mac') ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        onUpdateEmail();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {mailData ? (
        <>
          <div className={styles.modalHeader}>Update {mailData?.type} Email</div>
          <div className={styles.modalSubText}>
            <div className={styles.inputContainers}>
              <div className={styles.inputContainer}>
                <p className={styles.inputLabel}>{mailData.type_description}</p>
              </div>
              <div className={styles.inputContainer}>
                <p className={styles.inputLabel}>Subject</p>
                <input
                  type='text'
                  placeholder='Enter Subject'
                  disabled={!isUserEditor()}
                  className={styles.input}
                  value={mailData?.subject}
                  onChange={(e) =>
                    mailData && setMailData({ ...mailData, subject: e.target.value })
                  }
                />
              </div>

              <div className={styles.inputContainer}>
                <p className={styles.inputLabel}>Body</p>

                <textarea
                  placeholder='Enter Email Body'
                  disabled={!isUserEditor()}
                  className={styles.textarea}
                  value={mailData?.body}
                  onChange={(e) => mailData && setMailData({ ...mailData, body: e.target.value })}
                />
              </div>
              <div className={styles.inputContainer}>
                {/* Add Attachments container */}
                <p className={styles.inputLabel}>Attachments</p>
                <UploadAttachement
                  handleFileChange={handleFileChange}
                  handleDeleteAttachment={handleDeleteAttachment}
                  previews={previews}
                />
              </div>

              {isUserAuthorized(TillRoles.ADMIN) && (
                <div className={styles.inputContainer}>
                  <p
                    className={styles.inputLink}
                    onClick={() => {
                      setCustomMail(true);
                    }}
                  >
                    &#x1F6C8; Connect Custom Mail Id Here
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={onUpdateEmail}>
              Update Reminder
            </button>
            <button className={styles.button} onClick={() => setSelectedMail(undefined)}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <HashLoader size={50} color={'#46BF75'} />
      )}
    </>
  );
};

export default UpdateMail;
