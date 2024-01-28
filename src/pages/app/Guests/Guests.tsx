import { useEffect, useState } from 'react';
import Theme from '../../../components/Theme/Theme';
import Glance from '../../../components/Glance/Glance';
import Header from '../../../components/EventHeader/EventHeader';
import styles from './Guests.module.css';
import { connectPrivateSocket } from '../../../../services/apiGateway';
import { makeMyPassSocket } from '../../../../services/urls';
import { useParams } from 'react-router-dom';
import { guests, resentTicket } from './types';
import { getEventId } from '../../../apis/events';
import { RiSearchLine } from 'react-icons/ri';
import { HashLoader } from 'react-spinners';
import Table from '../../../components/Table/Table';
import { transformTableData } from '../../../common/commonFunctions';
import { TableType } from '../../../components/Table/types';
import { resentEventTicket } from '../../../apis/guests';

const Guests = () => {
  const [guests, setGuests] = useState<guests[]>([]);
  const [guestsTableData, setGuestsTableData] = useState<TableType[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [resentTicket, setResentTicket] = useState<resentTicket>({
    status: false,
    guestId: '',
    name: '',
  });

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
      id: 'id',
      name: 'name',
      email: 'email',
      category: 'category',
      registered_at: 'date',
    };

    if (guests) {
      const transformedData = transformTableData(guestsTableMapping, guests);

      setGuestsTableData(transformedData as TableType[]);

      console.log(transformedData);
    }
  }, [guests]);

  const handleTicketResend = () => {
    resentEventTicket(resentTicket, setResentTicket);
  };

  return (
    <Theme>
      {guests && guests.length > 0 ? (
        <>
          {resentTicket && resentTicket.status && (
            <dialog className={styles.onClickModal}>
              <p className={styles.modalHeader}>Resend Ticket</p>
              <p className={styles.modalSubText}>
                Are you sure to resent ticket to{' '}
                <span
                  style={{
                    fontWeight: '500',
                    color: '#47C97E',
                  }}
                >
                  {resentTicket.name}
                </span>
              </p>
              <div className={styles.buttons}>
                <p
                  onClick={() => {
                    handleTicketResend();
                  }}
                  className={styles.button}
                >
                  Resend
                </p>
                <p
                  onClick={() => {
                    setResentTicket((prevState) => ({
                      ...prevState,
                      status: false,
                    }));
                  }}
                  className={styles.button}
                >
                  Cancel
                </p>
              </div>
            </dialog>
          )}
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
                setResentTicket={setResentTicket}
              />
            </div>
          </div>
        </>
      ) : (
        <div className={styles.center}>
          <HashLoader color={'#46BF75'} size={50} />
        </div>
      )}
    </Theme>
  );
};

export default Guests;
