import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';

import { listSubEventGuests } from '../../../../../apis/subevents';
import EventHeader from '../../../../../components/EventHeader/EventHeader';
import Table from '../../../../../components/Table/Table';
import { TableType } from '../../../../../components/Table/types';
import Theme from '../../../../../components/Theme/Theme';
import { PaginationDataType } from '../../../Guests/types';
import styles from './SubEventDashboard.module.css';

const SubEventDashboard = () => {
  const eventId = JSON.parse(sessionStorage.getItem('eventData')!).event_id;
  const { subEventId } = useParams<{ subEventId: string }>();

  const location = useLocation();

  const { subevent } = location.state;

  const [subEventGuests, setSubEventGuests] = useState<TableType[]>([]);
  const [paginationData, setPaginationData] = useState<PaginationDataType>({
    page: 1,
    total_pages: 0,
    total_items: 0,
    per_page: 30,
    next: null,
    previous: null,
    fetchingData: false,
    searchKeyword: '',
  });

  useEffect(() => {
    if (subEventId && eventId)
      listSubEventGuests(eventId, subEventId, setSubEventGuests, setPaginationData);
  }, [eventId, subEventId]);

  return (
    <Theme>
      <div className={styles.mainContainer}>
        <EventHeader previousPageNavigate='-1' />
        <p className={styles.subEventHeading}>{subevent.title}</p>
        <p className={styles.helperText}>These are registered guests for the event</p>
        <Table
          tableHeading='Registered Guests'
          tableData={subEventGuests}
          paginationData={paginationData}
          setPaginationData={setPaginationData}
        />
      </div>
    </Theme>
  );
};

export default SubEventDashboard;
