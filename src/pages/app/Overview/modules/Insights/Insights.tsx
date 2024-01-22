import styles from "./Insights.module.css";

const Insights = () => {
    return (
        <div className={styles.insightsContainer}>
            <div className={styles.registrationCount}>
                <div className={styles.countSection}>
                    <div className={styles.cLeftSection}>
                        <div className={styles.totalRegistered}>
                            <p className={styles.total}>Total Registered</p>
                            <p className={styles.count}>
                                20,002 <span>guests</span>
                            </p>
                        </div>
                        <div className={styles.weeklyCounts}>
                            <div className={styles.weeklyCount}>
                                <p className={styles.week}>Yestered</p>
                                <p className={styles.wcount}>300</p>
                            </div>
                            <div className={styles.weeklyCount}>
                                <p className={styles.week}>This week</p>
                                <p className={styles.wcount}>1400</p>
                            </div>
                        </div>
                        <div className={styles.liveTraffic}>
                            <p className={styles.live}>Live Traffic</p>
                            <p className={styles.lcount}>_</p>
                        </div>
                    </div>
                    <div className={styles.cRightSection}>
                        <p className={styles.rightSectionHeading}>
                            Total Category Reg Count
                        </p>

                        <div className={styles.categories}>
                            <div className={styles.category}>
                                <p className={styles.categoryName}>Students</p>
                                <p className={styles.categoryCount}>100</p>
                            </div>
                            <div className={styles.category}>
                                <p className={styles.categoryName}>Startups</p>
                                <p className={styles.categoryCount}>100</p>
                            </div>
                            <div className={styles.category}>
                                <p className={styles.categoryName}>SME</p>
                                <p className={styles.categoryCount}>100</p>
                            </div>
                            <div className={styles.category}>
                                <p className={styles.categoryName}>Investors</p>
                                <p className={styles.categoryCount}>100</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Insights;
