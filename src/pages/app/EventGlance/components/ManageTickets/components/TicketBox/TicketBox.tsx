import styles from './TicketBox.module.css';
import { TicketType } from '../../../../../../../apis/types';

type Props = {
  ticketInfo: TicketType;
  onClick: () => void;
  selected: boolean;
};

const TicketBox = ({ ticketInfo, onClick, selected }: Props) => {
  return (
    <>
      <div className={`${styles.ticketBox} ${selected ? styles.selected : ''}`} onClick={onClick}>
        <div className={styles.ticket}></div>
        <div className={styles.ticketInfo}>
          <p className={styles.ticketName}>{ticketInfo.title}</p>
          <p className={styles.ticketType}>
            {ticketInfo.registration_count ? ticketInfo.registration_count : 'None'}
            {ticketInfo.capacity ? '/' + ticketInfo.capacity : ''} <br />
            Registered
          </p>
        </div>
        <div className={styles.ticketFooter}>
          <div className={styles.ticketFooterLeft}>
            {' '}
            <span
              className={styles.availableDot + ' ' + (!ticketInfo.is_active && styles.unavailable)}
            ></span>
            Available
          </div>
          <div className={styles.ticketFooterRight}>
            {/* <label className={styles.closeTicketLabel}>Close Ticket</label>
            <Slider
              checked={!ticketInfo.is_active}
              onChange={() => {
                closeTicket(ticketInfo);
              }}
              sliderStyle={{ transform: 'scale(0.7)' }}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketBox;
