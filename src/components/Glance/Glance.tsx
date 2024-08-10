import styles from './Glance.module.css';
import { formatDate } from '../../common/commonFunctions';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { connectPrivateSocket } from '../../../services/apiGateway';
import PoppingText from './components/PoppingText';
import { makeMyPassSocket } from '../../../services/urls';

const Glance = ({ tab }: { tab: string }) => {
  const [progressData, setprogressData] = useState<progressDataType>([]);
  const [targetGuests, setTargetGuests] = useState<number>(0);
  const [todayCheckIns, setTodayCheckIns] = useState<number>(0);
  const [lastRegistered, setLastRegistered] = useState<string>('');
  const [shortlistedCount, setShortlistedCount] = useState<number>(0);
  const [uncalimedCount, setUnclaimedCount] = useState<number>(0);
  const [totalGuests, setTotalGuests] = useState<number>(0);
  const [backendURL, setBackendURL] = useState<string>('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    return () => {
      socket?.close();
    };
  }, []);

  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);

  useEffect(() => {
    if (tab === 'inevent') {
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

          if (
            !JSON.parse(event.data).response.today_checkin &&
            JSON.parse(event.data).response.today_checkin != 0
          ) {
            setTotalGuests(Number(JSON.parse(event.data).response.total_reg));
            setUnclaimedCount(Number(JSON.parse(event.data).response.unclaimed_count));
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
          const colors = [
            '#47C97E',
            '#7662FC',
            '#C33D7B',
            '#FBD85B',
            '#5B75FB',
            '#D2D4D7',
            '#BEC2C9',
            '#59D168',
            '#6270D9',
            '#A83C6F',
            '#FFE347',
            '#7C9BF2',
            '#E6E8EC',
            '#2EAF6D',
            '#9B4FD3',
          ];

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

  return (
    <div className={styles.glanceContainer}>
      {progressData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0 }}
          className={styles.glanceContainer}
        >
          <div className={styles.glanceHeaderSection}>
            <motion.p className={styles.glanceHeader}>At a Glance</motion.p>

            {lastRegistered && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.lastUpdated}
              >
                {tab == 'inevent' ? 'Last CheckIn ' : 'Last Registered '}
                {formatDate(lastRegistered, true)}
              </motion.p>
            )}
          </div>

          <div className={styles.guestsCount}>
            {totalGuests > 0 && (
              <motion.div
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
              </motion.div>
            )}

            {tab == 'checkins' && (
              <motion.div
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
              </motion.div>
            )}
            <>
              <div className='row'>
                {shortlistedCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={styles.guests}
                  >
                    {shortlistedCount}

                    <span>&nbsp;shortlisted</span>
                  </motion.div>
                )}

                {uncalimedCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={styles.guests}
                  >
                    {uncalimedCount}

                    <span>&nbsp;unclaimed</span>
                  </motion.div>
                )}
              </div>
            </>
          </div>

          <div className={styles.progresBarGraph}>
            {progressData.map((data, index) => (
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(data.value / progressData.reduce((sum, data) => sum + data.value, 0)) * 100}%`,
                }}
                key={index}
                className={styles.progressBar}
                style={{
                  backgroundColor: data.color,
                  width: `${(data.value / progressData.reduce((sum, data) => sum + data.value, 0)) * 100}%`,
                }}
              ></motion.div>
            ))}
          </div>

          <div className={styles.progressLabels}>
            {progressData.map((data, index) => (
              <ul key={index}>
                <motion.li
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={styles.progressLabel}
                  style={{
                    color: data.color,
                  }}
                >
                  <p className={styles.dataCount}>
                    • ({data.value}) {data.type.substring(0, 8)}..
                  </p>
                </motion.li>
              </ul>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Glance;
