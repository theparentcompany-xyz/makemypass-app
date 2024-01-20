import styles from "./SecondaryButton.module.css";

const SecondaryButton = ({ buttonText }: { buttonText: string }) => {
    return (
        <>
            <button className={styles.buttonContainer}>
                <p className={styles.buttonText}>{buttonText}</p>
            </button>
        </>
    );
};

export default SecondaryButton;
