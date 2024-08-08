import EventHeader from '../EventHeader/EventHeader';
import DashboardTabs from '../DashboardTabs/DashboardTabs';
import styles from './DashboardLayout.module.css';
import { Dispatch, SetStateAction } from 'react';

const DashboardLayout = ({
  prevPage,
  tabName,
  children,
  setShowPublishModal,
}: {
  prevPage: string;
  tabName?: string;
  children: React.ReactNode;
  setShowPublishModal?: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <>
      <div className={styles.dashoardLayoutContainer}>
        <EventHeader previousPageNavigate={prevPage} />
        {tabName && <DashboardTabs tab={tabName} setShowPublishModal={setShowPublishModal} />}
        <div className={styles.dashboardContent}>{children}</div>
      </div>
    </>
  );
};

export default DashboardLayout;
