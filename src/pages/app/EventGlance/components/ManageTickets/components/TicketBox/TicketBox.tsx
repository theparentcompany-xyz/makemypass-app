import styles from './TicketBox.module.css';
import Slider from '../../../../../../../components/SliderButton/Slider';
import { TicketType } from '../../../../../../../apis/types';

type Props = {
  ticketInfo: TicketType;
  onClick: () => void;
  selected: boolean;
  closeTicket: (ticketInfo: TicketType) => void;
};

const TicketBox = ({ ticketInfo, onClick, selected, closeTicket }: Props) => {
  return (
    <>
      <div className={`${styles.ticketBox} ${selected ? styles.selected : ''}`} onClick={onClick}>
        <div className={styles.ticket}></div>
        <div className={styles.ticketInfo}>
          <p className={styles.ticketName}>{ticketInfo.title}</p>
          <p className={styles.ticketType}>
            1000 / {ticketInfo.capacity || ' Unlimited'} <br />
            Registered
          </p>
        </div>
        <div className={styles.ticketFooter}>
          <div className={styles.ticketFooterLeft}>
            {' '}
            <span className={styles.availableDot}></span>Available
          </div>
          <div className={styles.ticketFooterRight}>
            <label className={styles.closeTicketLabel}>Close Ticket</label>
            <Slider
              checked={!ticketInfo.is_active}
              onChange={() => {
                closeTicket(ticketInfo);
              }}
              sliderStyle={{ transform: 'scale(0.7)' }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketBox;
