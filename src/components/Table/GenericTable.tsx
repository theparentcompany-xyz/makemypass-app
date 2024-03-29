import { formatDate } from '../../common/commonFunctions';
import styles from './Table.module.css';
import { AnimatePresence, motion } from 'framer-motion';

const GenericTable = ({ tableHeading, tableData }: { tableHeading: string; tableData: any[] }) => {
  console.log(tableData);
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
          <div className={styles.table}>
            <AnimatePresence>
              {tableData?.length > 0 ? (
                tableData.map((data, index) => (
                  <div
                    className={styles.rowData}
                    style={{
                      padding: '0.25rem',
                    }}
                  >
                    <div
                      key={data.name}
                      className={styles.row}
                      style={{
                        paddingBottom: '0.5rem',
                        justifyContent: 'flex-start',
                      }}
                    >
                      <p className={styles.rowName}>{data.name || index + 1} </p>
                      <p className={styles.rowEmail}>
                        {data.opinion || formatDate(data.created_at)}
                      </p>
                      <p className={styles.rowEmail}>
                        {data.opinion || formatDate(data.updated_at)}
                      </p>
                      <p className={styles.rowType}>{data.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className={styles.rowData}
                  style={{
                    padding: '0.25rem',
                  }}
                >
                  <div
                    className={styles.row}
                    style={{
                      paddingBottom: '0.5rem',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <p className={styles.rowName}>No Data to Show </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default GenericTable;
