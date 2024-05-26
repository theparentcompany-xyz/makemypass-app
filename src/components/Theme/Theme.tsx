import { AnimatePresence } from 'framer-motion';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import styles from './Theme.module.css';
import { useSearchParams } from 'react-router-dom';

const Theme = ({ type, children }: { type?: string | undefined; children: React.ReactNode }) => {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');

  return (
    <AnimatePresence>
      <div className={styles.themeContainer}>
        <div className={styles.gradient}>
          <div className={styles.grad2}></div>
          <div className={styles.grad3}></div>
        </div>

        <Header type={type} />
        <div className={styles.childrenContainer}>{children}</div>

        {typeParam !== 'embed' && <Footer />}
      </div>
    </AnimatePresence>
  );
};

export default Theme;
