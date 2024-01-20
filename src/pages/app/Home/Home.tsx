import Theme from "../../../components/Theme/Theme";
import styles from "./Home.module.css";
import { GoPeople } from "react-icons/go";
import { BsArrowRight } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEvents } from "../../../apis/events";

const Home = () => {
    type Event = {
        id: string;
        title: string;
        members: number;
        logo: string | null;
        date: string;
        day: string;
    };

    const [events, setEvents] = useState([] as Event[]);

    useEffect(() => {
        getEvents(setEvents);
        console.log(events);
    }, []);

    return (
        <>
            <Theme>
                <div className={styles.homeContainer}>
                    <div>
                        <p className={styles.homeHeader}>Events</p>
                        <div className={styles.eventsContainer}>
                            {events.map((event) => (
                                <div className={styles.event}>
                                    <div className={styles.eventDate}>
                                        <p className={styles.date}>
                                            {event.date}
                                        </p>
                                        <p className={styles.day}>
                                            {event.day}
                                        </p>
                                    </div>

                                    <img src="/slider.webp" alt="" />

                                    <div>
                                        <div className={styles.eventCard}>
                                            <div className={styles.innerCard}>
                                                <img
                                                    src="/scale.webp"
                                                    alt=""
                                                    className={
                                                        styles.eventImage
                                                    }
                                                />
                                                <div
                                                    className={
                                                        styles.eventDetails
                                                    }
                                                >
                                                    <p
                                                        className={
                                                            styles.eventName
                                                        }
                                                    >
                                                        {event.title}
                                                    </p>
                                                    <p
                                                        className={
                                                            styles.eventGuests
                                                        }
                                                    >
                                                        <span>
                                                            <GoPeople color="a4a4a4" />
                                                        </span>
                                                        {event.members} guests
                                                    </p>
                                                    <Link
                                                        to={`/overview?eventId=${event.id}`}
                                                    >
                                                        <button
                                                            className={
                                                                styles.manage
                                                            }
                                                        >
                                                            Manage
                                                            <BsArrowRight
                                                                size={15}
                                                            />
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        <button className={styles.create}>
                                            <FaPlus size={15} />
                                            Create New Event
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Theme>
        </>
    );
};

export default Home;
