import { useEffect, useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { listSpinWheelItems } from '../../../apis/spinwheel';
import { OptionStyle } from './types';
import { useParams } from 'react-router-dom';
import { getEventUUID } from '../../../common/commonFunctions';
import styles from './SpinWheel.module.css';

const SpinWheel = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const [spinWheelData, setSpinWheelData] = useState<OptionStyle[]>();

  const [eventId, setEventId] = useState<string>('');
  const { eventTitle } = useParams<{ eventTitle: string }>();

  useEffect(() => {
    if (eventTitle && !eventId) getEventUUID(eventTitle, setEventId);

    if (eventId) listSpinWheelItems(eventId, setSpinWheelData);

    console.log(eventId, spinWheelData);
  }, [eventId]);

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = 2;
      setPrizeNumber(newPrizeNumber);
      window.alert(newPrizeNumber);
      setMustSpin(true);
    }
  };

  return (
    <>
      {spinWheelData && spinWheelData.length > 0 && (
        <div className={styles.wheel}>
          <Wheel
            innerBorderWidth={0}
            outerBorderWidth={0}
            radiusLineWidth={1}
            fontSize={15}
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={spinWheelData}
            fontFamily='Inter, sans-serif'
            onStopSpinning={() => {
              setMustSpin(false);
            }}
          />
        </div>
      )}
      <button onClick={handleSpinClick}>SPIN</button>
    </>
  );
};

export default SpinWheel;
