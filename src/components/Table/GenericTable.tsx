import { formatDate } from '../../common/commonFunctions';
import styles from './Table.module.css';
import { AnimatePresence, motion } from 'framer-motion';

const GenericTable = ({
  tableHeading,
  tableData,
  secondaryButton,
}: {
  tableHeading: string;
  tableData: any[];
  secondaryButton?: React.ReactElementu;
}) => {
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
          {secondaryButton && secondaryButton}
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
                            {typeof data[key] === 'string' && key.includes('at') ? (
                              <td className={styles.rowName}>{formatDate(data[key])}</td>
                            ) : typeof data[key] === 'boolean' ? (
                              <td className={`${styles.rowName} ${styles.rowType}`}>
                                {data[key] ? 'Active' : 'Inactive'}
                              </td>
                            ) : (
                              <td className={styles.rowName}>{data[key] ?? 0}</td>
                            )}
                          </>
                        ),
                      )}
                    </tr>
                  ))}

                {tableData?.length == 0 && (
                  <tr className={styles.tableRow}>
                    <td className={styles.rowName}>No Data Yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default GenericTable;
