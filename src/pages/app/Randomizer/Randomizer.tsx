import { useEffect, useState } from 'react';
import styles from './Randomizer.module.css';
import Theme from '../../../components/Theme/Theme';
import EventHeader from '../../../components/EventHeader/EventHeader';
import DashboardTabs from '../../../components/DashboardTabs/DashboardTabs';

import {
  createSpinWheelLog,
  getSpinWheelLogList,
  getSpinWheelUserList,
} from '../../../apis/randomizer';
import { SpinWheelLogList, userListType } from './types';
import Confetti from 'react-confetti';
import { HashLoader } from 'react-spinners';
import { formatDate } from '../../../common/commonFunctions';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
const Randomizer = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState({
    name: '',
    id: '',
  });
  const [topIndex, setTopIndex] = useState(0);
  const [showButton, setShowButton] = useState(true);
  const navigate = useNavigate();
  const [userList, setUserList] = useState<userListType[]>([]);
  const [logList, setLogList] = useState<SpinWheelLogList[]>([]);

  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);

  const { eventTitle } = useParams<{ eventTitle: string }>();
  useEffect(() => {
    getSpinWheelUserList(eventId, setUserList);
    getSpinWheelLogList(eventId, setLogList);
  }, []);

  useEffect(() => {
    if (result.id && result.id.length > 0) {
      createSpinWheelLog(eventId, result.id, setLogList);

      setTimeout(() => {
        setResult({
          name: '',
          id: '',
        });
      }, 4000);
    }
  }, [result]);

  const spin = () => {
    if (!spinning) {
      setSpinning(true);
      setResult({
        name: '',
        id: '',
      });
      setShowButton(false);

      const spins = 50 + Math.floor(Math.random() * 50); // 50-100 moves
      let currentIndex = topIndex;

      const intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % userList.length;
        setTopIndex(currentIndex);
      }, 100);

      setTimeout(() => {
        clearInterval(intervalId);
        setSpinning(false);
        if (userList[currentIndex].name && userList[currentIndex].id)
          setResult({
            name: userList[currentIndex].name,
            id: userList[currentIndex].id,
          });
        setShowButton(true);
      }, spins * 100);
    }
  };

  const getVisibleNames = () => {
    const visibleCount = 7; // Odd number for center alignment
    const visibleNames = [];
    const middleIndex = Math.floor(visibleCount / 2);
    const startIndex = (topIndex + userList.length - middleIndex) % userList.length;

    for (let i = 0; i < visibleCount; i++) {
      const index = (startIndex + i) % userList.length;
      if (userList[index] && userList[index].name) visibleNames.push(userList[index].name);
      else visibleNames.push('No Name');
    }
    return visibleNames;
  };

  const getOpacity = (index: number) => {
    const opacities = [0.3, 0.5, 0.7, 1, 0.7, 0.5, 0.3];
    return opacities[index];
  };

  return (
    <Theme>
      {result && result.id && (
        <>
          <Confetti className={styles.confetti} />
          <AnimatePresence>
            <>
              <div className={styles.backgroundBlur}></div>
              <motion.dialog
                initial={{
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.5,
                }}
                open
                className={styles.welcomeContainer}
              >
                <img
                  src='/app/congo.png'
                  alt='welcome image with confetti for card '
                  className={styles.image}
                />
                <div className={styles.welcomeText}>
                  <p className={styles.welcomeHeading}>
                    We have a Winner! <span role='img'>🎉</span>
                  </p>
                  <p className={styles.welcomeDescription}>
                    {`${result.name} is the lucky Winner.`}
                  </p>
                  <SecondaryButton
                    onClick={() => navigate(`/${eventTitle}/guests?eventRegisterId=${result.id}`)}
                    buttonText='View Winner'
                  />
                </div>
              </motion.dialog>
            </>
          </AnimatePresence>
        </>
      )}
      <EventHeader previousPageNavigate='/events' />
      <DashboardTabs tab='randomizer' />
      {userList && userList.length > 0 ? (
        <div className={styles.center}>
          <div className={styles.pageTexts}>
            <p className={styles.pageHeading}>Pick a Random User</p>
            <p className={styles.pageDescription}>
              Click the SPIN button to randomly select a user from the list.
            </p>
          </div>
          {userList.length > 0 && (
            <div className={styles.spinWheelContainer}>
              <div className={`${styles.spinWheel} ${spinning ? styles.spinning : ''}`}>
                {getVisibleNames().map((name, index) => (
                  <div
                    key={index}
                    className={`${styles.spinItem} ${index === 3 ? styles.centerItem : ''}`}
                    style={{ opacity: getOpacity(index) }}
                  >
                    {name}
                  </div>
                ))}
                <div className={styles.pointer}></div>
              </div>
              {showButton && (
                <button className={styles.spinButton} onClick={spin}>
                  SPIN
                </button>
              )}
            </div>
          )}

          <div className={styles.previousLogs}>
            <div className={styles.pageTexts}>
              <p className={styles.pageHeading}>Randomly Picked Users</p>
              <p className={styles.pageDescription}>
                List of users that were randomly picked in the past.
              </p>
            </div>
            <div className={styles.logsContainer}>
              {logList.length > 0 ? (
                logList.map((log, index) => (
                  <div key={index} className={styles.logItem}>
                    <p className={styles.logItemText}>{`${index + 1}). ${log.name}`}</p>
                    <div className='row'>
                      <p className={styles.logItemText}>{formatDate(log.created_at, true)}</p>
                      <SecondaryButton
                        onClick={() =>
                          navigate(`/${eventTitle}/guests?eventRegisterId=${log.event_register_id}`)
                        }
                        buttonText='View Guest'
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.noLogsText}>No Logs Available</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className='center'>
          <HashLoader color={'#46BF75'} size={50} />
        </div>
      )}
    </Theme>
  );
};

export default Randomizer;
