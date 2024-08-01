import styles from './Gifts.module.css';
import Theme from '../../../components/Theme/Theme';
import Header from '../../../components/Header/Header';
import { useEffect, useState } from 'react';
import { claimUserGift, getUserGitfs } from '../../../apis/gifts';
import Scanner from '../../../components/Scanner/Scanner';
import SectionButton from '../../../components/SectionButton/SectionButton';
import { Gift, GiftsType } from './types';
import Modal from '../../../components/Modal/Modal';
const Gifts = () => {
  const [ticketId, setTicketId] = useState<string>('');
  const [trigger, setTrigger] = useState<boolean>(false);

  const [gifts, setGifts] = useState<GiftsType>({} as GiftsType);

  const [selectedGift, setSelectedGift] = useState<Gift>({} as Gift);

  const eventId = JSON.parse(sessionStorage.getItem('eventData')!).event_id;
  useEffect(() => {
    if (ticketId.length > 0) getUserGitfs(eventId, ticketId, setGifts);
  }, [trigger]);
  return (
    <>
      <Theme>
        {selectedGift && selectedGift.id?.length > 0 && (
          <Modal
            title='Claim Gift'
            onClose={() => {
              setSelectedGift({} as Gift);
            }}
          >
            <p className={styles.modalHeader}>Are you sure you want to claim this gift?</p>
            <p className={styles.modalDescription}>
              By clicking the claim button, you will claim the gift and it will be removed from your
              unclaimed gifts list.
            </p>

            <div className={styles.modalButtons}>
              <button
                className={styles.confirmButton}
                onClick={() => {
                  claimUserGift(eventId, selectedGift, ticketId).then(() => {
                    getUserGitfs(eventId, ticketId, setGifts);
                    setSelectedGift({} as Gift);
                  });
                }}
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setSelectedGift({} as Gift);
                }}
                className={styles.confirmButton}
              >
                Cancel
              </button>
            </div>
          </Modal>
        )}
        <div className={styles.giftsContainer}>
          <Header />

          <Scanner
            ticketId={ticketId}
            setTicketId={setTicketId}
            setTrigger={setTrigger}
            trigger={trigger}
          />
        </div>

        <div className={styles.listUserGifts}>
          {gifts.unclaimedGifts && gifts.unclaimedGifts.length > 0 && (
            <div>
              <p className={styles.giftsTitle}>Unclaimed Gifts</p>
              <p className={styles.giftsDescription}>
                You have unclaimed gifts. Click on the button to claim your gift.
              </p>
              {gifts.unclaimedGifts.map((gift) => (
                <SectionButton
                  buttonText={gift.name}
                  key={gift.id}
                  onClick={() => {
                    setSelectedGift(gift);
                  }}
                />
              ))}
            </div>
          )}
          {gifts.claimedGifts && gifts.claimedGifts.length > 0 && (
            <div>
              <p className={styles.giftsTitle}>Claimed Gifts</p>
              <p className={styles.giftsDescription}>
                These are the gifts you have already claimed.
              </p>

              <div
                style={{
                  opacity: 0.5,
                }}
              >
                {gifts.claimedGifts.map((gift) => (
                  <SectionButton buttonText={gift.name} key={gift.id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </Theme>
    </>
  );
};

export default Gifts;
