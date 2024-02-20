import { AnimatePresence } from 'framer-motion';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import styles from './Theme.module.css';

const Theme = ({ type, children }: { type?: string | undefined; children: React.ReactNode }) => {
  return (
    <AnimatePresence>
      <div className={styles.themeContainer}>
        <div className={styles.grad1}></div>
        <div className={styles.grad2}></div>
        <div className={styles.grad3}></div>
        <Header type={type} />
        <div className={styles.childrenContainer}>{children}</div>

        <Footer />
      </div>
    </AnimatePresence>
  );
};

export default Theme;
