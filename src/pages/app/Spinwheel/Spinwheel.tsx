import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { Wheel } from 'react-custom-roulette';
import { WheelData } from 'react-custom-roulette/dist/components/Wheel/types';

import { getSpinWheelData, spinTheWheel } from '../../../apis/gifts';
import Modal from '../../../components/Modal/Modal';
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
  const [popPrize, setPopPrize] = useState<boolean>(false);
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
  }, [eventId, start, ticketId, trigger]);

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
                      acc.push({ option: curr.name.toUpperCase() });
                      return acc;
                    },
                    [],
                  ) as WheelData[]
                }
                onStopSpinning={() => {
                  setSpin(false);
                  setPopPrize(true);
                }}
                fontFamily='Inter'
                fontWeight={600}
                perpendicularText={(spinWheelData?.length ?? 0) > 3 ? false : true}
                backgroundColors={[
                  '#FF6347', // Tomato
                  '#32CD32', // Lime Green
                  '#8A2BE2', // Blue Violet
                  '#FF4500', // Orange Red
                  '#87CEEB', // Sky Blue
                  '#1d2e44', // Dark Blue
                  '#db8150', // Orange
                  '#ecdf6a',
                ]}
                textColors={['#1d2e44', 'rgb(225, 225, 225)']}
                radiusLineColor='rgb(224, 225, 228)'
                innerBorderColor='rgb(224, 225, 228)'
                outerBorderColor='rgb(224, 225, 228)'
                textDistance={50}
                fontSize={(spinWheelData?.length ?? 0) > 3 ? 15 : 20}
              />
              <button className={styles.spinButtonWheel} onClick={() => onSpin()}>
                GO
              </button>
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
      {popPrize && (
        <>
          <Modal>
            <div className={styles.prizePopup}>
              <h2>
                {spinWheelData?.[prizeNumber!].name.toLowerCase().includes('better luck')
                  ? `Oh No! `
                  : `Congratulations!`}
              </h2>
              <p>
                {spinWheelData?.[prizeNumber!].name.toLowerCase().includes('better luck')
                  ? `${spinWheelData?.[prizeNumber!].name}`
                  : `You've won ${spinWheelData?.[prizeNumber!].name}!`}
              </p>
              <button
                onClick={() => {
                  setPopPrize(false);
                  setStart(false);
                  setValidatedTicket(false);
                  setTicketId('');
                  setSpin(false);
                  setPrizeNumber(undefined);
                  setSpinWheelData([]);
                  setTrigger(false);
                  setStart(false);
                }}
                className={styles.closeButton}
              >
                Close
              </button>
            </div>
          </Modal>
          <Confetti
            drawShape={(ctx) => {
              ctx.beginPath();
              for (let i = 0; i < 22; i++) {
                const angle = 0.35 * i;
                const x = (0.2 + 1.5 * angle) * Math.cos(angle);
                const y = (0.2 + 1.5 * angle) * Math.sin(angle);
                ctx.lineTo(x, y);
              }
              ctx.stroke();
              ctx.closePath();
            }}
          />
        </>
      )}
    </Theme>
  );
};

export default Spinwheel;
