import Theme from '../../../../../components/Theme/Theme';
import CheckInHeader from '../../components/CheckInHeader/CheckInHeader/CheckInHeader';
import styles from './ScanQR.module.css';

import { useEffect, useState } from 'react';
import { checkInUser, getCheckInCount } from '../../../../../apis/scan';
import SectionButton from '../../../../../components/SectionButton/SectionButton';
import { CgClose } from 'react-icons/cg';
import Modal from '../../../../../components/Modal/Modal';
import { EventType, TicketType } from '../../../../../apis/types';
import { getEventInfo } from '../../../../../apis/publicpage';
import Loader from '../../../../../components/Loader';
import MultipleTicket from './components/MultipleTicket';
import Scanner from '../../../../../components/Scanner/Scanner';

const ScanQR = () => {
  const [ticketId, setTicketId] = useState<string>('');
  const [trigger, setTrigger] = useState(false);

  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [scanCount, setScanCount] = useState<number>(0);
  const [isTicketSelected, setIsTicketSelected] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType>();
  const [eventData, setEventData] = useState<EventType>();
  const { event_id: eventId } = JSON.parse(localStorage.getItem('eventData')!);

  useEffect(() => {
    if (eventId) {
      getCheckInCount(eventId, setScanCount);
      getEventInfo(eventId, setEventData);
    }

    if (ticketId.length > 0 && trigger) {
      checkInUser(ticketId, eventId, setMessage, setIsError, selectedTicket);
      setTimeout(() => {
        setTicketId('');
      }, 2000);

      setTimeout(() => {
        setMessage('');
      }, 1150);
    }
  }, [trigger, eventId]);

  return (
    <>
      {eventData ? (
        <Theme>
          {eventData?.select_multi_ticket && !isTicketSelected ? (
            <>
              <div className={styles.scanContainer}>
                <CheckInHeader buttonType='back' />

                <hr className={styles.line} />

                <MultipleTicket
                  tickets={eventData?.tickets}
                  setTicket={setSelectedTicket}
                  setIsTicketSelected={setIsTicketSelected}
                />
              </div>
            </>
          ) : (
            <>
              {message && message.length > 0 && (
                <>
                  <div className={styles.backgroundBlur}></div>
                  <Modal
                    style={
                      isError
                        ? {
                            borderBottom: '3px solid #f71e1e',
                            background: 'rgba(185, 31, 31, 0.09)',
                          }
                        : {
                            borderBottom: '3px solid #47c97e',
                            background: 'rgba(31, 185, 31, 0.09)',
                          }
                    }
                  >
                    <br />
                    <p className={styles.modalSubText}>{message}</p>
                    <SectionButton
                      buttonText='Close'
                      onClick={() => {
                        setMessage('');
                      }}
                      buttonColor='red'
                      icon={<CgClose />}
                    />
                  </Modal>
                </>
              )}

              <div className={styles.scanContainer}>
                <CheckInHeader buttonType='back' />

                <hr className={styles.line} />
              </div>

              <Scanner
                ticketId={ticketId}
                setTicketId={setTicketId}
                trigger={trigger}
                setTrigger={setTrigger}
                scanCount={scanCount}
              />
            </>
          )}
        </Theme>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ScanQR;
