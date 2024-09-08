/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from 'framer-motion';
import { isDate } from 'lodash';
import { useState } from 'react';

import { deleteCoupon, getCouponData } from '../../apis/coupons';
import { formatDate } from '../../common/commonFunctions';
import type { CouponType, CreateCouponType } from '../../pages/app/Coupon/types';
import SecondaryButton from '../../pages/app/Overview/components/SecondaryButton/SecondaryButton';
import Modal from '../Modal/Modal';
import styles from './Table.module.css';

type CouponModalType = {
  showModal: boolean;
};

const GenericTable = ({
  tableHeading,
  tableData,
  secondaryButton,
  setNewCouponData,
  setCouponModal,
  setTableData,
}: {
  tableHeading: string;
  tableData: any[];
  secondaryButton?: React.ReactElement;
  setNewCouponData?: React.Dispatch<React.SetStateAction<CreateCouponType>>;
  setCouponModal?: React.Dispatch<React.SetStateAction<CouponModalType>>;
  setTableData?: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponType>();

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

  const eventId = JSON.parse(sessionStorage.getItem('eventData')!).event_id;

  return (
    <>
      {showConfirmModal && (
        <Modal
          title='Delete Coupon'
          onClose={() => setShowConfirmModal(false)}
          style={{
            width: '20rem',
          }}
        >
          <p
            style={{
              fontSize: '0.9rem',
            }}
          >
            Are you sure you want to delete this coupon?
          </p>
          <div
            className='row'
            style={{
              marginTop: '20px',
            }}
          >
            <SecondaryButton buttonText='Cancel' onClick={() => setShowConfirmModal(false)} />
            <SecondaryButton
              buttonText='Delete'
              onClick={() => {
                deleteCoupon(
                  JSON.parse(sessionStorage.getItem('eventData')!).event_id,
                  selectedCoupon!.id,
                  setTableData as React.Dispatch<React.SetStateAction<CouponType[]>>,
                );
                setShowConfirmModal(false);
              }}
            />
          </div>
        </Modal>
      )}
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
            <table className={styles.table} cellSpacing={15}>
              <thead>
                <tr>
                  {formattedKeys.map(
                    (key) => !key.includes('Id') && <th className={styles.rowName}>{key}</th>,
                  )}
                </tr>
              </thead>
              <tbody>
                {tableData?.length > 0 ? (
                  tableData.map((data) => (
                    <tr key={data.name} className={styles.tableRow}>
                      {Object.keys(data).map(
                        (key) =>
                          !key.includes('id') && (
                            <>
                              {isDate(data[key]) ? (
                                <td className={styles.rowName}>
                                  {formatDate(data[key].toString())}
                                </td>
                              ) : typeof data[key] === 'boolean' ? (
                                <td
                                  className={`${styles.rowName} ${styles.rowType}`}
                                  style={
                                    data[key]
                                      ? {
                                          backgroundColor: 'rgba(7, 164, 96, 0.13)',
                                          color: 'rgb(71, 201, 126)',
                                        }
                                      : {
                                          backgroundColor: 'rgba(195, 61, 123, 0.13)',
                                          color: 'rgb(195, 61, 123)',
                                        }
                                  }
                                >
                                  {data[key] ? 'Yes' : 'No'}
                                </td>
                              ) : (
                                <td className={styles.rowName}>{data[key] ?? 0}</td>
                              )}
                            </>
                          ),
                      )}

                      {setNewCouponData && (
                        <td className={styles.buttonsContainer}>
                          <SecondaryButton
                            buttonText='Edit'
                            onClick={() => {
                              getCouponData(eventId, data.id).then((response) => {
                                setNewCouponData(response);
                                if (setCouponModal) setCouponModal({ showModal: true });
                              });
                              // setNewCouponData(data);
                              // if (setCouponModal) setCouponModal({ showModal: true });
                            }}
                          />
                        </td>
                      )}
                      {data.consumed === 0 && (
                        <td>
                          <SecondaryButton
                            buttonText='Delete'
                            onClick={() => {
                              setSelectedCoupon(data);
                              setShowConfirmModal(true);
                              // deleteCoupon(
                              //   JSON.parse(sessionStorage.getItem('eventData')!).event_id,
                              //   data.id,
                              //   setTableData as React.Dispatch<React.SetStateAction<CouponType[]>>,
                              // );
                            }}
                          />
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
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
