import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import styles from "./Theme.module.css";

const Theme = ({
    type,
    children,
}: {
    type?: string | undefined;
    children: React.ReactNode;
}) => {
    return (
        <>
            <div className={styles.themeContainer}>
                <div className={styles.grad1}></div>
                <div className={styles.grad2}></div>
                <div className={styles.grad3}></div>
                <Header type={type} />
                <div className={styles.childrenContainer}>
                    {children}
                    <div className={styles.tc}>
                        <Link to="/termsandconditions">
                            <p className={styles.terms}>
                                Checkout our Terms & Conditions
                            </p>
                        </Link>
                        <Link to="/privacypolicy">
                            <p className={styles.privacy}>and Privacy Policy</p>
                        </Link>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
};

export default Theme;
