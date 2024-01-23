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
import { recentRegistration } from "./types";
import { getHosts } from "../../../../../apis/overview";

const Overview = () => {
    const tableData = [
        {
            name: "Dev Nandan R S",
            email: "devnandan0502@gmail.com",
            type: "Student",
            date: "17th August 2023",
        },
        {
            name: "John Doe",
            email: "john.doe@example.com",
            type: "Professional",
            date: "20th September 2023",
        },
        {
            name: "Jane Smith",
            email: "jane.smith@example.com",
            type: "Student",
            date: "5th July 2023",
        },
        {
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            type: "Student",
            date: "12th November 2023",
        },
        {
            name: "Bob Anderson",
            email: "bob.anderson@example.com",
            type: "Professional",
            date: "8th January 2024",
        },
        {
            name: "Eva Williams",
            email: "eva.williams@example.com",
            type: "Student",
            date: "3rd April 2023",
        },
        {
            name: "Michael Brown",
            email: "michael.brown@example.com",
            type: "Professional",
            date: "14th February 2024",
        },
        {
            name: "Sophie Taylor",
            email: "sophie.taylor@example.com",
            type: "Student",
            date: "9th June 2023",
        },
        {
            name: "Alex Turner",
            email: "alex.turner@example.com",
            type: "Professional",
            date: "22nd May 2023",
        },
        {
            name: "Grace Miller",
            email: "grace.miller@example.com",
            type: "Student",
            date: "1st March 2024",
        },
        {
            name: "Daniel Harris",
            email: "daniel.harris@example.com",
            type: "Professional",
            date: "7th October 2023",
        },
        {
            name: "Olivia Jackson",
            email: "olivia.jackson@example.com",
            type: "Student",
            date: "19th December 2023",
        },
        {
            name: "Ryan Wilson",
            email: "ryan.wilson@example.com",
            type: "Professional",
            date: "11th April 2023",
        },
        {
            name: "Emma White",
            email: "emma.white@example.com",
            type: "Student",
            date: "26th July 2023",
        },
        {
            name: "William Turner",
            email: "william.turner@example.com",
            type: "Professional",
            date: "2nd September 2023",
        },
        // Add more objects as needed
    ];

    const [recentRegistrations, setRecentRegistrations] = useState<
        recentRegistration[]
    >([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [hostList, setHostList] = useState([]);

    useEffect(() => {
        getHosts("d1929bdb-c891-4850-8c41-4097ae2c6c7f", setHostList);
    }, []);

    useEffect(() => {
        return () => {
            socket?.close();
        };
    }, []);

    useEffect(() => {
        const wsUrl = `wss://dev-api.buildnship.in/makemypass/manage-event/d1929bdb-c891-4850-8c41-4097ae2c6c7f/recent-registrations/`;

        connectPrivateSocket({ url: wsUrl }).then((ws) => {
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
                        {tableData.map((data, index) => {
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
                                            {data.type}
                                        </p>
                                    </div>
                                    <div className={styles.rowData}>
                                        <TbPencil color="#8E8F90" size={18} />
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
