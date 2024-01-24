import Theme from "../../../../../components/Theme/Theme";
import CheckInHeader from "../../components/CheckInHeader/CheckInHeader/CheckInHeader";
import styles from "./ScanQR.module.css";
import { HiOutlineCamera } from "react-icons/hi2";

const ScanQR = () => {
    return (
        <Theme>
            <div className={styles.scanContainer}>
                <CheckInHeader buttonType="back" />

                <hr className={styles.line} />
            </div>

            <div className={styles.scannerContainer}>
                <p className={styles.scanHeader}>Scan QR Code Below</p>

                <div className={styles.scanner}>
                    <div className={styles.cameraAlert}>
                        <div className={styles.camerabox}>
                            <HiOutlineCamera size={35} color="#5B75FB" />
                        </div>

                        <div className={styles.alertTexts}>
                            <p className={styles.alertHeading}>
                                Please Enable Camera Access
                            </p>
                            <p className={styles.alertText}>
                                We need access to your camera to scan QR codes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Theme>
    );
};

export default ScanQR;
