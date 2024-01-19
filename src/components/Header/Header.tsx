import { useEffect, useState } from "react";
import styles from "./Header.module.css";
const Header = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []); // Empty dependency array to run the effect only once on mount

    const formatTime = (date: Date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const offsetHours = Math.floor(date.getTimezoneOffset() / 60);
        const offsetMinutes = date.getTimezoneOffset() % 60;

        const formattedTime = `${String(hours).padStart(2, "0")}:${String(
            minutes
        ).padStart(2, "0")} GMT${offsetHours >= 0 ? "+" : "-"}${String(
            Math.abs(offsetHours)
        ).padStart(2, "0")}:${String(offsetMinutes).padStart(2, "0")}`;

        return formattedTime;
    };
    return (
        <header>
            <div className={styles.headerComponent}>
                <div className={styles.mainLogo}>
                    <img src="/logoText.png" alt="" className={styles.header} />
                    <p className={styles.logo}>MakeMyPass</p>
                </div>

                <p className={styles.timeText}>{formatTime(currentTime)}</p>
            </div>
        </header>
    );
};

export default Header;
