import { HiUserGroup } from "react-icons/hi2";
import { FaWrench } from "react-icons/fa";
import { BsQrCodeScan } from "react-icons/bs";
import { TbPencil } from "react-icons/tb";
import Glance from "../components/Glance/Glance";

import styles from "./Overview.module.css";
import SecondaryButton from "../components/SecondaryButton/SecondaryButton";
import SectionButton from "../components/SectionButton/SectionButton";
import { useEffect, useState } from "react";

import { hostList, recentRegistration } from "./types";

import { HashLoader } from "react-spinners";
import { getHosts } from "../../../../apis/overview";
import { connectPrivateSocket } from "../../../../../services/apiGateway";
import { makeMyPassSocket } from "../../../../../services/urls";
import Theme from "../../../../components/Theme/Theme";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header/Header";
import { getEventId } from "../../../../apis/events";

const Overview = () => {
    const [recentRegistrations, setRecentRegistrations] = useState<
        recentRegistration[]
    >([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [hostList, setHostList] = useState<hostList[]>([]);

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
        if (eventId) getHosts(eventId, setHostList);
        console.log(hostList);
    }, [eventId]);

    useEffect(() => {
        return () => {
            socket?.close();
        };
    }, []);

    useEffect(() => {
        if (eventId)
            connectPrivateSocket({
                url: makeMyPassSocket.recentRegistrations(eventId),
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

    return (
        <Theme>
            <>
                {recentRegistrations &&
                recentRegistrations.length > 0 &&
                hostList ? (
                    <div className={styles.overviewContainer}>
                        <Header />
                        <Glance tab="overview" />

                        <div className={styles.buttons}>
                            <Link to="/scaleup/guests">
                                <SectionButton
                                    buttonText="Guest List"
                                    buttonColor="#7662FC"
                                    icon={
                                        <HiUserGroup
                                            size={25}
                                            color="#7662FC"
                                        />
                                    }
                                />
                            </Link>

                            <a href="#hosts">
                                <SectionButton
                                    buttonText="Host List"
                                    buttonColor="#C33D7B"
                                    icon={
                                        <FaWrench size={25} color="#C33D7B" />
                                    }
                                />
                            </a>

                            <Link to="/scaleup/checkins">
                                <SectionButton
                                    buttonText="Check In"
                                    buttonColor="#5B75FB"
                                    icon={
                                        <BsQrCodeScan
                                            size={25}
                                            color="#5B75FB"
                                        />
                                    }
                                />
                            </Link>
                        </div>

                        <div className={styles.recentRegistrations}>
                            <div className={styles.tableHeader}>
                                <p className={styles.tableHeading}>
                                    Recent Registration
                                </p>
                                <SecondaryButton buttonText="All Guests ➞" />
                            </div>

                            <div className={styles.tableContainer}>
                                <div className={styles.table}>
                                    {recentRegistrations.map((data, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={styles.row}
                                            >
                                                <div className={styles.rowData}>
                                                    <p
                                                        className={
                                                            styles.rowName
                                                        }
                                                    >
                                                        {data.name}
                                                    </p>
                                                    <p
                                                        className={
                                                            styles.rowEmail
                                                        }
                                                    >
                                                        {data.email}
                                                    </p>
                                                </div>
                                                <div className={styles.rowData}>
                                                    <p
                                                        className={
                                                            styles.rowType
                                                        }
                                                    >
                                                        {data.category}
                                                    </p>
                                                    <p
                                                        className={
                                                            styles.rowDate
                                                        }
                                                    >
                                                        {data.registered_at}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className={styles.recentRegistrations}>
                            <div className={styles.tableHeader}>
                                <p className={styles.tableHeading}>
                                    Hosts <br />
                                    <span>
                                        Add hosts, special guests, and event
                                        managers.
                                    </span>
                                </p>
                                <SecondaryButton buttonText="+ Add Host" />
                            </div>

                            <div id="hosts" className={styles.tableContainer}>
                                <div className={styles.table}>
                                    {hostList &&
                                        hostList.map((data, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className={styles.row}
                                                >
                                                    <div
                                                        className={
                                                            styles.rowData
                                                        }
                                                    >
                                                        <p
                                                            className={
                                                                styles.rowName
                                                            }
                                                        >
                                                            {data.name}
                                                        </p>
                                                        <p
                                                            className={
                                                                styles.rowEmail
                                                            }
                                                        >
                                                            {data.email}
                                                        </p>
                                                        <p
                                                            className={
                                                                styles.rowType
                                                            }
                                                        >
                                                            {data.role}
                                                        </p>
                                                    </div>
                                                    <div
                                                        className={
                                                            styles.rowData
                                                        }
                                                    >
                                                        <TbPencil
                                                            color="#8E8F90"
                                                            size={18}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.center}>
                        <HashLoader color={"#46BF75"} size={50} />
                    </div>
                )}
            </>
        </Theme>
    );
};

export default Overview;
