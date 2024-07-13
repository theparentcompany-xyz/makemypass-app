// ! POSTPONDED: Feature not available in the current version
// * This feature is not available in the current version of the app

import { useEffect, useState } from 'react';
import styles from './Perks.module.css';
import Theme from '../../../../../components/Theme/Theme';
import CheckInHeader from '../../components/CheckInHeader/CheckInHeader/CheckInHeader';
import { getUserPerksInfo, updatePerk } from '../../../../../apis/perks';
import SectionButton from '../../../../../components/SectionButton/SectionButton';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import { QrScanner } from '@yudiel/react-qr-scanner';
import toast from 'react-hot-toast';
import { CgClose } from 'react-icons/cg';
import Modal from '../../../../../components/Modal/Modal';

const Perks = () => {
  const [perks, setPerks] = useState([]);
  const [ticketId, setTicketId] = useState('');
  const [trigger, setTrigger] = useState(false);
  const [selectedPerk, setSelectedPerk] = useState('' as string);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);

  useEffect(() => {
    // if (eventId) getPerksInfo(eventId, setPerks);
    setPerks([]);
  }, [eventId]);

  useEffect(() => {
    if (trigger) {
      getUserPerksInfo(ticketId);
      updatePerk(ticketId, selectedPerk, setMessage, setIsError);
    }
  }, [trigger]);

  return (
    <>
      <Theme>
        {message && message.length > 0 && (
          <>
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
        <div className={styles.perksContainer}>
          <CheckInHeader title='Perks' buttonType='back' />
          <hr className={styles.line} />
          {perks.length > 0 ? (
            <p className={styles.perksHeading}>Available Perks</p>
          ) : (
            <p className={styles.perksHeading}>No Perks Available</p>
          )}
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
                        setTicketId('');
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
