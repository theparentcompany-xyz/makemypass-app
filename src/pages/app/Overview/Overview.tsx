import Theme from "../../../components/Theme/Theme";
import styles from "./Overview.module.css";
import Glance from "./components/Glance/Glance";
import Header from "./components/Header/Header";

const Overview = () => {
    return (
        <Theme>
            <div className={styles.overViewContainer}>
                <Header />

                <div className={styles.tabsContainer}>
                    <div className={styles.tabs}>
                        <ol>
                            <li className={`${styles.tab} ${styles.active}`}>
                                Overview
                            </li>
                            <li className={styles.tab}>Insights</li>
                            <li className={styles.tab}>Guests</li>
                            <li className={styles.tab}>Check-In</li>
                        </ol>
                    </div>
                </div>

                <Glance />
            </div>
        </Theme>
    );
};

export default Overview;
