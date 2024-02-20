import React, { Dispatch, useMemo } from 'react';
import { ResentTicket, SelectedGuest } from '../../pages/app/Guests/types';
import styles from './Table.module.css';
import { TableType } from './types';
import { BsTicketPerforatedFill } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { MdDelete, MdEdit } from 'react-icons/md';
import { FixedSizeList } from 'react-window';
import { FaCheck, FaDollarSign } from 'react-icons/fa6';
import { MdDownload } from 'react-icons/md';
import { hostId } from '../../pages/app/Overview/Overview/types';

type ItemDataType = {
  filteredData: TableType[];
  setResentTicket?: Dispatch<React.SetStateAction<ResentTicket>>;
  setSelectedGuestId?: React.Dispatch<React.SetStateAction<SelectedGuest | null>>;
  setHostId?: Dispatch<React.SetStateAction<hostId>>;
};

const RowComponent = React.memo(
  ({ index, style, data }: { index: number; style: React.CSSProperties; data: ItemDataType }) => {
    const { filteredData, setResentTicket, setSelectedGuestId, setHostId } = data;
    const item = filteredData[index];

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={style}
        className={styles.row}
      >
        <div
          className={styles.rowData}
          onClick={() => {
            if (setSelectedGuestId) {
              setSelectedGuestId((prevState) => ({
                ...prevState,
                id: item.id,
                type: 'view',
              }));
            }
          }}
        >
          <p className={styles.rowName}>{item.name}</p>
          <p className={styles.rowEmail}>{item.email.split('@')[0]}</p>
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
                      setSelectedGuestId((prevState) => ({
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
                      setSelectedGuestId((prevState) => ({
                        ...prevState,
                        id: item.id,
                        type: 'download',
                      }));
                    }
                  }}
                  color='#8E8E8E'
                />
              </div>
              <div className={styles.icon}>
                <FaDollarSign color={item.amount > 0 ? '#47c97e' : '#8E8E8'} />
              </div>
            </>
          )}
          {setHostId && (
            <>
              <div className={styles.icon}>
                <MdEdit
                  onClick={() => {
                    if (setHostId) {
                      setHostId((prevState) => ({
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
                <MdDelete
                  onClick={() => {
                    if (setHostId) {
                      setHostId((prevState) => ({
                        ...prevState,
                        id: item.id,
                        type: 'delete',
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
  secondaryButton,
  setHostId,
}: {
  tableHeading: string;
  tableData: TableType[];
  search?: string;
  setResentTicket?: Dispatch<React.SetStateAction<ResentTicket>>;
  setSelectedGuestId?: Dispatch<React.SetStateAction<SelectedGuest | null>>;
  secondaryButton?: React.ReactElement;
  setHostId?: Dispatch<React.SetStateAction<hostId>>;
}) => {
  const filteredData = useMemo(() => {
    let keyword = '';
    if (search) keyword = search.toLowerCase();
    return tableData.filter(
      (item) =>
        item.name?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword) ||
        item.phone_number?.toLowerCase().includes(keyword),
    );
  }, [tableData, search]);

  const itemData: ItemDataType = useMemo(
    () => ({
      filteredData,
      setResentTicket,
      setSelectedGuestId,
      setHostId,
    }),
    [filteredData, setResentTicket, setSelectedGuestId, setHostId],
  );

  return (
    <>
      <div className={styles.tableOuterContainer}>
        <div className={styles.tableHeader}>
          <p className={styles.tableHeading}>{tableHeading}</p>
          {secondaryButton && secondaryButton}
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.table}>
            <AnimatePresence>
              <FixedSizeList
                height={filteredData.length > 15 ? 550 : filteredData.length * 35}
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
