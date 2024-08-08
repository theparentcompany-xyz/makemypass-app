import { Dispatch, SetStateAction, useState } from 'react';
import styles from './DashboardTabs.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import SecondaryButton from '../../pages/app/Overview/components/SecondaryButton/SecondaryButton';
import { Roles } from '../../../services/enums';

const DashboardTabs = ({
  tab,
  setShowPublishModal,
}: {
  tab: string;
  setShowPublishModal?: Dispatch<SetStateAction<boolean>>;
}) => {
  const eventData = JSON.parse(sessionStorage.getItem('eventData')!);

  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState(tab);

  const { eventTitle } = useParams<{ eventTitle: string }>();

  const updateTab = (tab: string) => {
    setCurrentTab(tab);
    navigate(`/${eventTitle}/${tab}/`);
  };

  const tabs: TabsType = {
    overview: {
      title: 'Overview',
      roles: [Roles.ADMIN, Roles.OWNER],
    },
    insights: {
      title: 'Insights',
      roles: [Roles.ADMIN, Roles.OWNER],
    },
    guests: {
      title: 'Guests',
      roles: [Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER],
    },
    inevent: {
      title: 'In-Event',
      roles: [Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER],
    },
    manage: {
      title: 'Event Page',
      roles: [Roles.ADMIN, Roles.OWNER],
    },
    checkins: {
      title: 'Check-Ins',
      roles: [Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER],
    },
    formbuilder: {
      title: 'Form Builder',
      roles: [Roles.ADMIN, Roles.OWNER],
    },
    logs: {
      title: 'Logs',
      roles: [Roles.ADMIN, Roles.OWNER],
    },
  };

  if (import.meta.env.VITE_CURRENT_ENV === 'dev') {
    tabs.postevent = {
      title: 'Post Event',
      roles: [Roles.ADMIN, Roles.OWNER],
    };
    // tabs.feedback = {
    //   title: 'Feedback',
    //   roles: [Roles.ADMIN, Roles.OWNER],
    // };
  }

  const userRoles = eventData?.current_user_role;

  return (
    <AnimatePresence>
      <>
        {eventData && (
          <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
              <ol>
                {eventData.current_user_role != 'Gamer' && (
                  <>
                    {Object.keys(tabs)
                      .filter((tab) => {
                        return tabs[tab as keyof typeof tabs].roles.includes(userRoles);
                      })
                      .map((tab, index) => (
                        <div key={index}>
                          <motion.li
                            whileHover={{ scale: 1.05, marginRight: 10, color: '#fdfdfd' }}
                            className={`pointer ${styles.tab}`}
                            onClick={() => updateTab(tab)}
                          >
                            {tabs[tab as keyof typeof tabs].title}
                          </motion.li>
                          {currentTab === tab && (
                            <motion.div layoutId='tab-indicator' className={styles.active} />
                          )}
                        </div>
                      ))}
                  </>
                )}
              </ol>
              {tab === 'insights' && (
                <SecondaryButton
                  buttonText='Share'
                  onClick={() => {
                    if (setShowPublishModal) setShowPublishModal(true);
                  }}
                />
              )}
            </div>
          </div>
        )}
      </>
    </AnimatePresence>
  );
};

export default DashboardTabs;
