import styles from "./Footer.module.css";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <>
            <footer>
                <div className={styles.footerContainer}>
                    <hr />
                    <div className="row">
                        <img
                            className={styles.tpclogo}
                            src="/app/tpc.png"
                            alt=""
                        />
                        <div className={styles.socialIcons}>
                            <FaInstagram color="a4a4a4" size={20} />
                            <FaXTwitter color="a4a4a4" size={20} />
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
