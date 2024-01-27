import { HTMLInputTypeAttribute } from 'react';
import SecondaryButton from '../../pages/app/Overview/components/SecondaryButton/SecondaryButton';
import styles from './Table.module.css';
import { TableType } from './types';

const Table = ({ tableData, ...props }: { tableData: TableType[] & HTMLInputTypeAttribute }) => {
  return (
    <>
      <div {...props} className={styles.tableOuterContainer}>
        <div className={styles.tableHeader}>
          <p className={styles.tableHeading}>Recent Registration</p>
          <SecondaryButton buttonText='All Guests ➞' />
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.table}>
            {tableData.map((data, index) => {
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
