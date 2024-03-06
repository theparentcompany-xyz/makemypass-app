import styles from './SecondaryButton.module.css';

const SecondaryButton = ({
  buttonText,
  onClick,
  type,
}: {
  buttonText: string;
  onClick?: () => void;
  type?: 'submit' | 'button';
}) => {
  return (
    <>
      <button onClick={onClick} type={type} className={styles.buttonContainer}>
        <p className={styles.buttonText}>{buttonText}</p>
      </button>
    </>
  );
};

export default SecondaryButton;
