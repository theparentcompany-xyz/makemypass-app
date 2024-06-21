import styles from './GuestBulkImport.module.css';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Theme from '../../../../../components/Theme/Theme';
import BulkImportHeader from '../../components/BulkImportHeader/BulkImportHeader';
import Header from '../../../../../components/EventHeader/EventHeader';
import { customStyles } from '../../../../../pages/app/EventPage/constants';
import { TicketOptions } from '../../../EventPage/types';
import Select from 'react-select';
import { motion } from 'framer-motion';
import { SiMicrosoftexcel } from 'react-icons/si';
import { getFileStatus, uploadFile } from '../../../../../apis/guests';
import { FileType } from '../../../../../apis/types';
import GenericTable from '../../../../../components/Table/GenericTable';

const GuestBulkImport = () => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [ticketInfo] = useState<TicketOptions>();
  const [ticketId, setTicketId] = useState<string>('');
  const [fileStatus, setFileStatus] = useState<FileType[]>([]);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
    },
  });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      acceptedFiles.forEach((file: File) => {
        uploadFile(eventId, file, ticketId);
      });
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (eventId) {
      // getTickets(eventId, setTicketInfo);
      getFileStatus(eventId, setFileStatus);
    }
  }, [eventId]);

  return (
    <Theme>
      <div className={styles.bulkImportContainer}>
        <Header />
        <BulkImportHeader />
        {ticketInfo && (
          <div className={styles.ticketInfo}>
            <p className={styles.formLabel}>Ticket Type</p>
            <motion.div className={styles.dropdown}>
              <Select
                options={Object.keys(ticketInfo).map((key) => ({
                  value: ticketInfo[key].id,
                  label: key,
                }))}
                styles={{
                  ...customStyles,
                  menu: (provided: any) => ({
                    ...provided,
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: '#1C2222',
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '0.9rem',
                    zIndex: 1000,
                  }),
                }}
                onChange={(selectedOption: { value: string } | null) =>
                  setTicketId && setTicketId(selectedOption?.value || '')
                }
                value={
                  ticketInfo &&
                  Object.keys(ticketInfo)
                    .map((key) => ({
                      value: ticketInfo[key].id,
                      label: key,
                    }))
                    .filter((option: { value: string }) => option.value === ticketId)
                }
                placeholder={`Select an option`}
                isSearchable={false}
              />
            </motion.div>
          </div>
        )}
        <div className={styles.importContainer}>
          <section>
            <div
              {...getRootProps({
                className: `${styles.dropzone}`,
              })}
            >
              <input {...getInputProps()} />
              <span>{<SiMicrosoftexcel />}</span>
              <p className={styles.dropzoneText}>
                Drag 'n' drop some files here, or click to select files
              </p>
            </div>
          </section>
        </div>
        <div className='uploadHistory'>
          <GenericTable tableData={fileStatus} tableHeading='Upload Histoyr' />
        </div>
      </div>
    </Theme>
  );
};

export default GuestBulkImport;
