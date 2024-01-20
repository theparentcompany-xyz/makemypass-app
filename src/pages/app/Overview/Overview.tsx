import Theme from "../../../components/Theme/Theme";
import styles from "./Overview.module.css";
import Button from "./components/Button/Button";
import Glance from "./components/Glance/Glance";
import Header from "./components/Header/Header";

import { HiUserGroup } from "react-icons/hi2";
import { FaWrench } from "react-icons/fa";
import { BsQrCodeScan } from "react-icons/bs";

const Overview = () => {
    return (
        <Theme>
            <div className={styles.overViewContainer}>
                <Header />

                <div className={styles.tabsContainer}>
                    <div className={styles.tabs}>
                        <ol>
                            <li className={`${styles.tab} ${styles.active}`}>
                                Overview
                            </li>
                            <li className={styles.tab}>Insights</li>
                            <li className={styles.tab}>Guests</li>
                            <li className={styles.tab}>Check-In</li>
                        </ol>
                    </div>
                </div>

                <Glance />

                <div className={styles.buttons}>
                    <Button
                        buttonText="Guest List"
                        buttonColor="#7662FC"
                        icon={<HiUserGroup size={25} color="#7662FC" />}
                    />
                    <Button
                        buttonText="Host List"
                        buttonColor="#C33D7B"
                        icon={<FaWrench size={25} color="#C33D7B" />}
                    />
                    <Button
                        buttonText="Check In"
                        buttonColor="#5B75FB"
                        icon={<BsQrCodeScan size={25} color="#5B75FB" />}
                    />
                </div>
            </div>
        </Theme>
    );
};

export default Overview;
