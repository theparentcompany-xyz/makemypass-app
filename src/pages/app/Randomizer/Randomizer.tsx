import { useState } from 'react';
import styles from './Randomizer.module.css';
import Theme from '../../../components/Theme/Theme';
import EventHeader from '../../../components/EventHeader/EventHeader';
import DashboardTabs from '../../../components/DashboardTabs/DashboardTabs';
import Modal from '../../../components/Modal/Modal';

const Randomizer = () => {
  const names = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah'];
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState('');
  const [topIndex, setTopIndex] = useState(0);
  const [showButton, setShowButton] = useState(true);

  const spin = () => {
    if (!spinning) {
      setSpinning(true);
      setResult('');
      setShowButton(false);

      const spins = 50 + Math.floor(Math.random() * 50); // 50-100 moves
      let currentIndex = topIndex;

      const intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % names.length;
        setTopIndex(currentIndex);
      }, 100);

      setTimeout(() => {
        clearInterval(intervalId);
        setSpinning(false);
        setResult(names[currentIndex]);
        setShowButton(true);
      }, spins * 100);
    }
  };

  const getVisibleNames = () => {
    const visibleCount = 7; // Odd number for center alignment
    const visibleNames = [];
    const middleIndex = Math.floor(visibleCount / 2);
    const startIndex = (topIndex + names.length - middleIndex) % names.length;

    for (let i = 0; i < visibleCount; i++) {
      const index = (startIndex + i) % names.length;
      visibleNames.push(names[index]);
    }
    return visibleNames;
  };

  const getOpacity = (index: number) => {
    const opacities = [0.3, 0.5, 0.7, 1, 0.7, 0.5, 0.3];
    return opacities[index];
  };

  return (
    <Theme>
      {result && (
        <Modal title='Selected User' onClose={() => setResult('')}>
          <div className={styles.resultsContainer}>
            <p className={styles.resultText}>{result} is the selected User</p>
          </div>
        </Modal>
      )}
      <EventHeader previousPageNavigate='/events' />
      <DashboardTabs tab='randomizer' />
      <div className={styles.center}>
        <div className={styles.pageTexts}>
          <p className={styles.pageHeading}>Pick a Random User</p>
          <p className={styles.pageDescription}>
            Click the SPIN button to randomly select a user from the list.
          </p>
        </div>
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
      </div>
    </Theme>
  );
};

export default Randomizer;
