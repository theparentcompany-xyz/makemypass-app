import styles from './SectionButton.module.css';
import { motion } from 'framer-motion';

type ButtonProps = {
  buttonText: string;
  icon?: JSX.Element;
  buttonColor?: string;
  onClick?: () => void;
};

const Button = ({ buttonText, icon, onClick }: ButtonProps) => {
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05, marginRight: 10 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={styles.buttonContainer}
      >
        <p className={styles.buttonText}>{buttonText}</p>

        <div className={styles.buttonIcon}>
          <div className={styles.icon}>{icon}</div>
        </div>
      </motion.button>
    </>
  );
};

export default Button;
