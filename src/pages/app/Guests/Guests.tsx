import { useEffect, useState } from 'react';
import Theme from '../../../components/Theme/Theme';
import Glance from '../Overview/components/Glance/Glance';
import Header from '../Overview/components/Header/Header';
import styles from './Guests.module.css';
import { connectPrivateSocket } from '../../../../services/apiGateway';
import { makeMyPassSocket } from '../../../../services/urls';
import { useParams } from 'react-router-dom';
import { guests } from './types';
import { getEventId } from '../../../apis/events';
import { RiSearchLine } from 'react-icons/ri';
import { HashLoader } from 'react-spinners';
import Table from '../../../components/Table/Table';
import { transformTableData } from '../../../common/commonFunctions';
import { TableType } from '../../../components/Table/types';

const Guests = () => {
  const [guests, setGuests] = useState<guests[]>([]);
  const [guestsTableData, setGuestsTableData] = useState<TableType[]>([]);
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
  }, [eventId]);

  useEffect(() => {
    const guestsTableMapping = {
      name: 'name',
      email: 'email',
      category: 'category',
      registered_at: 'date',
    };

    if (guests) {
      const transformedData = transformTableData(guestsTableMapping, guests);

      setGuestsTableData(transformedData as TableType[]);
    }
  }, [guests]);

  return (
    <Theme>
      {guests && guests.length > 0 ? (
        <div className={styles.guestsContainer}>
          <Header />

          <Glance tab='guests' />

          <div className={styles.guests}>
            <div className={styles.tableHeader}>
              <p className={styles.tableHeading}>Guests List</p>

              {/* <SecondaryButton buttonText='All Guests ➞' /> */}
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

            <Table
              tableHeading='Recent Guests'
              tableData={guestsTableData}
              search={searchKeyword}
            />
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
