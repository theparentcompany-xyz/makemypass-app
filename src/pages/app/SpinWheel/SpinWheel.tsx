import React, { useEffect, useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { listSpinWheelItems } from '../../../apis/spinwheel';
import { OptionStyle } from './types';
import { useParams } from 'react-router-dom';
import { getEventUUID } from '../../../common/commonFunctions';

const SpinWheel = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const [spinWheelData, setSpinWheelData] = useState<OptionStyle[]>();

  const [eventId, setEventId] = useState<string>('');
  const { eventTitle } = useParams<{ eventTitle: string }>();

  useEffect(() => {
    if (eventTitle && !eventId) getEventUUID(eventTitle, setEventId);

    if (eventId) listSpinWheelItems(eventId, spinWheelData);

    console.log(eventId, spinWheelData);
  }, [eventId]);

  const data = [{ option: '0' }, { option: '1' }, { option: '2' }];

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
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={spinWheelData}
          onStopSpinning={() => {
            setMustSpin(false);
          }}
        />
      )}
      <button onClick={handleSpinClick}>SPIN</button>
    </>
  );
};

export default SpinWheel;
