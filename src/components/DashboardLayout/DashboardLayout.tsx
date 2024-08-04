import EventHeader from '../EventHeader/EventHeader';
import Glance from '../Glance/Glance';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({
  prevPage,
  tabName,
  children,
}: {
  prevPage: string;
  tabName?: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <div className={styles.dashoardLayoutContainer}>
        <EventHeader previousPageNavigate={prevPage} />
        {tabName && <Glance tab={tabName} />}
        <div className={styles.dashboardContent}>{children}</div>
      </div>
    </>
  );
};

export default DashboardLayout;
