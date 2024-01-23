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
import { useEffect, useState } from "react";
import { connectPrivateSocket } from "../../../../../../services/apiGateway";
import AnalyticsData from "./types";

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
    const [message, setMessage] = useState<AnalyticsData>();

    const [lineData, setLineData] = useState<any>();
    const [barData, setBarData] = useState<any>();
    const [pieData, setPieData] = useState<any>();

    const [socket, setSocket] = useState<WebSocket | null>(null);

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

    useEffect(() => {
        return () => {
            socket?.close();
        };
    }, []);

    useEffect(() => {
        const wsUrl = `wss://dev-buildnship.in/makemypass/manage-event/d1929bdb-c891-4850-8c41-4097ae2c6c7f/analytics/`;

        connectPrivateSocket({ url: wsUrl }).then((ws) => {
            ws.onmessage = (event) => {
                const lineBarData = JSON.parse(event.data).response;
                setMessage(lineBarData);
                setLineData({
                    labels: Object.keys(lineBarData?.analytics || {}),
                    datasets: [
                        {
                            label: "Dataset 1",
                            data: Object.values(lineBarData?.analytics || {}),
                            borderColor: "rgb(255, 99, 132)",
                            backgroundColor: "rgba(255, 99, 132, 0.5)",
                        },
                    ],
                });

                setBarData({
                    labels: Object.keys(lineBarData?.today_category || {}),
                    datasets: [
                        {
                            label: "Dataset 1",
                            data: Object.values(
                                lineBarData?.today_category || {}
                            ),
                            borderColor: "rgb(255, 99, 132)",
                            backgroundColor: "rgba(255, 99, 132, 0.5)",
                        },
                    ],
                });

                setPieData({
                    labels: Object.keys(lineBarData.active_timeframe),
                    datasets: [
                        {
                            label: "# of Votes",
                            data: Object.values(lineBarData.active_timeframe),
                            backgroundColor: [
                                "#FBD85B",
                                "#C33D7B",
                                "#47C97E",
                                "#35A1EB",
                            ],
                        },
                    ],
                });
            };

            setSocket(ws);
        });
    }, []);

    return (
        <>
            <div className={styles.insightsContainer}>
                <div className={styles.registrationCount}>
                    <div className={styles.graphContainer}>
                        {lineData && <Line options={options} data={lineData} />}
                    </div>
                    <div className={styles.countSection}>
                        <div className={styles.cLeftSection}>
                            <div className={styles.totalRegistered}>
                                <p className={styles.total}>Total Registered</p>
                                <p className={styles.count}>
                                    {message?.total_reg} <span>guests</span>
                                </p>
                            </div>
                            <div className={styles.weeklyCounts}>
                                <div className={styles.weeklyCount}>
                                    <p className={styles.week}>Yestered</p>
                                    <p className={styles.wcount}>
                                        {message?.yesterday_reg}
                                    </p>
                                </div>
                                <div className={styles.weeklyCount}>
                                    <p className={styles.week}>This week</p>
                                    <p className={styles.wcount}>
                                        {message?.week_count}
                                    </p>
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
                                {Object.entries(
                                    message?.category_percentages || {}
                                ).map(([key, value]) => (
                                    <div className={styles.category}>
                                        <p className={styles.categoryName}>
                                            {key}
                                        </p>
                                        <p className={styles.categoryCount}>
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.todayRegistered}>
                    <div className={styles.graphContainer}>
                        {barData && <Bar options={options} data={barData} />}
                    </div>
                    <div className={styles.totalRegistered}>
                        <p className={styles.total}>Today Registered</p>
                        <p className={styles.count}>
                            {message?.today_reg} <span>guests</span>
                        </p>
                    </div>
                    <div className={styles.weeklyCounts}>
                        {Object.entries(message?.today_category || {}).map(
                            ([key, value]) => (
                                <div className={styles.weeklyCount}>
                                    <p className={styles.week}>
                                        {key.substring(0, 8)}..
                                    </p>
                                    <p className={styles.wcount}>{value}</p>
                                </div>
                            )
                        )}
                    </div>
                    <div className={styles.liveTraffic}>
                        <p className={styles.live}>Event Date</p>
                        <p className={styles.lcount}>{message?.event_date}</p>
                    </div>
                </div>
            </div>

            <div className={styles.insightsContainer}>
                <div className={styles.pieContainer}>
                    <div className={styles.pieSection}>
                        {pieData && (
                            <Doughnut
                                data={pieData}
                                options={{
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                }}
                            />
                        )}
                    </div>
                    <div className={styles.timeSection}>
                        <p className={styles.rightSectionHeading}>
                            Active Time
                        </p>
                        <div className={styles.times}>
                            <div className={styles.time}>
                                <p
                                    style={{
                                        color: "#FBD85B",
                                    }}
                                    className={styles.line}
                                >
                                    {message?.active_timeframe.Morning}
                                </p>
                                <p className="type">Morning</p>
                            </div>
                            <div className={styles.time}>
                                <p
                                    style={{
                                        color: "#35A1EB",
                                    }}
                                    className={styles.line}
                                >
                                    {message?.active_timeframe.Evening}
                                </p>
                                <p className="type">Evening</p>
                            </div>
                            <div className={styles.time}>
                                <p
                                    style={{
                                        color: "#47C97E",
                                    }}
                                    className={styles.line}
                                >
                                    {message?.active_timeframe.Afternoon}
                                </p>
                                <p className="type">Afternoon</p>
                            </div>
                            <div className={styles.time}>
                                <p
                                    style={{
                                        color: "#C33D7B",
                                    }}
                                    className={styles.line}
                                >
                                    {message?.active_timeframe.Night}
                                </p>
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
                                    {message?.page_visit.total
                                        ? message?.page_visit.total
                                        : "-"}{" "}
                                    <span>Visits</span>
                                </p>
                            </div>
                            <div className={styles.weeklyCounts}>
                                <div className={styles.weeklyCount}>
                                    <p className={styles.week}>Yesterday</p>
                                    <p className={styles.wcount}>
                                        {" "}
                                        {message?.page_visit.yesterday
                                            ? message?.page_visit.yesterday
                                            : "-"}{" "}
                                    </p>
                                </div>
                                <div className={styles.weeklyCount}>
                                    <p className={styles.week}>This week</p>
                                    <p className={styles.wcount}>
                                        {" "}
                                        {message?.page_visit.this_week
                                            ? message?.page_visit.this_week
                                            : "-"}{" "}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.liveTraffic}>
                                <p className={styles.live}>
                                    Conversion Rate Vs Page Visit
                                </p>
                                <p className={styles.lcount}>
                                    {" "}
                                    {message?.page_visit
                                        .conversion_rate_vs_page_visit
                                        ? message?.page_visit
                                              .conversion_rate_vs_page_visit
                                        : "-"}{" "}
                                </p>
                            </div>
                        </div>
                        <div className={styles.cRightSection}>
                            <p className={styles.rightSectionHeading}>
                                Registration Cities
                            </p>

                            <div className={styles.categories}>
                                {Object.entries(
                                    message?.district_percentages || {}
                                ).map(([key, value]) => (
                                    <div className={styles.category}>
                                        <p className={styles.categoryName}>
                                            {key}
                                        </p>
                                        <p className={styles.categoryCount}>
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Insights;
