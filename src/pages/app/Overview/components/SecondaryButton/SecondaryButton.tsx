import styles from './SecondaryButton.module.css';

const SecondaryButton = ({
  buttonText,
  onClick,
  type,
  icon,
  style,
}: {
  buttonText: string;
  onClick?: () => void;
  type?: 'submit' | 'button';
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  return (
    <>
      <button onClick={onClick} type={type} className={styles.buttonContainer} style={style}>
        {icon}
        <p className={styles.buttonText}>{buttonText}</p>
      </button>
    </>
  );
};

export default SecondaryButton;
