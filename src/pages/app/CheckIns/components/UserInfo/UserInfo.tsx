import styles from "./UserInfo.module.css";

const UserInfo = ({
    ticketId,
    status,
    userData,
    setTrigger,
}: {
    ticketId: string;
    status: boolean;
    userData: {
        category: string;
        name: string;
        email: string;
        phone: string;
        district: string;
        organization: string;
    };
    setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    return (
        <div className={styles.userInfoContainer}>
            <button
                onClick={() => {
                    setTrigger(false);
                }}
                className={styles.backButton}
            >
                Close
            </button>
            <br />
            <div className={styles.userInfo}>
                <div className={styles.topSection}>
                    {userData.category && (
                        <div className={styles.type}>{userData.category}</div>
                    )}
                    <p className={styles.name}>{userData.name}</p>
                    <p className={styles.email}>{userData.email}</p>
                </div>
                <hr className={styles.line} />
                <div className={styles.infoBody}>
                    <div className={styles.dataBox}>
                        <p className={styles.label}>Ticket ID</p>
                        <p className={styles.value}>{ticketId}</p>
                    </div>
                    {userData.district && (
                        <div className={styles.dataBox}>
                            <p className={styles.label}>District</p>
                            <p className={styles.value}>{userData.district}</p>
                        </div>
                    )}
                    {userData.organization && (
                        <div className={styles.dataBox}>
                            <p className={styles.label}>Organization</p>
                            <p className={styles.value}>
                                {userData.organization}
                            </p>
                        </div>
                    )}
                    {userData.phone && (
                        <div className={styles.dataBox}>
                            <p className={styles.label}>Phone Number</p>
                            <p className={styles.value}>{userData.phone}</p>
                        </div>
                    )}
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
