import React, { Dispatch, useMemo } from 'react';
import { ResentTicket, SelectedGuest } from '../../pages/app/Guests/types';
import styles from './Table.module.css';
import { TabType, TableType } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCheckBox, MdCheckBoxOutlineBlank, MdDelete, MdEdit } from 'react-icons/md';
import { FixedSizeList } from 'react-window';
import { FaCheck, FaDollarSign } from 'react-icons/fa6';
import { hostId } from '../../pages/app/Overview/Overview/types';
import { timeAgo } from '../../common/commonFunctions';

type ItemDataType = {
  groupByTeam: {
    [key: string]: TableType[];
  };
  setResentTicket?: Dispatch<React.SetStateAction<ResentTicket>>;
  setSelectedGuestId?: React.Dispatch<React.SetStateAction<SelectedGuest | null>>;
  setHostId?: Dispatch<React.SetStateAction<hostId>>;
  categoryColorMapping: TabType;
};

const RowComponent = React.memo(({ index, data }: { index: number; data: ItemDataType }) => {
  const { groupByTeam, setResentTicket, setSelectedGuestId, setHostId, categoryColorMapping } =
    data;
  const item = groupByTeam;
  const teamId = Object.keys(item)[index];
  const team = item[teamId];

  return (
    <div className={styles.tableRow}>
      <div className={styles.tableRowData}>
        {team.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.row}
            style={!item.team_id ? { marginLeft: '0' } : {}}
          >
            <div
              className={styles.rowData}
              style={{ cursor: setSelectedGuestId ? 'pointer' : 'default' }}
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
              <p className={styles.rowName}>
                {item.team_id && <span>•</span>}
                {item.name}
              </p>
              <p className={styles.rowEmail}>{item.email.split('@')[0]}</p>
              <p className={styles.rowEmail}>{item.phone_number}</p>
              {item.check_in_date && (
                <div className={styles.icon}>
                  <FaCheck color='white' size={12} />
                </div>
              )}
            </div>
            <div className={styles.rowData}>
              <p
                className={styles.rowType}
                style={{
                  backgroundColor: categoryColorMapping[item.category]?.backgroundColor ?? '',
                  color: categoryColorMapping[item.category]?.color ?? '',
                }}
              >
                {item.category}
              </p>
              <p className={styles.rowDate}>{timeAgo(item.date)}</p>
              {setResentTicket && (
                <>
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
                  {item.is_shortlisted ? (
                    <div className={styles.icon} title='Shortlisted'>
                      <MdCheckBox color='#8E8E8E' />
                    </div>
                  ) : (
                    <div className={styles.icon}>
                      <MdCheckBoxOutlineBlank
                        color={item.is_shortlisted === false ? '#D70040' : '#8E8E8E'}
                        title='Not Shortlisted'
                      />
                    </div>
                  )}

                  <div title={item.amount?.toString()} className={styles.icon}>
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
        ))}
      </div>
    </div>
  );
});

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
  const categoryColors = ['#47C97E', '#7662FC', '#C33D7B', '#FBD85B', '#5B75FB', '#D2D4D7'];

  const rgbaArray = [
    'rgba(7, 164, 96, 0.13)',
    'rgba(118, 98, 252, 0.13)',
    'rgba(195, 61, 123, 0.13)',
    'rgba(251, 216, 91, 0.13)',
    'rgba(91, 117, 251, 0.13)',
    'rgba(147, 149, 151, 0.13)',
  ];

  const categoryColorMapping = useMemo(() => {
    const categoryColorMap: TabType = {};

    tableData.forEach((item) => {
      if (item.category) {
        if (!categoryColorMap[item.category]) {
          categoryColorMap[item.category] = {
            color: categoryColors.pop() ?? '',
            backgroundColor: rgbaArray.pop() ?? '',
          };
        }
      }
    });

    return categoryColorMap;
  }, [tableData]);

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

  const groupBy = (filteredData: TableType[], key: string) => {
    return filteredData.reduce((result: { [key: string]: TableType[] }, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
      return result;
    }, {});
  };

  const groupByTeam = groupBy(filteredData, 'team_id');

  const itemData: ItemDataType = useMemo(
    () => ({
      groupByTeam,
      setResentTicket,
      setSelectedGuestId,
      setHostId,
      categoryColorMapping,
    }),
    [groupByTeam, setResentTicket, setSelectedGuestId, setHostId],
  );

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
          <div className={styles.table}>
            <AnimatePresence>
              <FixedSizeList
                height={filteredData.length > 15 ? 550 : filteredData.length * 35}
                width='100%'
                itemCount={Object.keys(groupByTeam).length}
                itemSize={35} // Adjust based on row height
                itemData={itemData}
              >
                {RowComponent}
              </FixedSizeList>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Table;
