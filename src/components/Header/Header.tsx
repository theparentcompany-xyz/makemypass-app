import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import SecondaryButton from "../../pages/app/Overview/components/SecondaryButton/SecondaryButton";
import { Link } from "react-router-dom";
const Header = ({ type }: { type?: string | undefined }) => {
    const [openSettings, setOpenSettings] = useState(false);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const userEmail = localStorage.getItem("userEmail");

    useEffect(() => {
        if (localStorage.getItem("accessToken") && !isAuthenticated) {
            setIsAuthenticated(true);
        }
    }, [isAuthenticated]);

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
                    isAuthenticated && (
                        <>
                            <div className="row">
                                <p
                                    onClick={() => {
                                        setOpenSettings(!openSettings);
                                    }}
                                    className={styles.userName}
                                >
                                    നമസ്കാരം {userEmail}
                                    <span className={styles.avatar}>
                                        {userEmail?.split("")[0].toUpperCase()}
                                    </span>
                                </p>

                                <Link to="/login">
                                    <SecondaryButton
                                        buttonText="Logout"
                                        onClick={() => {
                                            localStorage.removeItem(
                                                "accessToken"
                                            );
                                            localStorage.removeItem(
                                                "userEmail"
                                            );
                                        }}
                                    />
                                </Link>
                            </div>
                        </>
                    )
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
