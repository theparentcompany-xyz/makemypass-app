import { useContext } from 'react';
import { downloadFile } from '../../apis/guests';
import { formatDate } from '../../common/commonFunctions';
import { GlobalContext } from '../../contexts/globalContext';
import styles from './Table.module.css';
import { AnimatePresence, motion } from 'framer-motion';

const GenericTable = ({ tableHeading, tableData }: { tableHeading: string; tableData: any[] }) => {
  const formattedKeys =
    tableData.length > 0
      ? Object.keys(tableData[0]).map((key) => {
          const formattedKey = key
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          return formattedKey;
        })
      : [];

  const { eventId } = useContext(GlobalContext);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0 }}
        className={styles.tableOuterContainer}
      >
        <div className={styles.tableHeader}>
          <p className={styles.tableHeading}>{tableHeading}</p>
        </div>

        <div className={styles.tableContainer}>
          <AnimatePresence>
            <table className={styles.table}>
              <thead>
                <tr>
                  {formattedKeys.map((key) =>
                    key.includes('Id') || key.includes('id') ? null : (
                      <th className={styles.rowName}>{key}</th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {tableData?.length > 0 &&
                  tableData.map((data) => (
                    <tr key={data.name} className={styles.tableRow}>
                      {Object.keys(data).map((key) =>
                        key.includes('id') || key.includes('Id') ? null : (
                          <>
                            <td className={styles.rowName}>
                              {typeof data[key] == 'string' && !isNaN(new Date(data[key]).getTime())
                                ? formatDate(data[key])
                                : data[key]}
                            </td>
                          </>
                        ),
                      )}
                      <td
                        onClick={() => {
                          downloadFile(eventId, data.file_id, 'uploaded');
                        }}
                      >
                        Uploaded
                      </td>
                      <td
                        onClick={() => {
                          downloadFile(eventId, data.file_id, 'processed');
                        }}
                      >
                        Processed
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default GenericTable;
