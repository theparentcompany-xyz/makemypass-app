import styles from "./SecondaryButton.module.css";

const SecondaryButton = ({
  buttonText,
  onClick,
}: {
  buttonText: string;
  onClick?: () => void;
}) => {
  return (
    <>
      <button onClick={onClick} className={styles.buttonContainer}>
        <p className={styles.buttonText}>{buttonText}</p>
      </button>
    </>
  );
};

export default SecondaryButton;
