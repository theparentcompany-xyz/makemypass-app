import styles from "./Header.module.css";

const Header = () => {
    return (
        <>
            <div className={styles.headerRow}>
                <p className={styles.headerText}>
                    <img
                        className={styles.headerImage}
                        src="/scale.webp"
                        alt=""
                    />
                    Scale Up Conclave 2024
                </p>
                <div className="row">
                    <p className={styles.date}>2-3 Feb 2024</p>
                    <img src="/live.gif" alt="" className={styles.gif} />
                </div>
            </div>
            <hr className={styles.line} />
        </>
    );
};

export default Header;
