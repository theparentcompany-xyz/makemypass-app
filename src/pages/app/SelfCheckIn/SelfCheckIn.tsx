import './SelfCheckIn.css';
import { SelfCheckInData } from './types';
import { useEffect, useState } from 'react';
import { getPrintData } from '../../../apis/print';
import Theme from '../../../components/Theme/Theme';
import CheckInHeader from '../CheckIns/components/CheckInHeader/CheckInHeader/CheckInHeader';
import Scanner from '../../../components/Scanner/Scanner';
import ScanLogs from '../CheckIns/components/ScanLogs/ScanLogs';
import { LogType } from '../CheckIns/pages/Venue/Venue';
import { printTicket } from './functions';

const SelfCheckIn = () => {
  const [printData, setPrintData] = useState<SelfCheckInData>({} as SelfCheckInData);

  const [ticketId, setTicketId] = useState<string>('');
  const [trigger, setTrigger] = useState(false);
  const [checking, setChecking] = useState<boolean>(false);
  const [scanLogs, setScanLogs] = useState<LogType[]>([]);

  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);

  useEffect(() => {
    if (trigger) {
      getPrintData(eventId, ticketId, setPrintData, setScanLogs, setChecking, setTrigger);
    }
  }, [trigger, eventId, ticketId]);

  useEffect(() => {
    if (printData?.qr?.url) {
      printTicket({ printData });
    }
  }, [printData]);

  return (
    <>
      {/* <div className='printableContent'></div>
      <img src={printData?.qr?.url} alt='QR Code' />
      {printData?.data?.map((item: DataItem, index: number) => (
        <p key={index} style={{ fontSize: item.fontSize }}>
          {item.value}
        </p>
      ))}
      <button
        className='printButton'
        onClick={() => {
          printTicket({ printData });
        }}
      >
        Print
      </button> */}
      <Theme>
        <CheckInHeader title='Check-In' buttonType='back' />

        <Scanner
          ticketId={ticketId}
          setTicketId={setTicketId}
          trigger={trigger}
          setTrigger={setTrigger}
          checking={checking}
        />

        <ScanLogs scanLogs={scanLogs} />
      </Theme>
    </>
  );
};

export default SelfCheckIn;
