import { useEffect, useState } from "react";
import styles from "./Glance.module.css";
import { connectPrivateSocket } from "../../../../../../services/apiGateway";
import { makeMyPassSocket } from "../../../../../../services/urls";
import { useParams, useNavigate } from "react-router-dom";
import { getEventId } from "../../../../../apis/events";

const Glance = (tab: any) => {
    type progressDataType = {
        type: string;
        color: string | undefined;
        value: number;
    }[];

    const navigate = useNavigate();

    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [progressData, setprogressData] = useState<progressDataType>([]);
    const [totalGuests, setTotalGuests] = useState<number>(0);
    const [targetGuests, setTargetGuests] = useState<number>(0);

    useEffect(() => {
        return () => {
            socket?.close();
        };
    }, []);

    const [currentTab, setCurrentTab] = useState("overview");

    const updateTab = (tab: string) => {
        setCurrentTab(tab);
        navigate(`/${eventTitle}/${tab}/`);
    };

    const [eventId, setEventId] = useState<string>("");
    const { eventTitle } = useParams<{ eventTitle: string }>();

    useEffect(() => {
        const eventData = JSON.parse(
            localStorage.getItem("eventData") as string
        );

        setEventId(eventData?.event_id);

        if (!eventData)
            setTimeout(() => {
                getLocalEventId();
            }, 2000);
    }, []);

    const getLocalEventId = () => {
        const eventData = JSON.parse(
            localStorage.getItem("eventData") as string
        );

        if (eventData) {
            if (eventData.event_name !== eventTitle) {
                localStorage.removeItem("eventData");
                getEventId(eventTitle ?? "");
            } else {
                setEventId(eventData.event_id);
            }
        }
    };


    useEffect(() => {
        setCurrentTab(tab.tab);
        if (eventId)
            connectPrivateSocket({
                url: makeMyPassSocket.registerCounts(eventId),
            }).then((ws) => {
                ws.onmessage = (event) => {
                    const category = JSON.parse(event.data).response.category;

                    setTotalGuests(
                        Number(JSON.parse(event.data).response.total_reg)
                    );
                    setTargetGuests(
                        Number(JSON.parse(event.data).response.target_reg)
                    );

                    const newStrucure: progressDataType = [];
                    let colors = [
                        "#47C97E",
                        "#7662FC",
                        "#C33D7B",
                        "#FBD85B",
                        "#5B75FB",
                        "#D2D4D7",
                    ];

                    for (const [key, value] of Object.entries(category)) {
                        newStrucure.push({
                            type: key,
                            color: colors.pop(),
                            value: Number(value),
                        });
                    }

                    setprogressData(newStrucure);
                };

                setSocket(ws);
            });
    }, [eventId]);

    return (
        <>
            <div className={styles.tabsContainer}>
                <div className={styles.tabs}>
                    <ol>
                        <li
                            className={`${styles.tab} ${
                                currentTab === "overview" ? styles.active : ""
                            }`}
                            onClick={() => updateTab("overview")}
                        >
                            Overview
                        </li>
                        <li
                            className={`${styles.tab} ${
                                currentTab === "insights" ? styles.active : ""
                            }`}
                            onClick={() => updateTab("insights")}
                        >
                            Insights
                        </li>
                        <li
                            className={`${styles.tab} ${
                                currentTab === "guests" ? styles.active : ""
                            }`}
                            onClick={() => updateTab("guests")}
                        >
                            Guests
                        </li>
                        <li
                            className={`${styles.tab} ${
                                currentTab === "checkins" ? styles.active : ""
                            }`}
                            onClick={() => updateTab("checkins")}
                        >
                            Check-In
                        </li>
                    </ol>
                </div>
            </div>
            {currentTab && currentTab != "insights" && (
                <div className={styles.glanceContainer}>
                    <p className={styles.glanceHeader}>At a Glance</p>

                    {totalGuests > 0 && (
                        <p className={styles.guests}>
                            {totalGuests}/{targetGuests} <span>guests</span>
                        </p>
                    )}

                    <div className={styles.progresBarGraph}>
                        {progressData.map((data) => (
                            <>
                                <div
                                    key={data.type}
                                    className={styles.progressBar}
                                    style={{
                                        backgroundColor: data.color,
                                        width: `${data.value / 10}%`,
                                    }}
                                ></div>
                            </>
                        ))}
                    </div>

                    <div className={styles.progressLabels}>
                        <ul>
                            {progressData.map((data) => (
                                <>
                                    <li
                                        key={data.type}
                                        className={styles.progressLabel}
                                        style={{
                                            color: data.color,
                                        }}
                                    >
                                        <p className={styles.dataCount}>
                                            • {data.value} {data.type}
                                        </p>
                                    </li>
                                </>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default Glance;
