import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import styles from "./Theme.module.css";

const Theme = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className={styles.themeContainer}>
                <div className={styles.grad1}></div>
                <div className={styles.grad2}></div>
                <div className={styles.grad3}></div>
                <Header />
                <div className={styles.childrenContainer}>{children}</div>
                <Footer />
            </div>
        </>
    );
};

export default Theme;
