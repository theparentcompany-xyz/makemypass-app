import styles from "./Insights.module.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
    ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,

    LinearScale,
    BarElement,

    ArcElement
);

const Insights = () => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Chart.js Line Chart",
            },
        },
    };

    const labels = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
    ];

    const data = {
        labels,
        datasets: [
            {
                label: "Dataset 1",
                data: labels.map(() =>
                    faker.datatype.number({ min: -1000, max: 1000 })
                ),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    };

    const pieData = {
        labels: ["Red", "Blue", "Yellow"],
        datasets: [
            {
                label: "# of Votes",
                data: [12, 19, 3],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <>
            <div className={styles.insightsContainer}>
                <div className={styles.registrationCount}>
                    <div className={styles.graphContainer}>
                        <Line options={options} data={data} />
                    </div>
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
                    <div className={styles.graphContainer}>
                        <Bar options={options} data={data} />
                    </div>
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
                        <Doughnut data={pieData} />
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
