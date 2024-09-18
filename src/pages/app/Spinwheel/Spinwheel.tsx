import { useEffect, useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { WheelData } from 'react-custom-roulette/dist/components/Wheel/types';

import { getSpinWheelData, spinTheWheel } from '../../../apis/gifts';
import Scanner from '../../../components/Scanner/Scanner';
import Theme from '../../../components/Theme/Theme';
import styles from './Spinwheel.module.css';
import { spinWheelType } from './types';

const Spinwheel = () => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [start, setStart] = useState(false);
  const [spin, setSpin] = useState(false);
  const [ticketId, setTicketId] = useState<string>('');
  const [trigger, setTrigger] = useState<boolean>(false);
  const [validatedTicket, setValidatedTicket] = useState<boolean>(false);
  const [prizeNumber, setPrizeNumber] = useState<number>();
  //   const data = [
  //     { option: '0', style: { backgroundColor: 'green', textColor: 'black' } },
  //     { option: '1', style: { backgroundColor: 'white' } },
  //     { option: '2' },
  //   ];

  const [spinWheelData, setSpinWheelData] = useState<spinWheelType[]>();

  const onSpin = () => {
    spinTheWheel(eventId, ticketId, spinWheelData, setPrizeNumber, setSpin);
  };

  useEffect(() => {
    if (start && trigger) {
      getSpinWheelData(eventId, ticketId, setValidatedTicket, setSpinWheelData);
    }
  }, [start, trigger]);

  useEffect(() => {
    console.log(prizeNumber);
  }, [prizeNumber]);

  return (
    <Theme>
      {!start && (
        <div className={styles.clickHeading} onClick={() => setStart(true)}>
          Click Here to <br />
          Spin The Wheel
        </div>
      )}

      {start && !validatedTicket && (
        <div className={styles.giftsContainer}>
          <Scanner
            ticketId={ticketId}
            setTicketId={setTicketId}
            setTrigger={setTrigger}
            trigger={trigger}
          />
        </div>
      )}

      {validatedTicket && (
        <>
          <div className={styles.container}>
            <div className={styles.wheelContainer}>
              <Wheel
                mustStartSpinning={spin}
                prizeNumber={prizeNumber || 0}
                data={
                  spinWheelData?.reduce(
                    (acc: { option: string; style?: { backgroundColor: string } }[], curr) => {
                      acc.push({ option: curr.name });
                      return acc;
                    },
                    [],
                  ) as WheelData[]
                }
                onStopSpinning={() => {
                  setSpin(false);
                }}
                fontFamily='Inter'
                fontWeight={400}
                perpendicularText={(spinWheelData?.length ?? 0) > 5 ? false : true}
                pointerProps={{
                  src: '/app/mmpcolor.png',
                }}
              />
            </div>

            <div className={styles.spinButtons}>
              <button className={styles.spinButton} onClick={() => onSpin()}>
                Spin
              </button>
              <button
                className={styles.spinButton}
                onClick={() => {
                  setStart(false);
                  setValidatedTicket(false);
                  setTicketId('');
                  setSpin(false);
                  setPrizeNumber(undefined);
                  setSpinWheelData([]);
                  setTrigger(false);
                  setStart(false);
                }}
              >
                Go Back
              </button>
            </div>
          </div>
        </>
      )}
    </Theme>
  );
};

export default Spinwheel;
