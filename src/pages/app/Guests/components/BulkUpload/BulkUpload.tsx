import { useEffect, useState } from 'react';
import { getCSVTemplate, getFileStatus, uploadFile } from '../../../../../apis/guests';
import { TicketType } from '../../../../../apis/types';
import Modal from '../../../../../components/Modal/Modal';
import { customStyles } from '../../../EventPage/constants';
import styles from './BulkUpload.module.css';
import Select from 'react-select';
import { getTickets } from '../../../../../apis/tickets';
import toast from 'react-hot-toast';

const BulkUpload = ({ onClose }: { onClose: () => void }) => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileStatus, setFileStatus] = useState<any[]>([]);

  useEffect(() => {
    getTickets(eventId, setTickets);
    getFileStatus(eventId, setFileStatus);
  }, []);

  return (
    <Modal title='Bulk Upload' onClose={onClose} type='center'>
      <div className={styles.bulkUploadContainer}>
        <input
          type='file'
          accept='.csv'
          onChange={(e) => {
            setFile(e.target.files![0]);
          }}
          className={styles.fileInput}
        />
        <p
          className={`pointer ${styles.downloadTemplate}`}
          onClick={() => {
            getCSVTemplate(eventId);
          }}
        >
          Download CSV Template
        </p>
      </div>
      <p className={styles.sectionHeader}>Select Ticket</p>
      <div className={styles.selectTicket}>
        <Select
          styles={customStyles}
          name='colors'
          className='basic-multi-select'
          classNamePrefix='select'
          options={tickets.map((ticket) => {
            return {
              value: ticket.id,
              label: ticket.title,
            };
          })}
          placeholder='Select Tickets'
          onChange={(selectedOption) => {
            if (selectedOption) setSelectedTickets([selectedOption.value]);
          }}
        />
      </div>
      <p className={styles.sectionHeader}>Logs</p>
      <div className={styles.logsListingContainer}>
        {fileStatus.map((file, index) => (
          <div className={styles.log} key={index}>
            <div className={styles.logDetails}>
              <p className={styles.logName}>
                {file.name} <span className={styles.logDate}>29th Feb 2023, 19:34 IST</span>
              </p>
              <p className={styles.logUploadCount}>1000/1299 Uploaded</p>
            </div>
            <p className={styles.logStatus}>Finished</p>
          </div>
        ))}
        {fileStatus.length === 0 && <p className={styles.noLogs}>No logs available</p>}
      </div>

      {fileStatus.length > 0 && <hr className={styles.line} />}

      <button
        className={styles.uploadButton}
        onClick={() => {
          if (file) uploadFile(eventId, file, selectedTickets);
          else toast.error('Please select a file');
        }}
      >
        Upload
      </button>
    </Modal>
  );
};

export default BulkUpload;
