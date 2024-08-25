import { useEffect, useState } from 'react';
import Theme from '../../../../../components/Theme/Theme';
import styles from './Perks.module.css';
import { claimUserPerk, getScanPerkList } from '../../../../../apis/perks';
import EventHeader from '../../../../../components/EventHeader/EventHeader';
import { TicketPerkType } from './types';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import Scanner from '../../../../../components/Scanner/Scanner';
import ScanLogs from '../../components/ScanLogs/ScanLogs';
import { LogType } from '../Venue/Venue';

const Perks = () => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);

  const [availablePerks, setAvailablePerks] = useState<TicketPerkType[]>([]);
  const [selectedPerk, setSelectedPerk] = useState<string>('');
  const [ticketId, setTicketId] = useState<string>('');
  const [trigger, setTrigger] = useState(false);

  const [checking, setChecking] = useState<boolean>(false);
  const [scanLogs, setScanLogs] = useState<LogType[]>([]);

  useEffect(() => {
    getScanPerkList(eventId, setAvailablePerks);
  }, [eventId]);

  useEffect(() => {
    if (ticketId.length > 0 && trigger) {
      claimUserPerk(eventId, ticketId, selectedPerk, setScanLogs, setChecking, setTrigger);
    }
  }, [trigger, eventId]);

  return (
    <>
      <Theme>
        <EventHeader previousPageNavigate='-1' />

        {!selectedPerk && (
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
                                setSelectedPerk(perkItem.id);
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

        {selectedPerk && (
          <div className={styles.scannerContainer}>
            <Scanner
              ticketId={ticketId}
              setTicketId={setTicketId}
              trigger={trigger}
              setTrigger={setTrigger}
              checking={checking}
              onClose={() => {
                setSelectedPerk('');
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
