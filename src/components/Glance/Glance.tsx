import { useEffect, useState } from 'react';
import styles from './Glance.module.css';
import { connectPrivateSocket } from '../../../services/apiGateway';
import { makeMyPassSocket } from '../../../services/urls';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventData, getEventId } from '../../apis/events';
import { motion } from 'framer-motion';
import { formatDate } from '../../common/commonFunctions';

const Glance = ({ tab }: { tab: string }) => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    role: '',
    name: '',
  });

  type progressDataType = {
    type: string;
    color: string | undefined;
    value: number;
  }[];

  const navigate = useNavigate();

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [progressData, setprogressData] = useState<progressDataType>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [totalGuests, setTotalGuests] = useState<number>(0);
  const [targetGuests, setTargetGuests] = useState<number>(0);
  const [todayCheckIns, setTodayCheckIns] = useState<number>(0);
  const [lastRegistered, setLastRegistered] = useState<string>('');

  const [firstRender, setFirstRender] = useState<boolean>(true);

  useEffect(() => {
    return () => {
      socket?.close();
    };
  }, []);

  const [currentTab, setCurrentTab] = useState('overview');

  const updateTab = (tab: string) => {
    setFirstRender(true);
    setCurrentTab(tab);
    navigate(`/${eventTitle}/${tab}/`);

    setFirstRender(true);
  };

  const [eventId, setEventId] = useState<string>('');
  const { eventTitle } = useParams<{ eventTitle: string }>();

  useEffect(() => {
    if (eventId) getEventData(eventId, setEventData);
  }, [eventId]);

  useEffect(() => {
    let eventData = JSON.parse(localStorage.getItem('eventData') as string);

    if (!eventData)
      setTimeout(() => {
        eventData = JSON.parse(localStorage.getItem('eventData') as string);

        if (eventData) {
          if (eventData.event_name !== eventTitle) {
            localStorage.removeItem('eventData');
            getEventId(eventTitle ?? '');
          } else {
            setEventId(eventData.event_id);
          }
        }
      }, 2000);

    setEventId(eventData?.event_id);
  }, [eventTitle]);

  const [backendURL, setBackendURL] = useState<string>('');
  useEffect(() => {
    setCurrentTab(tab);
    if (tab === 'checkins' || tab === 'inevent') {
      setBackendURL(makeMyPassSocket.checkInCounts(eventId));
    } else {
      if (eventId) setBackendURL(makeMyPassSocket.registerCounts(eventId));
    }
  }, [tab, eventId]);

  useEffect(() => {
    if (!firstRender && totalGuests > 0) {
      const audio = new Audio('/count.mp3');
      audio.play();
    }

    if (firstRender && totalGuests > 0) setFirstRender(false);
  }, [totalGuests, firstRender]);

  useEffect(() => {
    if (eventId)
      connectPrivateSocket({
        url: backendURL,
      }).then((ws) => {
        ws.onmessage = (event) => {
          const category = JSON.parse(event.data).response.bargraph;

          if (JSON.parse(event.data).response.total_reg) {
            setTotalGuests(Number(JSON.parse(event.data).response.total_reg));
            setTargetGuests(Number(JSON.parse(event.data).response.target_reg));
          } else {
            setTotalGuests(Number(JSON.parse(event.data).response.total_checkin));
            setTargetGuests(Number(JSON.parse(event.data).response.total_registration));
            setTodayCheckIns(Number(JSON.parse(event.data).response.today_checkin));
          }

          setLastRegistered(JSON.parse(event.data).response.last_registered_at);

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

          let currentDate = new Date();
          let formattedTime = currentDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          });
          setLastUpdated(formattedTime);
        };

        setSocket(ws);
      });
  }, [eventId, backendURL]);

  return (
    <>
      {eventData && eventData.role !== 'Volunteer' && (
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <ol>
              {eventData.role != 'Gamer' && (
                <>
                  <div>
                    <motion.li
                      whileHover={{ scale: 1.05, marginRight: 10, color: '#ffffff' }}
                      className={styles.tab}
                      onClick={() => updateTab('overview')}
                    >
                      Overview
                    </motion.li>
                    {currentTab === 'overview' && (
                      <motion.div layoutId='tab-indicator' className={styles.active} />
                    )}
                  </div>
                  <div>
                    <motion.li
                      whileHover={{ scale: 1.05, marginRight: 10, color: '#ffffff' }}
                      className={styles.tab}
                      onClick={() => updateTab('insights')}
                    >
                      Insights
                    </motion.li>

                    {currentTab === 'insights' && (
                      <motion.div layoutId='tab-indicator' className={styles.active} />
                    )}
                  </div>
                  <div>
                    <motion.li
                      whileHover={{ scale: 1.05, marginRight: 10, color: '#ffffff' }}
                      className={styles.tab}
                      onClick={() => updateTab('guests')}
                    >
                      Guests
                    </motion.li>
                    {currentTab === 'guests' && (
                      <motion.div layoutId='tab-indicator' className={styles.active} />
                    )}
                  </div>
                  <div>
                    <motion.li
                      whileHover={{ scale: 1.05, marginRight: 10, color: '#ffffff' }}
                      className={styles.tab}
                      onClick={() => updateTab('checkins')}
                    >
                      Check-In
                    </motion.li>
                    {currentTab === 'checkins' && (
                      <motion.div layoutId='tab-indicator' className={styles.active} />
                    )}
                  </div>
                  <div>
                    <motion.li
                      whileHover={{ scale: 1.05, marginRight: 10, color: '#ffffff' }}
                      className={styles.tab}
                      onClick={() => updateTab('inevent')}
                    >
                      In-Event
                    </motion.li>
                    {currentTab === 'inevent' && (
                      <motion.div layoutId='tab-indicator' className={styles.active} />
                    )}
                  </div>
                </>
              )}
              <div>
                <motion.li
                  whileHover={{ scale: 1.05, marginRight: 10, color: '#ffffff' }}
                  className={styles.tab}
                  onClick={() => updateTab('spinwheel')}
                >
                  Spin Wheel
                </motion.li>
                {currentTab === 'spinwheel' && (
                  <motion.div layoutId='tab-indicator' className={styles.active} />
                )}
              </div>
            </ol>
          </div>
        </div>
      )}
      {currentTab &&
        currentTab != 'insights' &&
        currentTab != 'spinwheel' &&
        currentTab != 'claimgifts' && (
          <div className={styles.glanceContainer}>
            <div className={styles.glanceHeaderSection}>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.glanceHeader}
              >
                {tab === 'checkins' || tab === 'inevent' ? 'Check-In at a Glance' : 'At a Glance'}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.lastUpdated}
              >
                Last {tab === 'checkins' || tab === 'inevent' ? 'Check-In' : 'Registered'}:
                {formatDate(lastRegistered)}
              </motion.p>
            </div>

            <div className={styles.guestsCount}>
              {totalGuests >= 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={styles.guests}
                >
                  <motion.p
                    animate={{
                      scale: [1, 1.25, 1],
                      marginRight: [0, 5, 0],
                      color: ['#47c97e', '#ffffff', '#47c97e'],
                    }}
                    transition={{
                      duration: 0.75,
                    }}
                    key={totalGuests}
                  >
                    <p
                      style={
                        totalGuests >= targetGuests ? { color: '#47c97e' } : { color: '#ffffff' }
                      }
                    >
                      {totalGuests}
                    </p>
                  </motion.p>
                  /{targetGuests}
                  {totalGuests > targetGuests && <p className={styles.popper}>🎉</p>}
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
                    <motion.p
                      animate={{
                        scale: [1, 1.25, 1],
                        marginRight: [0, 5, 0],
                        color: ['#47c97e', '#ffffff', '#47c97e'],
                      }}
                      transition={{
                        duration: 0.75,
                      }}
                      key={totalGuests}
                    >
                      <p
                        style={
                          totalGuests >= targetGuests ? { color: '#47c97e' } : { color: '#ffffff' }
                        }
                      >
                        {todayCheckIns}
                      </p>
                    </motion.p>
                    {totalGuests > targetGuests && <p className={styles.popper}>🎉</p>}
                    <span>&nbsp;today's guests</span>
                  </motion.p>
                ))}
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
                        • {data.value} {data.type.substring(0, 8)}..
                      </p>
                    </motion.li>
                  </>
                ))}
              </ul>
            </div>
          </div>
        )}
    </>
  );
};

export default Glance;
