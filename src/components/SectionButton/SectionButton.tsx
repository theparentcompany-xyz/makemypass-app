import styles from "./SectionButton.module.css";
import React from "react";

type ButtonProps = {
    buttonText: string;
    icon: JSX.Element;
    buttonColor: string;
    onClick?: () => void; // Add the onClick property to the type definition
};

const Button = ({
    buttonText,
    icon,
    buttonColor,
    onClick, // Add the onClick property to the component props
}: ButtonProps) => {
    return (
        <>
            <button onClick={onClick} className={styles.buttonContainer}>
                <p className={styles.buttonText}>{buttonText}</p>

                <div className={styles.buttonIcon}>
                    <div className={styles.icon}>{icon}</div>
                </div>
            </button>
        </>
    );
};

export default Button;
