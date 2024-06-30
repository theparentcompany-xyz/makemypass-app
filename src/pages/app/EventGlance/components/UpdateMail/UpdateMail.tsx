import React, { useEffect, useState } from 'react';
import { listMailType, MailType } from '../../../../../apis/types';
import styles from './UpdateMail.module.css';
import { getMail } from '../../../../../apis/mails';
import { HashLoader } from 'react-spinners';
import { updateMail } from '../../../../../apis/mails';
import { MdClose } from 'react-icons/md';
// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

type Props = {
  selectedMail: listMailType | undefined;
  setSelectedMail: React.Dispatch<React.SetStateAction<listMailType | undefined>>;
  setCustomMail: React.Dispatch<React.SetStateAction<boolean>>;
  setMails: React.Dispatch<React.SetStateAction<listMailType[]>>;
};

// pdfjs.GlobalWorkerOptions.workerSrc =
//   'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.js';

const UpdateMail = ({ selectedMail, setCustomMail, setSelectedMail, setMails }: Props) => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [mailData, setMailData] = useState<MailType>();
  const [fetchedMail, setFetchedMail] = useState<MailType>();
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const onUpdateEmail = () => {
    const changedData: Record<string, any> = Object.entries(mailData as Record<string, any>)
      .filter(([key, value]) => fetchedMail?.[key as keyof MailType] !== value)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
    if (attachments.length > 0) {
      changedData['attachment'] = attachments[0];
    }
    updateMail(eventId, mailData as MailType, changedData, setMails, setFetchedMail);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...attachments, ...Array.from(e.target.files || [])];
    setAttachments(files);

    // Generate previews
    const newPreviews = files.map((file) => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        return URL.createObjectURL(file);
      }
      // Handle other types or return a placeholder
      return 'placeholder_for_non_image_video_types';
    });

    setPreviews(newPreviews);
  };

  const handleDeleteAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
    setPreviews(previews.filter((_, i) => i !== index));
  };
  useEffect(() => {
    if (selectedMail) {
      getMail(eventId, selectedMail?.id, setFetchedMail);
    }
  }, []);

  useEffect(() => {
    if (fetchedMail) {
      setMailData(fetchedMail);
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
                <p className={styles.inputLabel}>The reminder goes Out </p>
                <p className={styles.inputSubText}>X hours before the event</p>
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
                          {attachments[index].type.startsWith('image/') && (
                            <img src={preview} alt='Preview' style={{ width: 100, height: 100 }} />
                          )}
                          {attachments[index].type.startsWith('video/') && (
                            <video src={preview} width='100' height='100' controls />
                          )}
                          {/* {attachments[index].type === 'application/pdf' && (
                            <>
                              {error && <div>Error loading PDF: {error}</div>}
                              <Document
                                file={attachments[index]}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onLoadError={onDocumentLoadError}
                                className='pdf-preview'
                              >
                                <Page pageNumber={1} />
                              </Document>
                            </>
                          )} */}
                          {<div className={styles.nameContainer}>{attachments[index].name}</div>}
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
