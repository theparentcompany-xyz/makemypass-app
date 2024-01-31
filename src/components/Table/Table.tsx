import { Dispatch } from 'react';
import { resentTicket } from '../../pages/app/Guests/types';
import styles from './Table.module.css';
import { TableType } from './types';
import { BsTicketPerforatedFill } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { MdEdit } from 'react-icons/md';

const Table = ({
  tableHeading,
  tableData,
  search,
  setResentTicket,
  setSelectedGuestId,
}: {
  tableHeading: string;
  tableData: TableType[];
  search?: string;
  setResentTicket?: Dispatch<React.SetStateAction<resentTicket>>;
  setSelectedGuestId?: Dispatch<React.SetStateAction<string | null>>;
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
            <AnimatePresence>
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
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={index}
                      className={styles.row}
                    >
                      <div className={styles.rowData}>
                        <p className={styles.rowName}>{data.name}</p>
                        <p className={styles.rowEmail}>{data.email}</p>
                      </div>
                      <div className={styles.rowData}>
                        <p className={styles.rowType}>{data.category}</p>
                        <p className={styles.rowDate}>{data.date}</p>
                        {setResentTicket && (
                          <>
                            <div className={styles.icon}>
                              <BsTicketPerforatedFill
                                onClick={() => {
                                  if (setResentTicket) {
                                    setResentTicket((prevState) => ({
                                      ...prevState,
                                      status: true,
                                      guestId: data.id,
                                      name: data.name,
                                    }));
                                  }
                                }}
                                color='#8E8E8E'
                              />
                            </div>
                            <div className={styles.icon}>
                              <MdEdit
                                onClick={() => {
                                  if (setSelectedGuestId) {
                                    setSelectedGuestId(data.id);
                                  }
                                }}
                                color='#8E8E8E'
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
