import { useState } from 'react';
import Theme from '../../../components/Theme/Theme';
import styles from './SpinWheel.module.css';
import SectionButton from '../../../components/SectionButton/SectionButton';

import { Wheel } from 'react-custom-roulette';
import { ImSpinner9 } from 'react-icons/im';

const data = [
  { option: 'Bike', style: { backgroundColor: '#47C97E', textColor: '#1E2132' } },
  { option: 'Car', style: { backgroundColor: '#7662FC', textColor: '#1E2132' } },
  { option: 'Macbook Pro', style: { backgroundColor: '#C33D7B', textColor: '#1E2132' } },
  { option: 'iPhone 15 Pro', style: { backgroundColor: '#D2D4D7', textColor: '#1E2132' } },
  { option: 'Smart TV', style: { backgroundColor: '#35A1EB', textColor: '#1E2132' } },
  { option: 'Wireless Headphones', style: { backgroundColor: '#FBD85B', textColor: '#1E2132' } },
  { option: 'Digital Camera', style: { backgroundColor: '#47C97E', textColor: '#1E2132' } },
  { option: 'Smartwatch', style: { backgroundColor: '#7662FC', textColor: '#1E2132' } },
  { option: 'Bluetooth Speaker', style: { backgroundColor: '#C33D7B', textColor: '#1E2132' } },
  { option: 'Laptop', style: { backgroundColor: '#D2D4D7', textColor: '#1E2132' } },
];

const SpinWheel = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const [message, setMessage] = useState('');

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);

      setMessage(`You won a ${data[newPrizeNumber].option}!`);
    }
  };

  return (
    <Theme>
      <div className={styles.spinWheelContainer}>
        <div className={styles.wheel}>
          <Wheel
            innerBorderWidth={0}
            outerBorderWidth={0}
            radiusLineWidth={1}
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            fontFamily='Inter, sans-serif'
            data={data}
            onStopSpinning={() => {
              setMustSpin(false);
            }}
            fontSize={15}
            radiusLineColor='#232A2B'
          />
        </div>
        <SectionButton
          buttonText='Spin The Wheel'
          icon={<ImSpinner9 size={25} />}
          buttonColor='#47C97E'
          onClick={handleSpinClick}
        />
        {!mustSpin && <p className={styles.messageText}>{message}</p>}
      </div>
    </Theme>
  );
};

export default SpinWheel;
