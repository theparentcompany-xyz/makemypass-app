import Theme from "../../../components/Theme/Theme";
import styles from "./Home.module.css";
import { GoPeople } from "react-icons/go";
import { BsArrowRight } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { getEvents } from "../../../apis/events";
import { useEffect, useState } from "react";

const Home = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        getEvents(setEvents);
    }, []);

    return (
        <>
            <Theme>
                <div className={styles.homeContainer}>
                    <div>
                        <p className={styles.homeHeader}>Events</p>
                        <div className={styles.eventsContainer}>
                            <div className={styles.event}>
                                <div className={styles.eventDate}>
                                    <p className={styles.date}>2nd Feb 2024</p>
                                    <p className={styles.day}>Wednesday</p>
                                </div>

                                <img src="/slider.webp" alt="" />

                                <div>
                                    <div className={styles.eventCard}>
                                        <div className={styles.innerCard}>
                                            <img
                                                src="/scale.webp"
                                                alt=""
                                                className={styles.eventImage}
                                            />
                                            <div
                                                className={styles.eventDetails}
                                            >
                                                <p className={styles.eventName}>
                                                    Scale Up Conclave 2024
                                                </p>
                                                <p
                                                    className={
                                                        styles.eventGuests
                                                    }
                                                >
                                                    <span>
                                                        <GoPeople color="a4a4a4" />
                                                    </span>
                                                    0 guests
                                                </p>
                                                <button
                                                    className={styles.manage}
                                                >
                                                    Manage
                                                    <BsArrowRight size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button className={styles.create}>
                                        <FaPlus size={15} />
                                        Create New Event
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Theme>
        </>
    );
};

export default Home;
