import Theme from "../../../../../components/Theme/Theme";
import Header from "../../../Overview/components/Header/Header";
import styles from "./CheckIn.module.css";
import { RiSearchLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { guests } from "./types";
import CheckInHeader from "../../components/CheckInHeader/CheckInHeader/CheckInHeader";
import { useParams } from "react-router-dom";
import { getEventId } from "../../../../../apis/events";
import { connectPrivateSocket } from "../../../../../../services/apiGateway";
import { makeMyPassSocket } from "../../../../../../services/urls";

const CheckIn = () => {
    const [recentRegistrations, setRecentRegistrations] = useState<guests[]>(
        []
    );
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [eventId, setEventId] = useState<string>("");
    const { eventTitle } = useParams<{ eventTitle: string }>();

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
        const eventData = JSON.parse(
            localStorage.getItem("eventData") as string
        );

        setEventId(eventData?.event_id);

        if (!eventData)
            setTimeout(() => {
                getLocalEventId();
            }, 2000);
    }, []);

    useEffect(() => {
        if (eventId)
            connectPrivateSocket({
                url: makeMyPassSocket.listCheckinGuests(eventId),
            }).then((ws) => {
                ws.onmessage = (event) => {
                    if (JSON.parse(event.data).response.guests)
                        setRecentRegistrations(
                            JSON.parse(event.data).response.guests
                        );
                    else if (JSON.parse(event.data).response.data) {
                        const newRegistration = JSON.parse(event.data).response
                            .data;

                        setRecentRegistrations((prev) => {
                            const updatedRegistrations = [
                                newRegistration,
                                ...prev,
                            ];
                            updatedRegistrations.pop();
                            return updatedRegistrations;
                        });
                    }
                };

                setSocket(ws);
            });
    }, [eventId]);

    useEffect(() => {
        return () => {
            socket?.close();
        };
    }, []);

    return (
        <Theme>
            <div className={styles.checkInContainer}>
                <Header />

                <CheckInHeader />

                <div className={styles.searchInput}>
                    <RiSearchLine color="#5F6063" />
                    <input
                        onChange={(event) => {
                            setSearchKeyword(event.target.value);
                        }}
                        placeholder="Search"
                        type="text"
                    />
                </div>

                <div className={styles.tableContainer}>
                    <div className={styles.table}>
                        {recentRegistrations &&
                        recentRegistrations.length > 0 ? (
                            recentRegistrations
                                .filter((data) => {
                                    const { name, email } = data;
                                    const keyword = searchKeyword.toLowerCase();
                                    return (
                                        name.toLowerCase().includes(keyword) ||
                                        email.toLowerCase().includes(keyword)
                                    );
                                })
                                .map((data, index) => {
                                    return (
                                        <div key={index} className={styles.row}>
                                            <div className={styles.rowData}>
                                                <p className={styles.rowName}>
                                                    {data.name}
                                                </p>
                                                <p className={styles.rowEmail}>
                                                    {data.email}
                                                </p>
                                            </div>
                                            <div className={styles.rowData}>
                                                <p className={styles.rowType}>
                                                    {data.category}
                                                </p>
                                                <p className={styles.rowDate}>
                                                    {data.registered_at}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                        ) : (
                            <div className={styles.row}>
                                <div className={styles.rowData}>
                                    <p className={styles.rowName}>
                                        No CheckIns Yet!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Theme>
    );
};

export default CheckIn;
