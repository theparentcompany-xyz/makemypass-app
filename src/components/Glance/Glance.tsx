import { useEffect, useState } from 'react';
import styles from './Glance.module.css';
import { connectPrivateSocket } from '../../../services/apiGateway';
import { makeMyPassSocket } from '../../../services/urls';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { formatDate } from '../../common/commonFunctions';

import PoppingText from './components/PoppingText';

const Glance = ({ tab }: { tab: string }) => {
  const eventData = JSON.parse(sessionStorage.getItem('eventData')!);

  type progressDataType = {
    type: string;
    color: string | undefined;
    value: number;
  }[];

  const navigate = useNavigate();

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [progressData, setprogressData] = useState<progressDataType>([]);
  const [totalGuests, setTotalGuests] = useState<number>(0);
  const [targetGuests, setTargetGuests] = useState<number>(0);
  const [todayCheckIns, setTodayCheckIns] = useState<number>(0);
  const [lastRegistered, setLastRegistered] = useState<string>('');
  const [shortlistedCount, setShortlistedCount] = useState<number>(0);
  useEffect(() => {
    return () => {
      socket?.close();
    };
  }, []);

  const [currentTab, setCurrentTab] = useState('overview');

  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const { eventTitle } = useParams<{ eventTitle: string }>();

  const updateTab = (tab: string) => {
    setCurrentTab(tab);
    navigate(`/${eventTitle}/${tab}/`);
  };

  const [backendURL, setBackendURL] = useState<string>('');
  useEffect(() => {
    setCurrentTab(tab);
    if (tab === 'checkins' || tab === 'inevent') {
      setBackendURL(makeMyPassSocket.checkInCounts(eventId));
    } else {
      if (eventId && (tab === 'overview' || tab === 'guests'))
        setBackendURL(makeMyPassSocket.registerCounts(eventId));
    }
  }, [tab, eventId]);

  useEffect(() => {
    if (backendURL)
      connectPrivateSocket({
        url: backendURL,
      }).then((ws) => {
        ws.onmessage = (event) => {
          const category = JSON.parse(event.data).response.bargraph;
          if (totalGuests > 0 && totalGuests != JSON.parse(event.data).response.total_reg) {
            const audio = new Audio('/sounds/count.mp3');
            audio.play();
          }

          if (!JSON.parse(event.data).response.today_checkin) {
            setTotalGuests(Number(JSON.parse(event.data).response.total_reg));
            setTargetGuests(Number(JSON.parse(event.data).response.target_reg));
            setLastRegistered(JSON.parse(event.data).response.last_registered_at);
            setShortlistedCount(Number(JSON.parse(event.data).response.shortlisted_count));
          } else {
            setTotalGuests(Number(JSON.parse(event.data).response.total_checkin));
            setTargetGuests(Number(JSON.parse(event.data).response.total_reg));
            setTodayCheckIns(Number(JSON.parse(event.data).response.today_checkin));
            setLastRegistered(JSON.parse(event.data).response.last_checkin_at);
          }

          const newStrucure: progressDataType = [];
          const colors = ['#47C97E', '#7662FC', '#C33D7B', '#FBD85B', '#5B75FB', '#D2D4D7'];

          for (const [key, value] of Object.entries(category)) {
            newStrucure.push({
              type: key,
              color: colors.pop(),
              value: Number(value),
            });
          }

          setprogressData(newStrucure);
        };

        setSocket(ws);
      });
  }, [eventId, backendURL, totalGuests]);

  const tabs = {
    overview: 'Overview',
    insights: 'Insights',
    guests: 'Guests',
    inevent: 'In-Event',
    // formbuilder: 'Form Builder',
    manage: 'Events Page',
    checkins: 'Check-Ins',
    // feedback: 'Feedbacks',
  };

  return (
    <AnimatePresence>
      {eventData && eventData.current_user_role !== 'Volunteer' && (
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <ol>
              {eventData.current_user_role != 'Gamer' && (
                <>
                  {Object.keys(tabs).map((tab) => (
                    <div key={tab}>
                      <motion.li
                        whileHover={{ scale: 1.05, marginRight: 10, color: '#fdfdfd' }}
                        className={styles.tab}
                        onClick={() => updateTab(tab)}
                      >
                        {tabs[tab as keyof typeof tabs]}
                      </motion.li>
                      {currentTab === tab && (
                        <motion.div layoutId='tab-indicator' className={styles.active} />
                      )}
                    </div>
                  ))}
                </>
              )}
            </ol>
          </div>
        </div>
      )}

      <AnimatePresence>
        <div className={styles.glanceContainer}>
          {currentTab &&
            currentTab != 'insights' &&
            currentTab != 'spinwheel' &&
            currentTab != 'claimgifts' &&
            currentTab != 'postevent' &&
            currentTab != 'feedback' &&
            currentTab != 'manage' &&
            progressData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0 }}
                className={styles.glanceContainer}
              >
                <div className={styles.glanceHeaderSection}>
                  <motion.p className={styles.glanceHeader}>
                    {tab === 'checkins' || tab === 'inevent'
                      ? 'Check-In at a Glance'
                      : 'At a Glance'}
                  </motion.p>

                  {lastRegistered && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={styles.lastUpdated}
                    >
                      Last {tab === 'checkins' || tab === 'inevent' ? 'Check-In' : 'Registered'}
                      :&nbsp;
                      {formatDate(lastRegistered, true)}
                    </motion.p>
                  )}
                </div>

                <div className={styles.guestsCount}>
                  {totalGuests > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={styles.guests}
                    >
                      <PoppingText totalGuests={totalGuests} targetGuests={targetGuests} />
                      {targetGuests > 0 && ` /${targetGuests}`}
                      {totalGuests > targetGuests && targetGuests > 0 && (
                        <p className={styles.popper}>🎉</p>
                      )}
                      <span>&nbsp;unique guests</span>
                    </motion.p>
                  )}
                  {currentTab == 'checkin' ||
                    (currentTab == 'inevent' && totalGuests >= 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={styles.guests}
                      >
                        {todayCheckIns && (
                          <PoppingText
                            totalGuests={totalGuests}
                            targetGuests={targetGuests}
                            todayCheckIns={todayCheckIns}
                          />
                        )}
                        {totalGuests > targetGuests && <p className={styles.popper}>🎉</p>}
                        <span>&nbsp;today's guests</span>
                      </motion.p>
                    ))}

                  {(currentTab == 'overview' || currentTab == 'guests') && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={styles.guests}
                    >
                      {shortlistedCount}

                      <span>&nbsp;shortlisted</span>
                    </motion.p>
                  )}
                </div>

                <div className={styles.progresBarGraph}>
                  {progressData.map((data) => (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(data.value / totalGuests) * 100}%` }}
                      key={data.type}
                      className={styles.progressBar}
                      style={{
                        backgroundColor: data.color,
                        width: `${(data.value / totalGuests) * 100}%`,
                      }}
                    ></motion.div>
                  ))}
                </div>

                <div className={styles.progressLabels}>
                  <ul>
                    {progressData.map((data) => (
                      <>
                        <motion.li
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          key={data.type}
                          className={styles.progressLabel}
                          style={{
                            color: data.color,
                          }}
                        >
                          <p className={styles.dataCount}>
                            • ({data.value}) {data.type.substring(0, 8)}..
                          </p>
                        </motion.li>
                      </>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
        </div>
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default Glance;
