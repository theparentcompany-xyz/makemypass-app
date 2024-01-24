import { useNavigate } from "react-router-dom";
import styles from "./CheckInHeader.module.css";
import { BsQrCodeScan } from "react-icons/bs";

import SectionButton from "../../../../../../components/SectionButton/SectionButton";

const CheckInHeader = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className={styles.checkInHeader}>
                <button
                    onClick={() => {
                        navigate(-1);
                    }}
                    className={styles.backButton}
                >
                    {"<"}
                </button>
                <p className={styles.checkInHeading}>Check In</p>
            </div>
            <hr className={styles.line} />
            <div className={styles.checkInActions}>
                <SectionButton
                    buttonText="Scan QR Code"
                    buttonColor="#C33D7B"
                    icon={<BsQrCodeScan size={25} color="#5B75FB" />}
                />

                <div className={styles.checkInGlance}>
                    <p className={styles.checkInGlanceHeader}>
                        Check In at a Glance
                    </p>
                    <p className={styles.guests}>
                        0 <span>Guests</span>
                    </p>
                </div>
            </div>
        </>
    );
};

export default CheckInHeader;
