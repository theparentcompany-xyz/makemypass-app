import { useEffect, useState } from 'react';
import styles from './Perks.module.css';
import Theme from '../../../../../components/Theme/Theme';
import CheckInHeader from '../../components/CheckInHeader/CheckInHeader/CheckInHeader';
import { getPerksInfo, getUserPerksInfo, updatePerk } from '../../../../../apis/perks';
import { getEventId } from '../../../../../apis/events';
import { useParams } from 'react-router';
import SectionButton from '../../../../../components/SectionButton/SectionButton';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import { QrScanner } from '@yudiel/react-qr-scanner';
import toast from 'react-hot-toast';

const Perks = () => {
  const [perks, setPerks] = useState([]);
  const [ticketId, setTicketId] = useState('');
  const [trigger, setTrigger] = useState(false);
  const [selectedPerk, setSelectedPerk] = useState('' as string);

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
    getPerksInfo(eventId, setPerks);
  }, []);

  useEffect(() => {
    if (trigger) {
      getUserPerksInfo(ticketId);
      updatePerk(ticketId, selectedPerk);
    }
  }, [trigger]);

  return (
    <>
      <Theme>
        <div className={styles.perksContainer}>
          <CheckInHeader buttonType='back' />
          <hr className={styles.line} />
          <p className={styles.perksHeading}>Available Perks</p>
          {selectedPerk == '' ? (
            <div className={styles.listPerksContainer}>
              {perks.map((perk) => {
                return (
                  <div className={styles.perk}>
                    <SectionButton
                      buttonText={perk}
                      onClick={() => {
                        setSelectedPerk(perk);
                      }}
                    />
                  </div>
                );
              })}
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
                        setSelectedPerk('');
                      }}
                    />
                  </div>
                  <div className={styles.closeButton}>
                    <SecondaryButton
                      buttonText='Close'
                      onClick={() => {
                        setSelectedPerk('');
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
