import { useEffect, useState } from "react";
import styles from "./Glance.module.css";
import { connectPrivateSocket } from "../../../../../../services/apiGateway";
import { makeMyPassSocket } from "../../../../../../services/urls";
import { useSearchParams } from "react-router-dom";
const Glance = () => {
    type progressDataType = {
        type: string;
        color: string | undefined;
        value: number;
    }[];

    const [socket, setSocket] = useState<WebSocket | null>(null);

    const [progressData, setprogressData] = useState<progressDataType>([]);
    const [totalGuests, setTotalGuests] = useState<number>(0);
    const [targetGuests, setTargetGuests] = useState<number>(0);

    useEffect(() => {
        return () => {
            socket?.close();
        };
    }, []);


    const [searchParams] = useSearchParams();
    const eventId = searchParams.get("eventId") || "";

    useEffect(() => {
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
    }, []);

    return (
        <>
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
        </>
    );
};

export default Glance;
