import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import { getEventData, getEventId } from "../../../../../apis/events";
import { useParams } from "react-router-dom";

const Header = ({
    setRole,
}: {
    setRole?: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const [eventData, setEventData] = useState({
        title: "",
        date: "",
        role: "",
    });
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
        if (eventId) getEventData(eventId, setEventData);
    }, [eventId]);

    useEffect(() => {
        if (setRole) setRole(eventData.role);
    }, [eventData]);

    return (
        <>
            <div className={styles.headerRow}>
                <p className={styles.headerText}>
                    <img
                        className={styles.headerImage}
                        src="/scale.webp"
                        alt=""
                    />
                    {eventData?.title}
                </p>
                <div className="row">
                    <p className={styles.date}>{eventData?.date}</p>
                    <img src="/live.gif" alt="" className={styles.gif} />
                </div>
            </div>
            <hr className={styles.line} />
        </>
    );
};

export default Header;
