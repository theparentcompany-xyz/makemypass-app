import Theme from "../../../components/Theme/Theme";
import styles from "./AdminStats.module.css";
import Header from "./components/Header/Header";

import { useState } from "react";
import Overview from "./modules/Overview/Overview";

const AdminStats = () => {
    const [currentTab, setCurrentTab] = useState("overview");

    const updateTab = (tab: string) => {
        setCurrentTab(tab);
    };

    const componentToRender = () => {
        switch (currentTab) {
            case "overview":
                return <Overview />;
            case "insights":
                return <div>Insights</div>;
            default:
                return <div>Overview</div>;
        }
    };

    return (
        <Theme>
            <div className={styles.centerContainer}>
                <div className={styles.overViewContainer}>
                    <Header />

                    <div className={styles.tabsContainer}>
                        <div className={styles.tabs}>
                            <ol>
                                <li
                                    className={`${styles.tab} ${
                                        currentTab === "overview"
                                            ? styles.active
                                            : ""
                                    }`}
                                    onClick={() => updateTab("overview")}
                                >
                                    Overview
                                </li>
                                <li
                                    className={`${styles.tab} ${
                                        currentTab === "insights"
                                            ? styles.active
                                            : ""
                                    }`}
                                    onClick={() => updateTab("insights")}
                                >
                                    Insights
                                </li>
                                <li
                                    className={`${styles.tab} ${
                                        currentTab === "guests"
                                            ? styles.active
                                            : ""
                                    }`}
                                    onClick={() => updateTab("guests")}
                                >
                                    Guests
                                </li>
                                <li
                                    className={`${styles.tab} ${
                                        currentTab === "checkins"
                                            ? styles.active
                                            : ""
                                    }`}
                                    onClick={() => updateTab("checkins")}
                                >
                                    Check-In
                                </li>
                            </ol>
                        </div>
                    </div>

                    {componentToRender()}
                </div>
            </div>
        </Theme>
    );
};

export default AdminStats;
