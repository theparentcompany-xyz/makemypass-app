import React, { Dispatch, useMemo } from 'react';
import { resentTicket } from '../../pages/app/Guests/types';
import styles from './Table.module.css';
import { TableType } from './types';
import { BsTicketPerforatedFill } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { MdEdit } from 'react-icons/md';
import { FixedSizeList } from 'react-window';
import { FaCheck } from 'react-icons/fa6';
import { MdDownload } from 'react-icons/md';

type ItemDataType = {
  filteredData: TableType[];
  setResentTicket?: Dispatch<React.SetStateAction<resentTicket>>;
  setSelectedGuestId?: Dispatch<React.SetStateAction<any | null>>;
};

const RowComponent = React.memo(
  ({ index, style, data }: { index: number; style: React.CSSProperties; data: ItemDataType }) => {
    const { filteredData, setResentTicket, setSelectedGuestId } = data;
    const item = filteredData[index];

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={style}
        className={styles.row}
      >
        <div className={styles.rowData}>
          <p className={styles.rowName}>{item.name}</p>
          <p className={styles.rowEmail}>{item.email}</p>
          <p className={styles.rowEmail}>{item.phone_number}</p>
          {item.check_in_date && (
            <div className={styles.icon}>
              <FaCheck color='white' size={12} />
            </div>
          )}
        </div>
        <div className={styles.rowData}>
          <p className={styles.rowType}>{item.category}</p>
          <p className={styles.rowDate}>{item.date}</p>
          {setResentTicket && (
            <>
              <div className={styles.icon}>
                <BsTicketPerforatedFill
                  onClick={() => {
                    if (setResentTicket) {
                      setResentTicket((prevState) => ({
                        ...prevState,
                        status: true,
                        guestId: item.id,
                        name: item.name,
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
                      setSelectedGuestId((prevState: any) => ({
                        ...prevState,
                        id: item.id,
                        type: 'edit',
                      }));
                    }
                  }}
                  color='#8E8E8E'
                />
              </div>
              <div className={styles.icon}>
                <MdDownload
                  onClick={() => {
                    if (setSelectedGuestId) {
                      setSelectedGuestId((prevState: any) => ({
                        ...prevState,
                        id: item.id,
                        type: 'download',
                      }));
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
  },
);

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
  setSelectedGuestId?: Dispatch<React.SetStateAction<any | null>>;
}) => {
  const filteredData = useMemo(() => {
    let keyword = '';
    if (search) keyword = search.toLowerCase();
    return tableData.filter(
      (item) =>
        item.name?.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword) ||
        item.phone_number.toLowerCase().includes(keyword),
    );
  }, [tableData, search]);

  const itemData: ItemDataType = useMemo(
    () => ({
      filteredData,
      setResentTicket,
      setSelectedGuestId,
    }),
    [filteredData, setResentTicket, setSelectedGuestId],
  );

  return (
    <>
      <div className={styles.tableOuterContainer}>
        <div className={styles.tableHeader}>
          <p className={styles.tableHeading}>{tableHeading}</p>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.table}>
            <AnimatePresence>
              <FixedSizeList
                height={filteredData.length > 10 ? 550 : filteredData.length * 35}
                width='100%'
                itemCount={filteredData.length}
                itemSize={35} // Adjust based on row height
                itemData={itemData}
              >
                {RowComponent}
              </FixedSizeList>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
