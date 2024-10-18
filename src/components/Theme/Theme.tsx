import { AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import styles from './Theme.module.css';

const Theme = ({
  type,
  hideLogin,
  children,
}: {
  type?: string | undefined;
  hideLogin?: boolean | undefined;
  children: React.ReactNode;
}) => {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');

  return (
    <AnimatePresence>
      <div className={styles.themeContainer}>
        <Header type={type} hideLogin={hideLogin} />
        <div className={styles.childrenContainer}>{children}</div>

        {typeParam !== 'embed' && <Footer />}
      </div>
    </AnimatePresence>
  );
};

export default Theme;
