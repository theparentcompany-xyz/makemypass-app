import React, { useState, useEffect } from 'react';
import styles from './Randomizer.module.css';

const Randomizer = () => {
  const names = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah'];
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState('');
  const [topIndex, setTopIndex] = useState(0);

  const spin = () => {
    if (!spinning) {
      setSpinning(true);
      setResult('');

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
      }, spins * 100);
    }
  };

  const getVisibleNames = () => {
    const visibleCount = 8; // Number of visible items
    const visibleNames = [];
    const middleIndex = Math.floor(visibleCount / 2);
    const startIndex = (topIndex + names.length - middleIndex) % names.length;

    for (let i = 0; i < visibleCount; i++) {
      const index = (startIndex + i) % names.length;
      visibleNames.push(names[index]);
    }
    return visibleNames;
  };

  useEffect(() => {
    console.log(result);
  }, [result]);

  return (
    <div className={styles.spinWheelContainer}>
      <div className={`${styles.spinWheel} ${spinning ? styles.spinning : ''}`}>
        {getVisibleNames().map((name, index) => (
          <div key={index} className={styles.spinItem} style={{ backgroundColor: getColor(index) }}>
            {name}
          </div>
        ))}
      </div>
      <div className={styles.spinButton} onClick={spin}>
        SPIN
      </div>
      {result && <div className={styles.result}>Result: {result}</div>}
    </div>
  );
};

const getColor = (index: number) => {
  const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
  return colors[index % colors.length];
};

export default Randomizer;
