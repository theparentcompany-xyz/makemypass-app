import { useEffect, useState } from 'react';
import { getCSVTemplate, getFileStatus, uploadFile } from '../../../../../apis/guests';
import { TicketType } from '../../../../../apis/types';
import Modal from '../../../../../components/Modal/Modal';
import { customStyles } from '../../../EventPage/constants';
import styles from './BulkUpload.module.css';
import Select from 'react-select';
import { getTickets } from '../../../../../apis/tickets';
import toast from 'react-hot-toast';
import { formatDate } from '../../../../../common/commonFunctions';
import { BiSolidReport } from 'react-icons/bi';
import { BulkUploadType } from './types';
import Slider from '../../../../../components/SliderButton/Slider';

const BulkUpload = ({ onClose }: { onClose: () => void }) => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileStatus, setFileStatus] = useState<BulkUploadType[]>([]);

  const [sendTicket, setSendTicket] = useState(false);

  useEffect(() => {
    getTickets(eventId, setTickets);
    getFileStatus(eventId, setFileStatus);
  }, []);

  const generateCSVReport = async (reportPath: string) => {
    try {
      const response = await fetch('https://cors-anywhere.herokuapp.com/' + reportPath, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'report.xlsx';
      link.click();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

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

        <Slider
          text='Send Ticket'
          size='small'
          onChange={() => {
            setSendTicket(!sendTicket);
          }}
          checked={sendTicket}
        />
      </div>

      <button
        className={styles.uploadButton}
        onClick={() => {
          if (file) uploadFile(eventId, file, selectedTickets, setFileStatus, sendTicket);
          else toast.error('Please select a file');
        }}
      >
        Upload
      </button>

      {fileStatus.length > 0 && <hr className={styles.line} />}

      <p className={styles.sectionHeader}>Upload Logs</p>
      <div className={styles.logsListingContainer}>
        {fileStatus.map((file, index) => (
          <div className={styles.log} key={index}>
            <div className={styles.logDetails}>
              <p className={styles.logName}>
                {file.filename ?? 'CSV File'}{' '}
                <span className={styles.logDate}>{formatDate(file.created_at, true)}</span>
              </p>
              <div className={styles.fileStatus}>
                <p className={styles.success}>{file.success_count} Success</p>
                <p className={styles.error}>{file.failure_count} Failed</p>
                <p className={styles.total}>{file.total_count} Total</p>
              </div>
            </div>
            <p className={styles.logStatus}>{file.status}</p>
            <BiSolidReport
              onClick={() => {
                generateCSVReport(file.report_path);
              }}
              title='Download Report'
              color='#8e8e8e'
              className={styles.reportIcon}
            />
          </div>
        ))}
        {fileStatus.length === 0 && <p className={styles.noLogs}>No logs available</p>}
      </div>
    </Modal>
  );
};

export default BulkUpload;
