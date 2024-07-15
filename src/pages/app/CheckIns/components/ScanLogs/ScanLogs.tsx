import { MdError, MdVerified } from 'react-icons/md';
import styles from './ScanLogs.module.css';
import { LogType } from '../../pages/Venue/Venue';

const ScanLogs = ({ scanLogs }: { scanLogs: LogType[] }) => {
  return (
    <div className={styles.logs}>
      <p className={styles.venueHeading}>{scanLogs.length > 0 ? 'Scan Logs' : 'No Scans Yet'}</p>
      <p className={styles.helperText}>
        This log is stored locally just for your reference. you previous scans are safe with us.
      </p>
      {scanLogs
        .slice()
        .reverse()
        .map((log) => (
          <div className={styles.logContainer}>
            {log.hasError ? (
              <MdError color='#f04b4b' size={20} />
            ) : (
              <MdVerified color='#47c97e' size={20} />
            )}
            <p className={styles.logMessage}>{log.message}</p>
            <p className={styles.logTimestamp}>{log.timestamp}</p>
          </div>
        ))}
    </div>
  );
};

export default ScanLogs;
