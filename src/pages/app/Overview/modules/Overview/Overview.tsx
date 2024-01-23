import { HiUserGroup } from "react-icons/hi2";
import { FaWrench } from "react-icons/fa";
import { BsQrCodeScan } from "react-icons/bs";
import { TbPencil } from "react-icons/tb";
import Glance from "../../components/Glance/Glance";

import styles from "./Overview.module.css";
import SecondaryButton from "../../components/SecondaryButton/SecondaryButton";
import SectionButton from "../../components/SectionButton/SectionButton";
import { useEffect, useState } from "react";
import { connectPrivateSocket } from "../../../../../../services/apiGateway";
import { hostList, recentRegistration } from "./types";
import { getHosts } from "../../../../../apis/overview";
import { makeMyPassSocket } from "../../../../../../services/urls";

import { useSearchParams } from "react-router-dom";

const Overview = () => {
    const [recentRegistrations, setRecentRegistrations] = useState<
        recentRegistration[]
    >([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [hostList, setHostList] = useState<hostList[]>([]);
    const [searchParams] = useSearchParams();
    const eventId = searchParams.get("eventId") || "";
    useEffect(() => {
        getHosts(eventId, setHostList);
        console.log(hostList);
    }, []);

    useEffect(() => {
        return () => {
            socket?.close();
        };
    }, []);

    useEffect(() => {
        connectPrivateSocket({
            url: makeMyPassSocket.recentRegistrations(
                "d1929bdb-c891-4850-8c41-4097ae2c6c7f"
            ),
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
                        const updatedRegistrations = [newRegistration, ...prev];
                        updatedRegistrations.pop();
                        return updatedRegistrations;
                    });
                }
            };

            setSocket(ws);
        });
    }, []);

    return (
        <>
            <Glance />

            <div className={styles.buttons}>
                <SectionButton
                    buttonText="Guest List"
                    buttonColor="#7662FC"
                    icon={<HiUserGroup size={25} color="#7662FC" />}
                />
                <SectionButton
                    buttonText="Host List"
                    buttonColor="#C33D7B"
                    icon={<FaWrench size={25} color="#C33D7B" />}
                />
                <SectionButton
                    buttonText="Check In"
                    buttonColor="#5B75FB"
                    icon={<BsQrCodeScan size={25} color="#5B75FB" />}
                />
            </div>

            {recentRegistrations && (
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
                            })}
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.recentRegistrations}>
                <div className={styles.tableHeader}>
                    <p className={styles.tableHeading}>
                        Hosts <br />
                        <span>
                            Add hosts, special guests, and event managers.
                        </span>
                    </p>
                    <SecondaryButton buttonText="+ Add Host" />
                </div>

                <div className={styles.tableContainer}>
                    <div className={styles.table}>
                        {hostList &&
                            hostList.map((data, index) => {
                                return (
                                    <div key={index} className={styles.row}>
                                        <div className={styles.rowData}>
                                            <p className={styles.rowName}>
                                                {data.name}
                                            </p>
                                            <p className={styles.rowEmail}>
                                                {data.email}
                                            </p>
                                            <p className={styles.rowType}>
                                                {data.role}
                                            </p>
                                        </div>
                                        <div className={styles.rowData}>
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
        </>
    );
};

export default Overview;
