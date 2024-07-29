import Theme from '../../../../../components/Theme/Theme';
import Header from '../../../../../components/EventHeader/EventHeader';
import styles from './CheckIn.module.css';
import { RiSearchLine } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { guests } from './types';
import CheckInHeader from '../../components/CheckInHeader/CheckInHeader/CheckInHeader';
import { getCategories } from '../../../../../apis/events';
import { connectPrivateSocket } from '../../../../../../services/apiGateway';
import { makeMyPassSocket } from '../../../../../../services/urls';
import { transformTableData } from '../../../../../common/commonFunctions';
import { TableType } from '../../../../../components/Table/types';
import Table from '../../../../../components/Table/Table';
import { customStyles } from '../../../EventPage/constants';
import Select from 'react-select';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import { handleClick } from '../../../Guests/components/csvExport';
import { Roles } from '../../../../../../services/enums';

const CheckIn = () => {
  const [recentRegistrations, setRecentRegistrations] = useState<guests[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [recentTableData, setRecentTableData] = useState<TableType[]>([]);

  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>();

  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);

  useEffect(() => {
    if (eventId) {
      getCategories(eventId, setCategories);
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
    }
  }, [eventId]);

  useEffect(() => {
    return () => {
      socket?.close();
    };
  }, []);

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
      setRecentTableData(transformedRecentRegistrations as unknown as TableType[]);
    }
  }, [recentRegistrations]);

  const userRole = JSON.parse(sessionStorage.getItem('eventData')!).current_user_role;

  return (
    <Theme>
      <div className={styles.checkInContainer}>
        <Header previousPageNavigate='-1' />

        <CheckInHeader title='Check-In' currentCount={recentRegistrations.length} />

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
          tableHeading='Recent CheckIns'
          tableData={
            currentCategory
              ? recentTableData.filter((data) => data.category === currentCategory)
              : recentTableData
          }
          search={searchKeyword}
          secondaryButton={
            <div className={styles.tableButtons}>
              {(userRole === Roles.ADMIN || userRole === Roles.OWNER) && (
                <SecondaryButton
                  buttonText='CSV'
                  onClick={() => {
                    handleClick(
                      currentCategory
                        ? recentTableData.filter((data) => data.category === currentCategory)
                        : recentTableData,
                      'Guests CSV',
                    );
                  }}
                />
              )}
              {categories.length > 0 && (
                <Select
                  className='basic-single'
                  classNamePrefix='select'
                  onChange={(selectedOption: { value: string } | null) => {
                    setCurrentCategory(selectedOption?.value);
                  }}
                  name='role'
                  options={categories.map((category) => ({
                    value: category,
                    label: category,
                  }))}
                  styles={customStyles}
                />
              )}
            </div>
          }
        />
      </div>
    </Theme>
  );
};

export default CheckIn;
