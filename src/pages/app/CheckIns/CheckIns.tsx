import Theme from '../../../components/Theme/Theme';
import Glance from '../Overview/components/Glance/Glance';
import Header from '../Overview/components/Header/Header';
import styles from './CheckIns.module.css';

import SectionButton from '../../../components/SectionButton/SectionButton';
// import { FaWrench } from "react-icons/fa6";
import { HiUserGroup } from 'react-icons/hi2';
import { BsQrCodeScan } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useState } from 'react';
// import SecondaryButton from "../Overview/components/SecondaryButton/SecondaryButton";
// import { useState } from "react";
// import { tableType } from "./types";

const CheckIns = () => {
  // const [recentCheckIns, setRecentCheckIns] = useState<tableType[]>([]);
  // const [recentGiftClaims, setRecentGiftClaims] = useState<tableType[]>([]);
  // const [recentPerkClaims, setRecentPerkClaims] = useState<tableType[]>([]);
  const [role, setRole] = useState('');
  return (
    <Theme>
      <div className={styles.checkInsContainer}>
        <Header setRole={setRole} />
        <Glance tab='checkins' />
        <div className={styles.checkInsButtons}>
          <p className={styles.checkInsHeading}>On-Site Event Management</p>
          <hr className={styles.line} />
          <div className={styles.buttons}>
            <div className='row'>
              {role === 'Admin' && (
                <Link to='checkin'>
                  <SectionButton
                    buttonText='Check-In'
                    buttonColor='#C33D7B'
                    icon={<HiUserGroup size={25} color='#7662FC' />}
                  />
                </Link>
              )}
              <Link to='checkin/scan'>
                <SectionButton
                  buttonText='Scan User'
                  buttonColor='#C33D7B'
                  icon={<BsQrCodeScan size={25} color='#5B75FB' />}
                />
              </Link>
            </div>
            {/* <div className="row">
                            <SectionButton
                                buttonText="Perks"
                                buttonColor="#C33D7B"
                                icon={
                                    <BsQrCodeScan size={25} color="#5B75FB" />
                                }
                            />
                            <SectionButton
                                buttonText="Gifts"
                                buttonColor="#C33D7B"
                                icon={<FaWrench size={25} color="#C33D7B" />}
                            />
                        </div> */}
          </div>
        </div>
        {/* <div className={styles.recentRegistrations}>
        //             <div className={styles.tableHeader}>
        //                 <p className={styles.tableHeading}>Recent CheckIns</p>
        //                 <SecondaryButton buttonText="All Guests ➞" />
        //             </div>

        //             <div className={styles.tableContainer}>
        //                 <div className={styles.table}>
        //                     {recentCheckIns && recentCheckIns.length > 0 ? (
        //                         recentCheckIns.map((data, index) => {
        //                             return (
        //                                 <div key={index} className={styles.row}>
        //                                     <div className={styles.rowData}>
        //                                         <p className={styles.rowName}>
        //                                             {data.name}
        //                                         </p>
        //                                         <p className={styles.rowEmail}>
        //                                             {data.email}
        //                                         </p>
        //                                     </div>
        //                                     <div className={styles.rowData}>
        //                                         <p className={styles.rowType}>
        //                                             {data.category}
        //                                         </p>
        //                                         <p className={styles.rowDate}>
        //                                             {data.registered_at}
        //                                         </p>
        //                                     </div>
        //                                 </div>
        //                             );
        //                         })
        //                     ) : (
        //                         <div className={styles.row}>
        //                             <div className={styles.rowData}>
        //                                 <p className={styles.rowName}>
        //                                     Data will be displayed here once
        //                                     received.
        //                                 </p>
        //                                 <p className={styles.rowEmail}></p>
        //                             </div>
        //                             <div className={styles.rowData}>
        //                                 <p className={styles.rowType}></p>
        //                                 <p className={styles.rowDate}></p>
        //                             </div>
        //                         </div>
        //                     )}
        //                 </div>
        //             </div>
        //         </div>

        //         <div className={styles.recentRegistrations}>
        //             <div className={styles.tableHeader}>
        //                 <p className={styles.tableHeading}>
        //                     Recent Gift Claims
        //                 </p>
        //                 <SecondaryButton buttonText="All Guests ➞" />
        //             </div>

        //             <div className={styles.tableContainer}>
        //                 <div className={styles.table}>
        //                     {recentCheckIns && recentCheckIns.length > 0 ? (
        //                         recentCheckIns.map((data, index) => {
        //                             return (
        //                                 <div key={index} className={styles.row}>
        //                                     <div className={styles.rowData}>
        //                                         <p className={styles.rowName}>
        //                                             {data.name}
        //                                         </p>
        //                                         <p className={styles.rowEmail}>
        //                                             {data.email}
        //                                         </p>
        //                                     </div>
        //                                     <div className={styles.rowData}>
        //                                         <p className={styles.rowType}>
        //                                             {data.category}
        //                                         </p>
        //                                         <p className={styles.rowDate}>
        //                                             {data.registered_at}
        //                                         </p>
        //                                     </div>
        //                                 </div>
        //                             );
        //                         })
        //                     ) : (
        //                         <div className={styles.row}>
        //                             <div className={styles.rowData}>
        //                                 <p className={styles.rowName}>
        //                                     Data will be displayed here once
        //                                     received.
        //                                 </p>
        //                                 <p className={styles.rowEmail}></p>
        //                             </div>
        //                             <div className={styles.rowData}>
        //                                 <p className={styles.rowType}></p>
        //                                 <p className={styles.rowDate}></p>
        //                             </div>
        //                         </div>
        //                     )}
        //                 </div>
        //             </div>
        //         </div>

        //         <div className={styles.recentRegistrations}>
        //             <div className={styles.tableHeader}>
        //                 <p className={styles.tableHeading}>
        //                     Recent Perk Claims
        //                 </p>
        //                 <SecondaryButton buttonText="All Guests ➞" />
        //             </div>

        //             <div className={styles.tableContainer}>
        //                 <div className={styles.table}>
        //                     {recentCheckIns && recentCheckIns.length > 0 ? (
        //                         recentCheckIns.map((data, index) => {
        //                             return (
        //                                 <div key={index} className={styles.row}>
        //                                     <div className={styles.rowData}>
        //                                         <p className={styles.rowName}>
        //                                             {data.name}
        //                                         </p>
        //                                         <p className={styles.rowEmail}>
        //                                             {data.email}
        //                                         </p>
        //                                     </div>
        //                                     <div className={styles.rowData}>
        //                                         <p className={styles.rowType}>
        //                                             {data.category}
        //                                         </p>
        //                                         <p className={styles.rowDate}>
        //                                             {data.registered_at}
        //                                         </p>
        //                                     </div>
        //                                 </div>
        //                             );
        //                         })
        //                     ) : (
        //                         <div className={styles.row}>
        //                             <div className={styles.rowData}>
        //                                 <p className={styles.rowName}>
        //                                     Data will be displayed here once
        //                                     received.
        //                                 </p>
        //                                 <p className={styles.rowEmail}></p>
        //                             </div>
        //                             <div className={styles.rowData}>
        //                                 <p className={styles.rowType}></p>
        //                                 <p className={styles.rowDate}></p>
        //                             </div>
        //                         </div>
        //                     )}
        //                 </div>
        //             </div>
        //         </div> */}
      </div>
    </Theme>
  );
};

export default CheckIns;
