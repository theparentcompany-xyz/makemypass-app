import styles from './ClaimGifts.module.css';
import Theme from '../../../components/Theme/Theme';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventUUID } from '../../../common/commonFunctions';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import { QrScanner } from '@yudiel/react-qr-scanner';
import toast from 'react-hot-toast';
import { claimGift, listUserGifts } from '../../../apis/spinwheel';
import Glance from '../../../components/Glance/Glance';
import { BsFillRocketTakeoffFill } from 'react-icons/bs';
import CheckInHeader from '../CheckIns/components/CheckInHeader/CheckInHeader/CheckInHeader';

const ClaimGifts = () => {
  const [ticketId, setTicketId] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [gitfs, setGifts] = useState<any[]>([]);
  const [giftsTableData, setGiftsTableData] = useState<any[]>([]);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [item, setItem] = useState();

  const [eventId, setEventId] = useState<string>('');
  const { eventTitle } = useParams<{ eventTitle: string }>();

  useEffect(() => {
    if (eventTitle && !eventId) getEventUUID(eventTitle, setEventId);
  }, [eventTitle]);

  useEffect(() => {
    if (eventId) listUserGifts(eventId, ticketId, setGifts);
  }, [isScanning]);

  useEffect(() => {
    const convertGifts: any = [];

    for (const type in gitfs) {
      for (const date in gitfs[type]) {
        const newItem = {
          type: type,
          date: date,
          item: gitfs[type][date].item,
          claimedAt: gitfs[type][date].claimed_at,
          claimedBy: gitfs[type][date].claimed_by,
          authorizedBy: gitfs[type][date].authorized_by,
        };
        convertGifts.push(newItem);
      }
    }

    setGiftsTableData(convertGifts);
  }, [gitfs]);

  const handleClaimButtonClick = (item: any) => {
    claimGift(eventId, ticketId, item.date);
    setOpenConfirm(false);
  };

  return (
    <Theme>
      {openConfirm && (
        <dialog className={styles.onClickModal}>
          <p className={styles.modalHeader}>Claim Gift</p>
          <p className={styles.modalSubText}>Are you sure you want to claim&nbsp;</p>
          <div className={styles.buttons}>
            <p
              onClick={() => {
                handleClaimButtonClick(item);
              }}
              className={styles.button}
            >
              Confirm
            </p>
            <p
              onClick={() => {
                setOpenConfirm(false);
              }}
              className={styles.button}
            >
              Cancel
            </p>
          </div>
        </dialog>
      )}
      <div className={styles.scanContainer}>
        <CheckInHeader buttonType='back' />

        <hr className={styles.line} />
      </div>
      <div className={styles.scannerContainer}>
        <p className={styles.scanHeader}>Scan QR Code Below</p>
        <div className={styles.scannerOuterContainer}>
          <div className={styles.scanner}>
            <QrScanner
              containerStyle={{
                backgroundColor: '#000',
              }}
              onResult={(result) => {
                setTicketId(result.getText());
                setIsScanning(false);
              }}
              onError={(error) => {
                toast.error(error.message);
              }}
            />
          </div>
        </div>

        <div className={styles.inputContainer}>
          <br />
          <p className={styles.inputText}>Or Enter Code Below</p>
          <input
            className={styles.input}
            placeholder='Enter Ticket Code'
            value={ticketId}
            onChange={(e) => {
              setTicketId(e.target.value);
            }}
          />
          <SecondaryButton
            buttonText='Check In'
            onClick={() => {
              setIsScanning(false);
            }}
          />
        </div>
      </div>
      {!isScanning && (
        <div className={styles.tableOuterContainer}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeading}>Your Gifts</div>
          </div>

          <div className={styles.tableContainer}>
            <div className={styles.table}>
              {giftsTableData.map((item, index) => {
                return (
                  <div key={index} className={styles.row}>
                    <div className={styles.rowData}>
                      <p className={styles.giftName}>{item.item}</p>
                      <p className={styles.date}>{item.date}</p>
                      <p className={styles.status}>{item.type}</p>
                    </div>
                    <div className={styles.rowData}>
                      <p className={styles.date}>{item.claimedAt ? item.claimed_at : '-'}</p>
                      <p className={styles.claimedBy}>{item.claimedBy ? item.claimed_by : '-'}</p>
                      <div className={styles.icon}>
                        <BsFillRocketTakeoffFill
                          onClick={() => {
                            setOpenConfirm(true);
                            setItem(item);
                          }}
                          color='#8E8E8E'
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Theme>
  );
};

export default ClaimGifts;
