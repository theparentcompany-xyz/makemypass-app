import Theme from '../../../../../components/Theme/Theme';
import CheckInHeader from '../../components/CheckInHeader/CheckInHeader/CheckInHeader';
import styles from './ScanQR.module.css';

import { useEffect, useState } from 'react';
import { checkInUser, getCheckInCount, preview } from '../../../../../apis/scan';
import SectionButton from '../../../../../components/SectionButton/SectionButton';
import { CgClose } from 'react-icons/cg';
import Modal from '../../../../../components/Modal/Modal';
import { PreviewData, TicketType } from '../../../../../apis/types';
import Loader from '../../../../../components/Loader';
import MultipleTicket from './components/MultipleTicket';
import Scanner from '../../../../../components/Scanner/Scanner';
import { LuCheck } from 'react-icons/lu';

const ScanQR = () => {
  const [ticketId, setTicketId] = useState<string>('');
  const [trigger, setTrigger] = useState(false);

  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [scanCount, setScanCount] = useState<number>(0);
  const [isTicketSelected, setIsTicketSelected] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType>();

  const [previewData, setPreviewData] = useState<PreviewData>({
    name: '',
    entry_date: '',
    tickets: {},
  });

  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);

  const eventData = JSON.parse(sessionStorage.getItem('eventData')!);

  useEffect(() => {
    if (eventId) {
      getCheckInCount(eventId, setScanCount);
    }

    if (ticketId.length > 0 && trigger) {
      preview(eventId, ticketId, setPreviewData);

      setTimeout(() => {
        setMessage('');
      }, 2250);
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

              {previewData && previewData.name && (
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
                    <div className={styles.previewDataContainer}>
                      <p className={styles.previewDataText}> {previewData.name}</p>
                      <p className={styles.previewDataText}>Entry Date: {previewData.entry_date}</p>
                      {previewData.tickets &&
                        Object.keys(previewData.tickets).map((key) => (
                          <p className={styles.previewDataText}>
                            {[key]}: {previewData.tickets[key]} Tickets
                          </p>
                        ))}
                    </div>
                    <div className={styles.buttonsContainer}>
                      <SectionButton
                        buttonText='Close'
                        onClick={() => {
                          setPreviewData({
                            name: '',
                            entry_date: '',
                            tickets: {},
                          });
                        }}
                        buttonColor='red'
                        icon={<CgClose />}
                      />
                      <SectionButton
                        buttonText='Confirm'
                        onClick={() => {
                          setPreviewData({
                            name: '',
                            entry_date: '',
                            tickets: {},
                          });
                          checkInUser(ticketId, eventId, setMessage, setIsError, selectedTicket);
                          setTicketId('');
                        }}
                        buttonColor='red'
                        icon={<LuCheck />}
                      />
                    </div>
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
