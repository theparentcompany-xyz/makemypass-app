import { Link } from 'react-router-dom';

import Theme from '../../components/Theme/Theme';
import styles from './FourNotFour.module.css';

const FourNotFour = () => {
  return (
    <Theme>
      <div className={styles.fourNotFourContainer}>
        <div className={styles.fourNotFour}>
          <p className={styles.fourNotFourHeading}>404</p>
          <p className={styles.fourNotFourSubHeading}>Not Found</p>
          <p className={styles.fourNotFourText}>The page you are looking for does not exist.</p>
          <Link to='/'>
            <button className={styles.fourNotFourButton}>Go to Home</button>
          </Link>
        </div>
      </div>
    </Theme>
  );
};

export default FourNotFour;
