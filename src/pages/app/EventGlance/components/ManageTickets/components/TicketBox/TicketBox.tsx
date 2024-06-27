import styles from './TicketBox.module.css';
import { TicketType } from '../../../../../../../apis/types';

type Props = {
  ticketInfo: TicketType;
  onClick: () => void;
  selected: boolean;
  closed: boolean;
};

const TicketBox = ({ ticketInfo, onClick, selected, closed }: Props) => {
  return (
    <>
      <div className={`${styles.ticketBox} ${selected ? styles.selected : ''}`} onClick={onClick}>
        <div className={styles.ticket}></div>
        <div className={styles.ticketInfo}>
          <p className={styles.ticketName}>{ticketInfo.title}</p>
          <p className={styles.ticketType}>
            {ticketInfo.registration_count}
            {ticketInfo.capacity ? '/' + ticketInfo.capacity : ''} <br />
            Registered
          </p>
        </div>
        <div className={styles.ticketFooter}>
          <div className={styles.ticketFooterLeft}>
            {' '}
            <span
              className={
                styles.availableDot +
                ' ' +
                ((closed ||
                  (ticketInfo?.capacity &&
                    ticketInfo?.registration_count >= ticketInfo?.capacity)) &&
                  styles.unavailable)
              }
            ></span>
            {(closed ||
              (ticketInfo?.capacity && ticketInfo?.registration_count >= ticketInfo?.capacity)) &&
              'Not '}
            Available
          </div>
          <div className={styles.ticketFooterRight}>
            {/* <label className={styles.closeTicketLabel}>Default Selected</label>
            <Slider
              checked={!ticketInfo.default_selected}
              onChange={() => {
                 handleTicketDefaultSelect(ticketInfo);
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
