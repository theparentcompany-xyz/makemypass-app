import Theme from "../../../../../components/Theme/Theme";
import CheckInHeader from "../../components/CheckInHeader/CheckInHeader/CheckInHeader";
import styles from "./ScanQR.module.css";
import { HiOutlineCamera } from "react-icons/hi2";

import { QrScanner } from "@yudiel/react-qr-scanner";
import { useEffect, useState } from "react";
import { getUserInfo } from "../../../../../apis/scan";
import UserInfo from "../../components/UserInfo/UserInfo";
import SecondaryButton from "../../../Overview/components/SecondaryButton/SecondaryButton";

const ScanQR = () => {
    const [showQR, setShowQR] = useState(false);
    const [ticketId, setTicketId] = useState<string>("");
    const [checkIn, setCheckIn] = useState(false);
    const [trigger, setTrigger] = useState(false);

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        district: "",
        organization: "",
    });

    useEffect(() => {
        if (ticketId.length > 0 && trigger) {
            getUserInfo(ticketId, setCheckIn, setUserData);
        }
    }, [trigger]);

    useEffect(() => {
        navigator.permissions
            .query({ name: "camera" as PermissionName })
            .then((permissionObj) => {
                console.log(permissionObj.state);
            })
            .catch((error) => {
                console.log("Got error :", error);
            });
    }, []);

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
                                    setCheckIn(false);
                                    setUserData({
                                        name: "",
                                        email: "",
                                        phone: "",
                                        district: "",
                                        organization: "",
                                    });
                                }}
                                className={styles.camerabox}
                            >
                                <HiOutlineCamera size={35} color="#5B75FB" />
                            </div>

                            <div className={styles.alertTexts}>
                                <p className={styles.alertHeading}>
                                    Click The Icon To Scan QR Code
                                </p>
                                <p className={styles.alertText}>
                                    We need access to your camera to scan QR
                                    codes.
                                </p>
                            </div>
                        </div>

                        <div className={styles.inputContainer}>
                            <p className={styles.inputText}>
                                Or Enter Code Below
                            </p>
                            <input
                                className={styles.input}
                                placeholder="Enter Ticket Code"
                                value={ticketId}
                                onChange={(e) => {
                                    setTicketId(e.target.value);

                                    if (trigger) {
                                        setTrigger(false);
                                        setCheckIn(false);
                                        setUserData({
                                            name: "",
                                            email: "",
                                            phone: "",
                                            district: "",
                                            organization: "",
                                        });
                                    }
                                }}
                            />
                            <SecondaryButton
                                buttonText="Check In"
                                onClick={() => {
                                    setTrigger(true);
                                }}
                            />
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
            </div>
            {ticketId.length > 0 && trigger && userData && (
                <UserInfo
                    ticketId={ticketId}
                    status={checkIn}
                    userData={userData}
                />
            )}
        </Theme>
    );
};

export default ScanQR;
