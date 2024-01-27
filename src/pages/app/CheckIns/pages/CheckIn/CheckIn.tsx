import Theme from '../../../../../components/Theme/Theme';
import Header from '../../../Overview/components/Header/Header';
import styles from './CheckIn.module.css';
import { RiSearchLine } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { guests } from './types';
import CheckInHeader from '../../components/CheckInHeader/CheckInHeader/CheckInHeader';
import { useParams } from 'react-router-dom';
import { getEventId } from '../../../../../apis/events';
import { connectPrivateSocket } from '../../../../../../services/apiGateway';
import { makeMyPassSocket } from '../../../../../../services/urls';
import { transformTableData } from '../../../../../common/commonFunctions';
import { TableType } from '../../../../../components/Table/types';
import Table from '../../../../../components/Table/Table';

const CheckIn = () => {
  const [recentRegistrations, setRecentRegistrations] = useState<guests[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [recentTableData, setRecentTableData] = useState<TableType[]>([]);
  const [eventId, setEventId] = useState<string>('');
  const { eventTitle } = useParams<{ eventTitle: string }>();

  useEffect(() => {
    let eventData = JSON.parse(localStorage.getItem('eventData') as string);

    if (!eventData)
      setTimeout(() => {
        eventData = JSON.parse(localStorage.getItem('eventData') as string);

        if (eventData) {
          if (eventData.event_name !== eventTitle) {
            localStorage.removeItem('eventData');
            getEventId(eventTitle ?? '');
          } else {
            setEventId(eventData.event_id);
          }
        }
      }, 2000);

    setEventId(eventData?.event_id);
  }, [eventTitle]);

  useEffect(() => {
    if (eventId)
      connectPrivateSocket({
        url: makeMyPassSocket.listCheckinGuests(eventId),
      }).then((ws) => {
        ws.onmessage = (event) => {
          if (JSON.parse(event.data).response.datas)
            setRecentRegistrations(JSON.parse(event.data).response.datas);
          else if (JSON.parse(event.data).response.data) {
            const newRegistration = JSON.parse(event.data).response.data;

            setRecentRegistrations((prev) => {
              const updatedRegistrations = [newRegistration, ...prev];

              return updatedRegistrations;
            });
          }
        };

        setSocket(ws);
      });
  }, [eventId]);

  useEffect(() => {
    return () => {
      socket?.close();
    };
  });

  useEffect(() => {
    const recentTableMapping = {
      name: 'name',
      email: 'email',
      category: 'category',
      registered_at: 'date',
    };

    if (recentRegistrations) {
      const transformedRecentRegistrations = transformTableData(
        recentTableMapping,
        recentRegistrations,
      );
      setRecentTableData(transformedRecentRegistrations as TableType[]);
    }
  }, [recentRegistrations]);

  return (
    <Theme>
      <div className={styles.checkInContainer}>
        <Header />

        <CheckInHeader currentCount={recentRegistrations.length} />

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

        <Table tableHeading='Recent CheckIns' tableData={recentTableData} search={searchKeyword} />
      </div>
    </Theme>
  );
};

export default CheckIn;
