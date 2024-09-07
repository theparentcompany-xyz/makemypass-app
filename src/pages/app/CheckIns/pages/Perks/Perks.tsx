import { useEffect, useState } from 'react';
import Theme from '../../../../../components/Theme/Theme';
import styles from './Perks.module.css';
import { claimUserPerk, getScanPerkList } from '../../../../../apis/perks';
import EventHeader from '../../../../../components/EventHeader/EventHeader';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import Scanner from '../../../../../components/Scanner/Scanner';
import ScanLogs from '../../components/ScanLogs/ScanLogs';
import { LogType } from '../Venue/Venue';
import Modal from '../../../../../components/Modal/Modal';
import { formatDate } from '../../../../../common/commonFunctions';
import { TicketPerkType } from './types';

const Perks = () => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);

  const [availablePerks, setAvailablePerks] = useState<TicketPerkType[]>([]);
  const [selectedPerk, setSelectedPerk] = useState<{
    id: string;
    name: string;
  }>({
    id: '',
    name: '',
  });
  const [ticketId, setTicketId] = useState<string>('');
  const [trigger, setTrigger] = useState(false);

  const [checking, setChecking] = useState<boolean>(false);
  const [scanLogs, setScanLogs] = useState<LogType[]>([]);
  const [exhaustHistory, setExhaustHistory] = useState<string[]>([]);

  useEffect(() => {
    getScanPerkList(eventId, setAvailablePerks);
  }, [eventId]);

  useEffect(() => {
    if (ticketId.length > 0 && trigger) {
      claimUserPerk(
        eventId,
        ticketId,
        selectedPerk.id,
        setScanLogs,
        setChecking,
        setTrigger,
        setExhaustHistory,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, eventId]);

  return (
    <>
      <Theme>
        {exhaustHistory.length > 0 && (
          <Modal title='Previous Claims' onClose={() => setExhaustHistory([])}>
            <div className={styles.exhaustHistoryContainer}>
              <p className={styles.modalHeading}>Perk {selectedPerk.name}</p>
              <p className={styles.modalDescription}>You have already claimed the this perk at</p>
              {exhaustHistory.map((history, index) => (
                <div key={history} className={styles.exhaustHistoryItem}>
                  <p
                    className={styles.exhaustHistoryItemDate}
                  >{`${index + 1}. ${formatDate(history, true)}`}</p>
                </div>
              ))}
            </div>
          </Modal>
        )}

        <EventHeader previousPageNavigate='-1' />

        {!selectedPerk.id && (
          <div className={styles.perkClaimContainer}>
            <div className={styles.perkClaimBody}>
              {availablePerks.map(
                (perk) =>
                  perk.perks.length > 0 && (
                    <div key={perk.ticket_id} className={styles.perkClaimItem}>
                      <h2 className={styles.perkClaimItemHeading}>{perk.ticket_name}</h2>
                      <div className={styles.perkClaimItemContent}>
                        {perk.perks.map((perkItem) => (
                          <div key={perkItem.id} className={styles.perkClaimItemContentItem}>
                            <div className='row'>
                              <p className={styles.perkClaimItemContentItemName}>{perkItem.name}</p>
                              <p className={styles.perkClaimItemContentItemCount}>
                                {perkItem.count}/Ticket
                              </p>
                            </div>
                            <SecondaryButton
                              buttonText='Claim'
                              onClick={() => {
                                setSelectedPerk({
                                  id: perkItem.id,
                                  name: perkItem.name,
                                });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
              )}
            </div>
          </div>
        )}

        {selectedPerk.id && (
          <div className={styles.scannerContainer}>
            <div className={styles.pageTexts}>
              <p className={styles.pageHeading}>Selected Perk: {selectedPerk.name}</p>
            </div>

            <Scanner
              ticketId={ticketId}
              setTicketId={setTicketId}
              trigger={trigger}
              setTrigger={setTrigger}
              checking={checking}
              onClose={() => {
                setSelectedPerk({
                  id: '',
                  name: '',
                });
              }}
            />

            <ScanLogs scanLogs={scanLogs} />
          </div>
        )}
      </Theme>
    </>
  );
};

export default Perks;
