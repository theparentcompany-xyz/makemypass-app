import { useEffect, useState } from 'react';
import styles from './Randomizer.module.css';
import Theme from '../../../components/Theme/Theme';
import EventHeader from '../../../components/EventHeader/EventHeader';
import DashboardTabs from '../../../components/DashboardTabs/DashboardTabs';
import Modal from '../../../components/Modal/Modal';
import {
  createSpinWheelLog,
  getSpinWheelLogList,
  getSpinWheelUserList,
} from '../../../apis/randomizer';
import { SpinWheelLogList, userListType } from './types';
import ReactConfetti from 'react-confetti';
import { HashLoader } from 'react-spinners';
import { formatDate } from '../../../common/commonFunctions';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import { useNavigate, useParams } from 'react-router';

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
      createSpinWheelLog(eventId, result.id);
      getSpinWheelLogList(eventId, setLogList);
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
      if (userList[index].name) visibleNames.push(userList[index].name);
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
          <ReactConfetti
            className={styles.confetti}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 100000,
            }}
          />
          <Modal
            title='Selected User'
            onClose={() =>
              setResult({
                name: '',
                id: '',
              })
            }
          >
            <div className={styles.resultsContainer}>
              <p className={styles.resultText}>{result.name} is the selected User</p>
            </div>
          </Modal>
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
