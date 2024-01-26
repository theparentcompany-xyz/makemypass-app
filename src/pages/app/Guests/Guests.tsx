import { useEffect, useState } from 'react';
import Theme from '../../../components/Theme/Theme';
import Glance from '../Overview/components/Glance/Glance';
import Header from '../Overview/components/Header/Header';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import styles from './Guests.module.css';
import { connectPrivateSocket } from '../../../../services/apiGateway';
import { makeMyPassSocket } from '../../../../services/urls';
import { useParams } from 'react-router-dom';
import { guests } from './types';
import { getEventId } from '../../../apis/events';
import { RiSearchLine } from 'react-icons/ri';
import { HashLoader } from 'react-spinners';

const Guests = () => {
  const [guests, setGuests] = useState<guests[]>([]);

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

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
    return () => {
      socket?.close();
    };
  });

  useEffect(() => {
    if (eventId)
      connectPrivateSocket({
        url: makeMyPassSocket.listGuests(eventId),
      }).then((ws) => {
        ws.onmessage = (event) => {
          if (JSON.parse(event.data).response.guests)
            setGuests(JSON.parse(event.data).response.guests);
        };

        setSocket(ws);
      });
  });

  return (
    <Theme>
      {guests ? (
        <div className={styles.guestsContainer}>
          <Header />

          <Glance tab='guests' />

          <div className={styles.guests}>
            <div className={styles.tableHeader}>
              <p className={styles.tableHeading}>Guests List</p>

              <SecondaryButton buttonText='All Guests ➞' />
            </div>
            <div className={styles.searchInput}>
              <RiSearchLine color='#5F6063' />
              <input
                onChange={(event) => {
                  setSearchKeyword(event.target.value);
                }}
                placeholder='Search'
                type='text'
              />
            </div>

            <div className={styles.tableContainer}>
              <div className={styles.table}>
                {guests
                  .filter((data) => {
                    const { name, email } = data;
                    const keyword = searchKeyword.toLowerCase();
                    return (
                      name.toLowerCase().includes(keyword) || email.toLowerCase().includes(keyword)
                    );
                  })
                  .map((data, index) => {
                    return (
                      <div key={index} className={styles.row}>
                        <div className={styles.rowData}>
                          <p className={styles.rowName}>{data.name}</p>
                          <p className={styles.rowEmail}>{data.email}</p>
                        </div>
                        <div className={styles.rowData}>
                          <p className={styles.rowType}>{data.category}</p>
                          <p className={styles.rowDate}>{data.registered_at}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.center}>
          <HashLoader color={'#46BF75'} size={50} />
        </div>
      )}
    </Theme>
  );
};

export default Guests;
