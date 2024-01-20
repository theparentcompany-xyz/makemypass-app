import styles from "./Button.module.css";
const Button = ({
    buttonText,
    icon,
    buttonColor,
    ...props
}: {
    buttonText: string;
    icon: JSX.Element;
    buttonColor: string;
}) => {
    return (
        <>
            <button {...props} className={styles.buttonContainer}>
                <p className={styles.buttonText}>{buttonText}</p>

                <div className={styles.buttonIcon}>
                    <div className={styles.icon}>{icon}</div>
                </div>
            </button>
        </>
    );
};

export default Button;
