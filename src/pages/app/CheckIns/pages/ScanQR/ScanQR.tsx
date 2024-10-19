import { useEffect, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { LuCheck } from 'react-icons/lu';

import { checkInUser, mapNewCode } from '../../../../../apis/scan';
import { PreviewData } from '../../../../../apis/types';
import Loader from '../../../../../components/Loader';
import Modal from '../../../../../components/Modal/Modal';
import Scanner from '../../../../../components/Scanner/Scanner';
import SectionButton from '../../../../../components/SectionButton/SectionButton';
import Theme from '../../../../../components/Theme/Theme';
import InputField from '../../../../auth/Login/InputField';
import CheckInHeader from '../../components/CheckInHeader/CheckInHeader/CheckInHeader';
import ScanLogs from '../../components/ScanLogs/ScanLogs';
import ScannerResponseModal from '../../components/ScannerResponseModal/ScannerResponseModal';
import { LogType } from '../Venue/Venue';
import MultipleTicket from './components/MultipleTicket';
import styles from './ScanQR.module.css';
import { MapNewCode, multipleTicketCount, RoomType } from './types';

const ScanQR = () => {
  const [ticketId, setTicketId] = useState<string>('');
  const [trigger, setTrigger] = useState(false);

  const [message, setMessage] = useState<string>('');
  const [isTicketSelected, setIsTicketSelected] = useState<boolean>(false);
  const [multipleTickets, setMultipleTickets] = useState<multipleTicketCount>({
    hasMultipleTickets: false,
  });

  const [checking, setChecking] = useState<boolean>(false);
  const [roomNumber, setRoomNumber] = useState<RoomType>({
    roomNumber: sessionStorage.getItem('roomNumber') || '',
    showModel: false,
  } as RoomType);
  const [scanLogs, setScanLogs] = useState<LogType[]>([]);

  const [mappingNewCode, setMappingNewCode] = useState<MapNewCode>();
  const [newCode, setNewCode] = useState<string>('');
  const [newCodeTrigger, setNewCodeTrigger] = useState<boolean>(false);

  const [previewData, setPreviewData] = useState<PreviewData>({
    name: '',
    entry_date: '',
    tickets: {},
  });

  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);

  const eventData = JSON.parse(sessionStorage.getItem('eventData')!);

  useEffect(() => {
    if (ticketId.length > 0 && trigger) {
      checkInUser({
        ticketId,
        eventId,
        setScanLogs,
        setMessage,
        setChecking,
        setMultipleTickets,
        multipleTickets,
        setTrigger,
        roomNumber: roomNumber.roomNumber,
        setMappingNewCode,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, eventId]);

  useEffect(() => {
    if (newCode.length > 0 && mappingNewCode?.apiConfirmation) {
      mapNewCode({
        mappingNewCode,
        newCode,
        eventId,
        setMappingNewCode,
        setMessage,
      })
        .then((response) => {
          if (response) {
            setNewCode('');
            setNewCodeTrigger(false);
          }
        })
        .finally(() => {
          if (setChecking) {
            setChecking(false);
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCodeTrigger]);

  useEffect(() => {
    sessionStorage.setItem('roomNumber', roomNumber.roomNumber);
  }, [roomNumber]);

  return (
    <>
      {eventData ? (
        <Theme>
          {roomNumber.showModel && (
            <Modal
              title='Add Room Number'
              onClose={() => {
                setRoomNumber({ ...roomNumber, showModel: false });
              }}
            >
              <InputField
                id='roomNumber'
                type='text'
                name='roomNumber'
                icon={<></>}
                title='Enter Room Number'
                value={roomNumber.roomNumber}
                onChange={(e) => {
                  setRoomNumber({ ...roomNumber, roomNumber: e.target.value });
                }}
              />
              <button
                className={styles.submitButton}
                onClick={() => {
                  setRoomNumber({ ...roomNumber, showModel: false });
                }}
              >
                Confirm Room
              </button>
            </Modal>
          )}
          {eventData?.select_multi_ticket && !isTicketSelected ? (
            <>
              <div className={styles.scanContainer}>
                <CheckInHeader title='Check-In' buttonType='back' />

                <hr className={styles.line} />

                <MultipleTicket
                  tickets={eventData?.tickets}
                  setIsTicketSelected={setIsTicketSelected}
                />
              </div>
            </>
          ) : (
            <>
              <ScannerResponseModal
                message={message}
                setMessage={setMessage}
                setTicketId={setTicketId}
                setTrigger={setTrigger}
                setMultipleTickets={setMultipleTickets}
                multipleTickets={multipleTickets}
                type='checkIn'
                setMappingNewCode={setMappingNewCode}
                mappingNewCode={mappingNewCode}
              />
              {previewData && previewData.name && (
                <>
                  <div className={styles.backgroundBlur}></div>
                  <Modal title='CheckIn Confirmation'>
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
                          checkInUser({
                            ticketId,
                            eventId,
                            setScanLogs,
                            setMessage,
                            setChecking,
                            setMultipleTickets,
                            multipleTickets,
                            setTrigger,
                            setMappingNewCode,
                          });
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
                <CheckInHeader title='Check-In' buttonType='back' />

                <hr className={styles.line} />
              </div>

              {!mappingNewCode?.modalConfirmation ? (
                <Scanner
                  ticketId={ticketId}
                  setTicketId={setTicketId}
                  trigger={trigger}
                  setTrigger={setTrigger}
                  checking={checking}
                  roomNumber={roomNumber}
                  setRoomNumber={setRoomNumber}
                />
              ) : (
                <Scanner
                  ticketId={newCode}
                  setTicketId={setNewCode}
                  trigger={newCodeTrigger}
                  setTrigger={setNewCodeTrigger}
                  checking={checking}
                  type='newCode'
                />
              )}
              <ScanLogs scanLogs={scanLogs} />
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
