import { AnimatePresence, motion } from 'framer-motion';
import React, { Dispatch, useMemo } from 'react';
import { FaCheck, FaDollarSign } from 'react-icons/fa6';
import { MdCheckBox, MdCheckBoxOutlineBlank, MdDelete, MdEdit } from 'react-icons/md';
import { HashLoader } from 'react-spinners';
import { FixedSizeList } from 'react-window';

import { Roles, TillRoles } from '../../../services/enums';
import { isUserAuthorized, isUserEditor, timeAgo } from '../../common/commonFunctions';
import { PaginationDataType, ResentTicket, SelectedGuest } from '../../pages/app/Guests/types';
import { checkUserHierarchy } from '../../pages/app/Overview/Overview/functions';
import type { hostId } from '../../pages/app/Overview/Overview/types';
import styles from './Table.module.css';
import { TableType, TabType } from './types';

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

  team.sort((a, b) => {
    if (a.is_team_lead && !b.is_team_lead) {
      return -1;
    } else if (!a.is_team_lead && b.is_team_lead) {
      return 1;
    } else {
      return 0;
    }
  });

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
                if (setSelectedGuestId)
                  setSelectedGuestId({
                    id: item.id,
                    type: 'view',
                  });
              }}
            >
              <p className={styles.rowName}>
                {item.team_id && <span>•</span>}
                {item.fullname || item.name}
              </p>
              <p className={styles.rowEmail}>{item.email?.split('@')[0]}</p>
              <p className={styles.rowEmail}>{item.phonenumber}</p>
              {item.is_checked_in && (
                <div className={styles.icon}>
                  <FaCheck color='white' size={12} />
                </div>
              )}
            </div>
            <div className={styles.rowData}>
              {item.category && (
                <p
                  className={styles.rowType}
                  style={{
                    backgroundColor: categoryColorMapping[item.category]?.backgroundColor ?? '',
                    color: categoryColorMapping[item.category]?.color ?? '',
                  }}
                >
                  {item.category}
                </p>
              )}
              <p className={styles.rowDate}>{timeAgo(item.registered_at)}</p>
              {setResentTicket && (
                <>
                  {(isUserEditor() || isUserAuthorized(TillRoles.VOLUNTEER)) && (
                    <div className={styles.icon}>
                      <MdEdit
                        className='pointer'
                        onClick={() => {
                          if (setSelectedGuestId) {
                            setSelectedGuestId({
                              id: item.id,
                              type: 'edit',
                            });
                          }
                        }}
                        color='#8E8E8E'
                      />
                    </div>
                  )}
                  {item.is_approved ? (
                    <div className={styles.icon} title='Shortlisted'>
                      <MdCheckBox color='#8E8E8E' />
                    </div>
                  ) : (
                    <div className={styles.icon}>
                      <MdCheckBoxOutlineBlank
                        color={item.is_approved === false ? '#D70040' : '#8E8E8E'}
                        title='Not Shortlisted'
                      />
                    </div>
                  )}

                  <div title={item.amount?.toString()} className={styles.icon}>
                    <FaDollarSign color={item.amount > 0 ? '#47c97e' : '#8E8E8'} />
                  </div>
                </>
              )}
              {setHostId && isUserEditor() && checkUserHierarchy(item.category as Roles) && (
                <>
                  <div className={styles.icon}>
                    <MdEdit
                      className='pointer'
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
                      className='pointer'
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

  setResentTicket,
  setSelectedGuestId,
  secondaryButton,
  setHostId,
  paginationData,
  setPaginationData,
  setTriggerFetch,
}: {
  tableHeading: string;
  tableData: TableType[];

  setResentTicket?: Dispatch<React.SetStateAction<ResentTicket>>;
  setSelectedGuestId?: Dispatch<React.SetStateAction<SelectedGuest | null>>;
  secondaryButton?: React.ReactElement;
  setHostId?: Dispatch<React.SetStateAction<hostId>>;
  paginationData?: PaginationDataType;
  setPaginationData?: Dispatch<React.SetStateAction<PaginationDataType>>;
  setTriggerFetch?: Dispatch<React.SetStateAction<boolean>>;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData]);

  const groupBy = (tableData: TableType[], key: string) => {
    return tableData.reduce((result: { [key: string]: TableType[] }, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
      return result;
    }, {});
  };

  const groupByTeam = groupBy(tableData, 'team_id');

  const itemData: ItemDataType = useMemo(
    () => ({
      groupByTeam,
      setResentTicket,
      setSelectedGuestId,
      setHostId,
      categoryColorMapping,
    }),
    [groupByTeam, setResentTicket, setSelectedGuestId, setHostId, categoryColorMapping],
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
          <p className={styles.tableHeading}>
            {`${tableHeading}${tableData.length > 10 ? `(${tableData.length})` : ''}`}
          </p>
          {secondaryButton && secondaryButton}
        </div>

        <div className={styles.tableContainer}>
          {tableData.length > 0 ? (
            <div className={styles.table}>
              {paginationData && paginationData.fetchingData ? (
                <div
                  className='center'
                  style={{
                    height: '34vh',
                  }}
                >
                  <HashLoader color='#47c97e' size={50} />
                </div>
              ) : (
                <AnimatePresence>
                  <FixedSizeList
                    height={Object.keys(groupByTeam).length > 50 ? 550 : tableData.length * 38}
                    width='100%'
                    itemCount={Object.keys(groupByTeam).length}
                    itemSize={37} // Adjust based on row height
                    itemData={itemData}
                  >
                    {RowComponent}
                  </FixedSizeList>
                </AnimatePresence>
              )}
            </div>
          ) : (
            <div className={styles.noData}>
              <p>No data found</p>
            </div>
          )}
        </div>

        <div className={styles.paginationContainer}>
          {paginationData && (
            <>
              <div className={styles.totalRecords}>
                <p className={styles.paginationText}>{paginationData.total_items} Records</p>
              </div>
              <div className={styles.perPage}>
                <p className={styles.paginationText}>
                  Per Page:{' '}
                  <select
                    className={styles.perPageSelect}
                    value={paginationData.per_page}
                    onChange={(e) => {
                      setTriggerFetch && setTriggerFetch((prevState) => !prevState);
                      setPaginationData &&
                        setPaginationData((prevState) => ({
                          ...prevState,
                          per_page: Number(e.target.value),
                        }));
                    }}
                  >
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </p>
              </div>
              {(paginationData.next || paginationData.previous) && (
                <div className={styles.pagination}>
                  <p className={styles.paginationText}>
                    {paginationData.page} of {paginationData.total_pages}
                  </p>
                  <button
                    className={styles.paginationButton}
                    disabled={paginationData.page === 1}
                    onClick={() => {
                      setTriggerFetch && setTriggerFetch((prevState) => !prevState);
                      setPaginationData &&
                        setPaginationData((prevState) => ({
                          ...prevState,
                          page: prevState.page - 1,
                        }));
                    }}
                    style={
                      paginationData.previous === null
                        ? {
                            opacity: 0.4,
                            cursor: 'not-allowed',
                          }
                        : {}
                    }
                  >
                    {'<'}
                  </button>

                  <button
                    className={styles.paginationButton}
                    disabled={paginationData.page === paginationData.total_pages}
                    onClick={() => {
                      setTriggerFetch && setTriggerFetch((prevState) => !prevState);
                      setPaginationData &&
                        setPaginationData((prevState) => ({
                          ...prevState,
                          page: prevState.page + 1,
                        }));
                    }}
                    style={
                      paginationData.next === null
                        ? {
                            opacity: 0.4,
                            cursor: 'not-allowed',
                          }
                        : {}
                    }
                  >
                    {'>'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Table;
