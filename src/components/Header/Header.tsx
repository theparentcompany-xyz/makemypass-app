import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import SecondaryButton from "../../pages/app/Overview/components/SecondaryButton/SecondaryButton";
const Header = ({ type }: { type?: string | undefined }) => {
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
                    <img
                        src="/logoText.webp"
                        alt=""
                        className={styles.header}
                    />
                    <p className={styles.logo}>MakeMyPass</p>
                </div>

                {type != "landing" ? (
                    <p className={styles.timeText}>{formatTime(currentTime)}</p>
                ) : (
                    <div className={styles.buttons}>
                        <SecondaryButton buttonText="T&C" />
                        <SecondaryButton buttonText="Privacy Policy" />
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
