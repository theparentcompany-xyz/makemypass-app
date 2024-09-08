import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BiSolidReport } from 'react-icons/bi';
import Select from 'react-select';

import {
  getBulkImportCSV,
  getGuestBulkImportList,
  uploadBulkGuestData,
} from '../../../../../apis/guests';
import { getTicketsList } from '../../../../../apis/tickets';
import { TicketType } from '../../../../../apis/types';
import { formatDate } from '../../../../../common/commonFunctions';
import Modal from '../../../../../components/Modal/Modal';
import Slider from '../../../../../components/SliderButton/Slider';
import { customStyles } from '../../../EventPage/constants';
import styles from './BulkUpload.module.css';
import type { BulkUploadType } from './types';

const BulkUpload = ({ onClose }: { onClose: () => void }) => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileStatus, setFileStatus] = useState<BulkUploadType[]>([]);

  const [sendTicket, setSendTicket] = useState(false);
  const [sendInvoice, setSendInvoice] = useState(false);

  useEffect(() => {
    getTicketsList(eventId, setTickets);
    getGuestBulkImportList(eventId, setFileStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateCSVReport = async (reportPath: string) => {
    try {
      window.open(reportPath);
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
            getBulkImportCSV(eventId);
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

        <div className='row'>
          <Slider
            text='Send Ticket'
            size='small'
            onChange={() => {
              setSendTicket(!sendTicket);
            }}
            checked={sendTicket}
          />

          {tickets
            .filter((ticket) => selectedTickets.includes(ticket.id))
            .some((ticket) => ticket.price > 0) && (
            <Slider
              text='Send Invoice'
              size='small'
              onChange={() => {
                setSendInvoice(!sendInvoice);
              }}
              checked={sendInvoice}
            />
          )}
        </div>
      </div>

      <button
        className={styles.uploadButton}
        onClick={() => {
          if (file)
            uploadBulkGuestData(
              eventId,
              file,
              selectedTickets,
              setFileStatus,
              sendTicket,
              sendInvoice,
            );
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
              <p className={styles.total} style={{ marginTop: '0.25rem' }}>
                {file.send_ticket ? 'Tickets Sent' : 'Ticket Not Sent'}{' '}
              </p>
            </div>
            <p className={styles.logStatus}>{file.status}</p>
            {file.status === 'completed' && (
              <BiSolidReport
                onClick={() => {
                  generateCSVReport(file.report_path);
                }}
                title='Download Report'
                color='#8e8e8e'
                className={styles.reportIcon}
              />
            )}
          </div>
        ))}
        {fileStatus.length === 0 && <p className={styles.noLogs}>No logs available</p>}
      </div>
    </Modal>
  );
};

export default BulkUpload;
