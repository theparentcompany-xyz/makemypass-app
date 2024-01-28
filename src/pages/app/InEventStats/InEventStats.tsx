import Glance from '../../../components/Glance/Glance';
import Theme from '../../../components/Theme/Theme';
import Header from '../../../components/EventHeader/EventHeader';
import styles from './InEventStats.module.css';

const InEventStats = () => {
  return (
    <Theme>
      <>
        <div className={styles.inEventContainer}>
          <Header />
          <Glance tab='inevent' />
        </div>
      </>
    </Theme>
  );
};

export default InEventStats;
