import styles from './Table.module.css';
import { TableType } from './types';

const Table = ({
  tableHeading,
  tableData,
  search,
}: {
  tableHeading: string;
  tableData: TableType[];
  search?: string;
}) => {
  return (
    <>
      <div className={styles.tableOuterContainer}>
        <div className={styles.tableHeader}>
          <p className={styles.tableHeading}>{tableHeading}</p>
          {/* <SecondaryButton buttonText='All Guests ➞' /> */}
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.table}>
            {tableData
              .filter((data) => {
                const { name, email } = data;
                if (!search) return true;
                const keyword = search ? search.toLowerCase() : '';
                return (
                  name.toLowerCase().includes(keyword) || email.toLowerCase().includes(keyword)
                );
              })
              .map((data, index) => {
                return (
                  <div key={index} className={styles.row}>
                    <div className={styles.rowData}>
                      <p className={styles.rowName}>{data.name}</p>
                      <p className={styles.rowEmail}>{data.email}</p>
                    </div>
                    <div className={styles.rowData}>
                      <p className={styles.rowType}>{data.category}</p>
                      <p className={styles.rowDate}>{data.date}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
