import Theme from "../../../../../components/Theme/Theme";
import styles from "./UserInfo.module.css";

const UserInfo = ({
    ticketId,
    status,
}: {
    ticketId: string;
    status: boolean;
}) => {
    return (
        <div className={styles.userInfoContainer}>
            <div className={styles.userInfo}>
                <div className={styles.topSection}>
                    <div className={styles.type}>Student</div>
                    <p className={styles.name}>Muhammed Jezwan</p>
                    <p className={styles.email}>jezwan@gmaill.com</p>
                </div>
                <hr className={styles.line} />
                <div className={styles.infoBody}>
                    <div className={styles.dataBox}>
                        <p className={styles.label}>Ticket ID</p>
                        <p className={styles.value}>{ticketId}</p>
                    </div>
                    <div className={styles.dataBox}>
                        <p className={styles.label}>District</p>
                        <p className={styles.value}>Thiruvanathapuram</p>
                    </div>
                    <div className={styles.dataBox}>
                        <p className={styles.label}>Organization</p>
                        <p className={styles.value}>Pygrammers</p>
                    </div>
                    <div className={styles.dataBox}>
                        <p className={styles.label}>Phone Number</p>
                        <p className={styles.value}>9074750272</p>
                    </div>
                </div>
                <p
                    className={styles.scannerHeader}
                    style={{
                        color: status ? "#5B75FB" : "#ed4545",
                    }}
                >
                    {status
                        ? " User Check-In Successfull!"
                        : "User Check-In Failed!"}
                </p>
            </div>
        </div>
    );
};

export default UserInfo;
