import React, { useEffect, useState } from 'react';
import styles from './Perks.module.css';
import Theme from '../../../../../components/Theme/Theme';
import CheckInHeader from '../../components/CheckInHeader/CheckInHeader/CheckInHeader';
import { getPerksInfo, getUserPerksInfo } from '../../../../../apis/perks';
import { getEventId } from '../../../../../apis/events';
import { useParams } from 'react-router';
import { CgClose } from 'react-icons/cg';
import SectionButton from '../../../../../components/SectionButton/SectionButton';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import { QrScanner } from '@yudiel/react-qr-scanner';
import toast from 'react-hot-toast';

const Perks = () => {
  const [tickets, setTickets] = useState([]);
  const [currentTicketType, setCurrentTicketType] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [trigger, setTrigger] = useState(false);

  const getLocalEventId = () => {
    if (eventTitle) {
      const eventData = JSON.parse(localStorage.getItem('eventData') as string);

      if (eventData) {
        if (eventData.event_name !== eventTitle) {
          localStorage.removeItem('eventData');
          getEventId(eventTitle);
        } else {
          return eventData.event_id;
        }
      }
    }
  };

  const { eventTitle } = useParams<{ eventTitle: string }>();
  const eventId = getLocalEventId();

  useEffect(() => {
    getPerksInfo(eventId, setTickets);
  }, []);

  useEffect(() => {
    if (trigger) {
      getUserPerksInfo(ticketId);
      setCurrentTicketType('');
    }
  }, [trigger]);

  const renderPerks = (perks: { [s: string]: unknown } | ArrayLike<unknown>, id: string) => {
    return Object.entries(perks).map(([perk]) => (
      <div className={styles.perkButton}>
        <SectionButton
          onClick={() => {
            setCurrentTicketType(id);
          }}
          buttonText={`${perk}`}
          buttonColor=''
        />
      </div>
    ));
  };

  return (
    <>
      <Theme>
        <div className={styles.perksContainer}>
          <CheckInHeader buttonType='back' />
          <hr className={styles.line} />
          {currentTicketType == '' ? (
            <div className={styles.listPerksContainer}>
              {Object.keys(tickets).map((ticketName: any, index: number) => (
                <div key={index}>
                  <p className={styles.ticketName}>{ticketName}</p>
                  <div className={styles.perksButtons}>
                    {renderPerks(
                      (tickets[ticketName] as any).perks,
                      (tickets[ticketName] as any).id,
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.scannerContainer}>
              <p className={styles.scanHeader}>Scan QR Code Below</p>
              <div className={styles.scannerOuterContainer}>
                <div className={styles.scanner}>
                  <div className={styles.closeButton}>
                    <SecondaryButton
                      buttonText='Close'
                      onClick={() => {
                        setCurrentTicketType('');
                      }}
                    />
                  </div>
                  <QrScanner
                    containerStyle={{
                      backgroundColor: '#000',
                    }}
                    onResult={(result) => {
                      setTicketId(result.getText());

                      if (result.getText().length > 0 && result.getText() !== ticketId) {
                        setTrigger(true);
                      }
                    }}
                    onError={(error) => {
                      toast.error(error.message);
                    }}
                  />
                </div>
              </div>

              <div className={styles.inputContainer}>
                <br />
                <p className={styles.inputText}>Or Enter Code Below</p>
                <input
                  className={styles.input}
                  placeholder='Enter Ticket Code'
                  value={ticketId}
                  onChange={(e) => {
                    setTicketId(e.target.value);

                    if (trigger) {
                      setTrigger(false);
                    }
                  }}
                />
                <SecondaryButton
                  buttonText='Check In'
                  onClick={() => {
                    setTrigger(true);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Theme>
    </>
  );
};

export default Perks;
