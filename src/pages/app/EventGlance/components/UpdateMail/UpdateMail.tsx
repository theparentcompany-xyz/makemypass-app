import React, { useEffect, useState } from 'react';
import { listMailType, MailType } from '../../../../../apis/types';
import styles from './UpdateMail.module.css';
import { deleteAttachment, getMail } from '../../../../../apis/mails';
import { HashLoader } from 'react-spinners';
import { updateMail } from '../../../../../apis/mails';
import { MdClose } from 'react-icons/md';

type Props = {
  selectedMail: listMailType | undefined;
  setSelectedMail: React.Dispatch<React.SetStateAction<listMailType | undefined>>;
  setCustomMail: React.Dispatch<React.SetStateAction<boolean>>;
  setMails: React.Dispatch<React.SetStateAction<listMailType[]>>;
};

type AttachmentType = {
  type: 'newFile' | 'existingFile';
  file: File;
  fileURL?: string;
};

type previewType = {
  previewURL: string;
  previewExtension: string;
};

const UpdateMail = ({ selectedMail, setCustomMail, setSelectedMail, setMails }: Props) => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [mailData, setMailData] = useState<MailType>();
  const [fetchedMail, setFetchedMail] = useState<MailType>();
  const [attachments, setAttachments] = useState<AttachmentType[]>([]);
  const [previews, setPreviews] = useState<previewType[]>([]);

  const onUpdateEmail = () => {
    const changedData: Record<string, any> = Object.entries(mailData as Record<string, any>)
      .filter(([key, value]) => fetchedMail?.[key as keyof MailType] !== value)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    attachments.forEach((attachment) => {
      if (attachment.type === 'newFile') {
        changedData.attachment = attachment.file;
      }
    });

    updateMail(eventId, mailData as MailType, changedData, setMails, setFetchedMail).then(() => {
      setSelectedMail(undefined);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const files = [...attachments, ...Array.from(e.target.files || [])];
    const files: AttachmentType[] = [
      ...attachments,
      ...Array.from(e.target.files || []).map((file) => {
        return {
          type: 'newFile' as const,
          file: file,
        };
      }),
    ];

    setAttachments(files);
    setPreviews([
      ...previews,
      ...Array.from(e.target.files || []).map((file) => {
        return {
          previewURL: URL.createObjectURL(file),
          previewExtension: file.type,
        };
      }),
    ]);
  };

  const handleDeleteAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
    setPreviews(previews.filter((_, i) => i !== index));
    if (selectedMail) deleteAttachment(eventId, selectedMail?.id, previews[index].previewURL);
  };
  useEffect(() => {
    if (selectedMail) {
      getMail(eventId, selectedMail?.id, setFetchedMail);
    }
  }, []);

  useEffect(() => {
    if (fetchedMail) {
      setMailData(fetchedMail);

      const attachmentList = fetchedMail.attachment.map((attachment) => {
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

      setAttachments(
        attachmentList.map((attachment) => {
          return {
            type: 'existingFile',
            file: attachment.file,
          };
        }),
      );

      setPreviews(
        attachmentList.map((attachment) => {
          return {
            previewURL: attachment.fileURL!,
            previewExtension: attachment.file.type,
          };
        }),
      );

      console.log(previews);
    }
  }, [fetchedMail]);

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
                  className={styles.textarea}
                  value={mailData?.body}
                  onChange={(e) => mailData && setMailData({ ...mailData, body: e.target.value })}
                />
              </div>
              {import.meta.env.VITE_CURRENT_ENV == 'dev' && (
                <div className={styles.inputContainer}>
                  {/* Add Attachments container */}
                  <p className={styles.inputLabel}>Attachments</p>
                  <div className={styles.attachmentsContainer}>
                    {previews.length > 0 && (
                      <div className={styles.previewContainer}>
                        {previews.map((preview, index) => (
                          <div key={index} className={styles.previewBox}>
                            <div
                              className={styles.closeButton}
                              onClick={() => {
                                handleDeleteAttachment(index);
                              }}
                            >
                              <MdClose size={20} />
                            </div>
                            {preview.previewExtension.startsWith('image/') && (
                              <img
                                src={preview.previewURL}
                                alt='Preview'
                                style={{ width: 100, height: 100 }}
                                onClick={() => window.open(preview.previewURL, '_blank')}
                              />
                            )}
                            {preview.previewExtension.startsWith('video/') && (
                              <video
                                src={preview.previewURL}
                                width='100'
                                height='100'
                                controls
                                onClick={() => window.open(preview.previewURL, '_blank')}
                              />
                            )}
                            {preview.previewExtension.startsWith('audio/') && (
                              <audio
                                src={preview.previewURL}
                                controls
                                onClick={() => window.open(preview.previewURL, '_blank')}
                              />
                            )}
                            {preview.previewExtension === 'application/pdf' && (
                              <embed
                                onClick={() => window.open(preview.previewURL, '_blank')}
                                src={preview.previewURL}
                                width='100'
                                height='100'
                                type='application/pdf'
                              />
                            )}
                            {
                              <div className={styles.nameContainer}>
                                {attachments[index].file.name}
                              </div>
                            }
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={styles.uploadContainer}>
                    <input
                      type='file'
                      multiple
                      value={''}
                      onChange={handleFileChange}
                      className={styles.fileInput}
                    />
                  </div>
                </div>
              )}
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
