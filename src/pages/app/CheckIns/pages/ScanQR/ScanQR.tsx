import Theme from "../../../../../components/Theme/Theme";
import CheckInHeader from "../../components/CheckInHeader/CheckInHeader/CheckInHeader";
import styles from "./ScanQR.module.css";
import { HiOutlineCamera } from "react-icons/hi2";

import { QrScanner } from "@yudiel/react-qr-scanner";
import { useEffect, useState } from "react";
import { userInfo } from "../../../../../apis/scan";

const ScanQR = () => {
    const [showQR, setShowQR] = useState(false);
    const [ticketId, setTicketId] = useState<string>("");

    const [checkIn, setCheckIn] = useState(false);

    useEffect(() => {
        if (ticketId.length > 0) {
            userInfo(ticketId, setCheckIn);
        }
    }, [ticketId]);

    return (
        <Theme>
            <div className={styles.scanContainer}>
                <CheckInHeader buttonType="back" />

                <hr className={styles.line} />
            </div>

            <div className={styles.scannerContainer}>
                <p className={styles.scanHeader}>Scan QR Code Below</p>

                {!showQR ? (
                    <div className={styles.scannerr}>
                        <div className={styles.cameraAlert}>
                            <div
                                onClick={() => {
                                    setShowQR(true);
                                    setTicketId("");
                                }}
                                className={styles.camerabox}
                            >
                                <HiOutlineCamera size={35} color="#5B75FB" />
                            </div>

                            <div className={styles.alertTexts}>
                                <p className={styles.alertHeading}>
                                    Click The Icon & Please Enable Camera Access
                                </p>
                                <p className={styles.alertText}>
                                    We need access to your camera to scan QR
                                    codes.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.scannerOuterContainer}>
                        <div className={styles.scanner}>
                            <QrScanner
                                containerStyle={{
                                    backgroundColor: "#000",
                                }}
                                onResult={(result) => {
                                    setTicketId(result.getText());
                                    setShowQR(false);
                                }}
                                onError={(error) => {
                                    console.log(error);
                                }}
                            />
                        </div>
                    </div>
                )}
                {ticketId.length > 0 && (
                    <div className={styles.sucessContainer}>
                        <div className={styles.scannerSuccess}>
                            <p
                                className={styles.scannerHeader}
                                style={{
                                    color: checkIn ? "#5B75FB" : "#ed4545",
                                }}
                            >
                                {checkIn
                                    ? " User Scanning Successfull!"
                                    : "User Scanning Failed!"}
                            </p>
                            <p className={styles.userIdText}>
                                User ID: {ticketId}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Theme>
    );
};

export default ScanQR;
