import { AnimatePresence, motion } from 'framer-motion';
import { Dispatch, SetStateAction, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { TillRoles } from '../../../services/enums';
import SecondaryButton from '../../pages/app/Overview/components/SecondaryButton/SecondaryButton';
import styles from './DashboardTabs.module.css';

const DashboardTabs = ({
  tab,
  setShowPublishModal,
}: {
  tab: string;
  setShowPublishModal?: Dispatch<SetStateAction<boolean>>;
}) => {
  const eventData = JSON.parse(sessionStorage.getItem('eventData')!);

  const checkUrlForTerm = (term: string) => {
    const currentUrl = window.location.href.toLowerCase();
    return currentUrl.includes(term.toLowerCase());
  };
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
      roles: TillRoles.VOLUNTEER,
      category: 'preEvent',
    },
    insights: {
      title: 'Insights',
      roles: TillRoles.ADMIN,
      category: 'preEvent',
    },
    guests: {
      title: 'Guests',
      roles: TillRoles.VOLUNTEER,
      category: 'preEvent',
    },
    manage: {
      title: 'Event Page',
      roles: TillRoles.ADMIN,
      category: 'eventManagement',
    },
    formbuilder: {
      title: 'Form Builder',
      roles: TillRoles.ADMIN,
      category: 'eventManagement',
    },
    checkins: {
      title: 'Scan QR',
      roles: TillRoles.VOLUNTEER,
      category: 'inEvent',
    },
    inevent: {
      title: 'In-Event',
      roles: TillRoles.VOLUNTEER,
      category: 'inEvent',
    },
    logs: {
      title: 'Logs',
      roles: TillRoles.ADMIN,
      category: 'others',
    },
  };

  if (import.meta.env.VITE_CURRENT_ENV === 'dev') {
    tabs.postevent = {
      title: 'Post Event',
      roles: TillRoles.ADMIN,
      category: 'postEvent',
    };
  }

  const userRoles = eventData?.current_user_role;

  return (
    <AnimatePresence>
      <>
        {eventData && (
          <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
              <ol className={styles.tabList}>
                {eventData.current_user_role != 'Gamer' && (
                  <>
                    {Object.keys(tabs)
                      .filter((tab) => {
                        return tabs[tab as keyof typeof tabs].roles.includes(userRoles);
                      })
                      .reduce((acc: JSX.Element[], tab, index) => {
                        const category = tabs[tab as keyof typeof tabs].category;
                        const title = tabs[tab as keyof typeof tabs].title;

                        const tabElement = (
                          <div key={index}>
                            <motion.li
                              whileHover={{ scale: 1.05, marginRight: 10, color: '#fdfdfd' }}
                              className={`pointer ${styles.tab}`}
                              onClick={() => updateTab(tab)}
                            >
                              {title}
                            </motion.li>
                            {currentTab === tab && (
                              <motion.div layoutId='tab-indicator' className={styles.active} />
                            )}
                          </div>
                        );
                        if (acc.length === 0) {
                          acc.push(tabElement);
                        } else {
                          const lastCategory =
                            tabs[Object.keys(tabs)[index - 1] as keyof typeof tabs].category;
                          if (category !== lastCategory) {
                            acc.push(
                              <span key={`category-${index}`} className={styles.categorySeparator}>
                                {' '}
                                |{' '}
                              </span>,
                            );
                          }
                          acc.push(tabElement);
                        }

                        return acc;
                      }, [])}
                  </>
                )}
              </ol>
              {tab === 'insights' && !checkUrlForTerm('public') && (
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
