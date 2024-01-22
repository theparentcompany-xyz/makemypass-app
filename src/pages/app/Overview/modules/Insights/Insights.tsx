import styles from "./Insights.module.css";

const Insights = () => {
    return (
        <>
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
                                    <p className={styles.categoryName}>
                                        Students
                                    </p>
                                    <p className={styles.categoryCount}>100</p>
                                </div>
                                <div className={styles.category}>
                                    <p className={styles.categoryName}>
                                        Startups
                                    </p>
                                    <p className={styles.categoryCount}>100</p>
                                </div>
                                <div className={styles.category}>
                                    <p className={styles.categoryName}>SME</p>
                                    <p className={styles.categoryCount}>100</p>
                                </div>
                                <div className={styles.category}>
                                    <p className={styles.categoryName}>
                                        Investors
                                    </p>
                                    <p className={styles.categoryCount}>100</p>
                                </div>
                                <div className={styles.category}>
                                    <p className={styles.categoryName}>SME</p>
                                    <p className={styles.categoryCount}>100</p>
                                </div>
                                <div className={styles.category}>
                                    <p className={styles.categoryName}>
                                        Investors
                                    </p>
                                    <p className={styles.categoryCount}>100</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.todayRegistered}>
                    <div className={styles.totalRegistered}>
                        <p className={styles.total}>Today Registered</p>
                        <p className={styles.count}>
                            10,002 <span>guests</span>
                        </p>
                    </div>

                    <div className={styles.weeklyCounts}>
                        <div className={styles.weeklyCount}>
                            <p className={styles.week}>Students</p>
                            <p className={styles.wcount}>300</p>
                        </div>
                        <div className={styles.weeklyCount}>
                            <p className={styles.week}>Startups</p>
                            <p className={styles.wcount}>1400</p>
                        </div>
                        <div className={styles.weeklyCount}>
                            <p className={styles.week}>SME</p>
                            <p className={styles.wcount}>300</p>
                        </div>
                        <div className={styles.weeklyCount}>
                            <p className={styles.week}>Investor</p>
                            <p className={styles.wcount}>1400</p>
                        </div>
                        <div className={styles.weeklyCount}>
                            <p className={styles.week}>NRI</p>
                            <p className={styles.wcount}>300</p>
                        </div>
                        <div className={styles.weeklyCount}>
                            <p className={styles.week}>Professional</p>
                            <p className={styles.wcount}>1400</p>
                        </div>
                    </div>

                    <div className={styles.liveTraffic}>
                        <p className={styles.live}>Date</p>
                        <p className={styles.lcount}>Thu 18th Jan, 2024</p>
                    </div>
                </div>
            </div>

            <div className={styles.insightsContainer}>
                <div className={styles.pieContainer}>
                    <div className={styles.pieSection}>
                        Pie Chart Comes Here
                    </div>
                    <div className={styles.timeSection}>
                        <p className={styles.rightSectionHeading}>
                            Active Time
                        </p>
                        <div className={styles.times}>
                            <div className={styles.time}>
                                <hr
                                    style={{
                                        backgroundColor: "#FBD85B",
                                    }}
                                    className={styles.line}
                                />
                                <p className="type">Morning</p>
                            </div>
                            <div className={styles.time}>
                                <hr
                                    style={{
                                        backgroundColor: "#35A1EB",
                                    }}
                                    className={styles.line}
                                />
                                <p className="type">Evening</p>
                            </div>
                            <div className={styles.time}>
                                <hr
                                    style={{
                                        backgroundColor: "#C33D7B",
                                    }}
                                    className={styles.line}
                                />
                                <p className="type">Night</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        borderRadius: "12px",
                    }}
                    className={styles.registrationCount}
                >
                    <div className={styles.countSection}>
                        <div className={styles.cLeftSection}>
                            <div className={styles.totalRegistered}>
                                <p className={styles.total}>Page Visits</p>
                                <p className={styles.count}>
                                    20,002 <span>Visits</span>
                                </p>
                            </div>
                            <div className={styles.weeklyCounts}>
                                <div className={styles.weeklyCount}>
                                    <p className={styles.week}>Yesterday</p>
                                    <p className={styles.wcount}>300</p>
                                </div>
                                <div className={styles.weeklyCount}>
                                    <p className={styles.week}>This week</p>
                                    <p className={styles.wcount}>1400</p>
                                </div>
                            </div>
                            <div className={styles.liveTraffic}>
                                <p className={styles.live}>
                                    Conversion Rate Vs Page Visit
                                </p>
                                <p className={styles.lcount}>_</p>
                            </div>
                        </div>
                        <div className={styles.cRightSection}>
                            <p className={styles.rightSectionHeading}>
                                Registration Cities
                            </p>

                            <div className={styles.categories}>
                                <div className={styles.category}>
                                    <p className={styles.categoryName}>Pune</p>
                                    <p className={styles.categoryCount}>100</p>
                                </div>
                                <div className={styles.category}>
                                    <p className={styles.categoryName}>Dubai</p>
                                    <p className={styles.categoryCount}>100</p>
                                </div>
                                <div className={styles.category}>
                                    <p className={styles.categoryName}>
                                        Kerala
                                    </p>
                                    <p className={styles.categoryCount}>100</p>
                                </div>
                                <div className={styles.category}>
                                    <p className={styles.categoryName}>
                                        Tamil Nadu
                                    </p>
                                    <p className={styles.categoryCount}>100</p>
                                </div>
                                <div className={styles.category}>
                                    <p className={styles.categoryName}>
                                        Karnataka
                                    </p>
                                    <p className={styles.categoryCount}>100</p>
                                </div>
                                <div className={styles.category}>
                                    <p className={styles.categoryName}>
                                        Mumbai
                                    </p>
                                    <p className={styles.categoryCount}>100</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Insights;
