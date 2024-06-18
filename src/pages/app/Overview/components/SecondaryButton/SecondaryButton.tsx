import styles from './SecondaryButton.module.css';

const SecondaryButton = ({
  buttonText,
  onClick,
  type,
  icon,
}: {
  buttonText: string;
  onClick?: () => void;
  type?: 'submit' | 'button';
  icon?: React.ReactNode;
}) => {
  return (
    <>
      <button onClick={onClick} type={type} className={styles.buttonContainer}>
        {icon}
        <p className={styles.buttonText}>{buttonText}</p>
      </button>
    </>
  );
};

export default SecondaryButton;
