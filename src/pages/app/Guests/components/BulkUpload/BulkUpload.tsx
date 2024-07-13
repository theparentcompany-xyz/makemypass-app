import Modal from '../../../../../components/Modal/Modal';
import styles from './BulkUpload.module.css';

const BulkUpload = ({ onClose }: { onClose: () => void }) => {
  return (
    <Modal title='Bulk Upload' onClose={onClose} type='center'>
      <div className={styles.bulkUploadContainer}>
        <button className={styles.uploadFileButton}>Upload File</button>
        <p className={`pointer ${styles.downloadTemplate}`}>Download CSV Template</p>
      </div>
      <p className={styles.logsHeader}>Logs</p>
      <div className={styles.logsListingContainer}>
        <div className={styles.log}>
          <div className={styles.logDetails}>
            <p className={styles.logName}>
              File.csv <span className={styles.logDate}>29th Feb 2023, 19:34 IST</span>
            </p>
            <p className={styles.logUploadCount}>1000/1299 Uploaded</p>
          </div>
          <p className={styles.logStatus}>Finished</p>
        </div>
        <div className={styles.log}>
          <div className={styles.logDetails}>
            <p className={styles.logName}>
              File.csv <span className={styles.logDate}>29th Feb 2023, 19:34 IST</span>
            </p>
            <p className={styles.logUploadCount}>1000/1299 Uploaded</p>
          </div>
          <p className={styles.logStatus}>Finished</p>
        </div>
      </div>
      <hr className={styles.line} />
      <button className={styles.uploadButton}>Upload</button>
    </Modal>
  );
};

export default BulkUpload;
