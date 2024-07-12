// import styles from './ClaimGifts.module.css';
// import Theme from '../../../components/Theme/Theme';
// import { useEffect, useState } from 'react';
// import { getEventUUID } from '../../../common/commonFunctions';
// import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
// import { QrScanner } from '@yudiel/react-qr-scanner';
// import toast from 'react-hot-toast';
// import { claimGift, listUserGifts } from '../../../apis/spinwheel';
// import { BsFillRocketTakeoffFill, BsQrCodeScan } from 'react-icons/bs';
// import CheckInHeader from '../CheckIns/components/CheckInHeader/CheckInHeader/CheckInHeader';
// import SectionButton from '../../../components/SectionButton/SectionButton';
// import { getUserInfo } from '../../../apis/user';
// import UserInfo from '../CheckIns/components/UserInfo/UserInfo';
// import { useParams } from 'react-router';
// import Modal from '../../../components/Modal/Modal';
//
// type UserInfoType = {
//   category: string;
//   name: string;
//   email: string;
//   phone: string;
//   district: string;
//   organization: string;
// };
//
// const ClaimGifts = () => {
//   const [ticketId, setTicketId] = useState<string>('');
//   const [isScanning, setIsScanning] = useState<boolean>(false);
//   const [gitfs, setGifts] = useState<any[]>([]);
//   const [giftsTableData, setGiftsTableData] = useState<any[]>([]);
//   const [userInfo, setUserInfo] = useState<UserInfoType>({
//     category: '',
//     name: '',
//     email: '',
//     phone: '',
//     district: '',
//     organization: '',
//   });
//
//   const [openConfirm, setOpenConfirm] = useState(false);
//   const [item, setItem] = useState();
//
//   const [eventId, setEventId] = useState<string>('');
//   const { eventTitle } = useParams<{ eventTitle: string }>();
//
//   useEffect(() => {
//     if (eventTitle && !eventId) getEventUUID(eventTitle, setEventId);
//   }, [eventTitle]);
//
//   useEffect(() => {
//     if (eventId && ticketId.length > 0) {
//       listUserGifts(eventId, ticketId, setGifts);
//       getUserInfo(eventId, ticketId, setUserInfo);
//     }
//   }, [isScanning, ticketId, eventId]);
//
//   useEffect(() => {
//     const convertGifts: any = [];
//
//     for (const type in gitfs) {
//       for (const date in gitfs[type]) {
//         const newItem = {
//           type: type,
//           date: date,
//           item: gitfs[type][date].item,
//           claimedAt: gitfs[type][date].claimed_at,
//           claimedBy: gitfs[type][date].claimed_by,
//           authorizedBy: gitfs[type][date].authorized_by,
//         };
//         convertGifts.push(newItem);
//       }
//     }
//
//     setGiftsTableData(convertGifts);
//   }, [gitfs]);
//
//   const handleClaimButtonClick = (item: any) => {
//     claimGift(eventId, ticketId, item.date);
//     setOpenConfirm(false);
//     setTimeout(() => {
//       listUserGifts(eventId, ticketId, setGifts);
//     }, 1000);
//   };
//
//   return (
//     <Theme>
//       {openConfirm && (
//         <Modal>
//           <p className={styles.modalHeader}>Claim Gift</p>
//           <p className={styles.modalSubText}>Are you sure you want to claim&nbsp;</p>
//           <div className={styles.buttons}>
//             <p
//               onClick={() => {
//                 handleClaimButtonClick(item);
//               }}
//               className={`pointer ${styles.button}`}
//             >
//               Confirm
//             </p>
//             <p
//               onClick={() => {
//                 setOpenConfirm(false);
//               }}
//               className={`pointer ${styles.button}`}
//             >
//               Cancel
//             </p>
//           </div>
//         </Modal>
//       )}
//       <div className={styles.scanContainer}>
//         <CheckInHeader buttonType='back' />
//
//         <hr className={styles.line} />
//       </div>
//       {!isScanning && giftsTableData.length > 0 ? (
//         <>
//           <div className={styles.tableOuterContainer}>
//             <div className={styles.tableHeader}>
//               <div className={styles.tableHeading}>Your Gifts</div>
//             </div>
//
//             <div className={styles.tableContainer}>
//               <div className={styles.table}>
//                 {giftsTableData.map((item, index) => {
//                   return (
//                     <div key={index} className={styles.row}>
//                       <div className={styles.rowData}>
//                         <p className={styles.giftName}>{item.item}</p>
//                         <p className={styles.date}>{item.date}</p>
//                         <p
//                           style={
//                             item.type === 'claimed'
//                               ? {
//                                   color: '#47c97e',
//                                   backgroundColor: 'rgba(71, 201, 126, 0.1)',
//                                 }
//                               : {
//                                   color: '#F44336',
//                                   backgroundColor: 'rgba(244, 67, 54, 0.1)',
//                                 }
//                           }
//                           className={styles.status}
//                         >
//                           {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
//                         </p>
//                       </div>
//                       <div className={styles.rowData}>
//                         <p className={styles.date}>{item.claimedAt ? item.claimed_at : '-'}</p>
//                         <p className={styles.claimedBy}>{item.claimedBy ? item.claimed_by : '-'}</p>
//                         {item.type === 'unclaimed' && (
//                           <div className={styles.icon}>
//                             <BsFillRocketTakeoffFill
//                               className='pointer'
//                               onClick={() => {
//                                 setOpenConfirm(true);
//                                 setItem(item);
//                               }}
//                               color='#8E8E8E'
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//           <UserInfo ticketId={ticketId} userData={userInfo} status={true} />
//         </>
//       ) : (
//         ticketId.length > 0 && (
//           <div className={styles.noDataContainer}>
//             <p className={styles.noDataText}>No Gifts Found</p>
//           </div>
//         )
//       )}
//       {isScanning && (
//         <div className={styles.scannerContainer}>
//           <p className={styles.scanHeader}>Scan QR Code Below</p>
//           <div className={styles.scannerOuterContainer}>
//             <div className={styles.scanner}>
//               <QrScanner
//                 containerStyle={{
//                   backgroundColor: '#000',
//                 }}
//                 onResult={(result) => {
//                   setTicketId(result.getText());
//                   setIsScanning(false);
//                 }}
//                 onError={(error) => {
//                   toast.error(error.message);
//                 }}
//               />
//             </div>
//           </div>
//
//           <div className={styles.inputContainer}>
//             <br />
//             <p className={styles.inputText}>Or Enter Code Below</p>
//             <input
//               className={styles.input}
//               placeholder='Enter Ticket Code'
//               value={ticketId}
//               onChange={(e) => {
//                 setTicketId(e.target.value);
//               }}
//             />
//             <SecondaryButton
//               buttonText='Check In'
//               onClick={() => {
//                 setIsScanning(false);
//               }}
//             />
//           </div>
//         </div>
//       )}
//       {!isScanning && (
//         <div className={styles.scanButton}>
//           <SectionButton
//             buttonText='Scan QR Code'
//             onClick={() => {
//               setIsScanning(true);
//               setTicketId('');
//             }}
//             buttonColor='#5B75FB'
//             icon={<BsQrCodeScan size={25} color='#5B75FB' />}
//           />
//         </div>
//       )}
//     </Theme>
//   );
// };
//
// export default ClaimGifts;
