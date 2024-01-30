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

import Select from 'react-select';
import { categoryOptions, districtOptions } from './data';

const Guests = () => {
  const [guests, setGuests] = useState<guests[]>([]);
  const [guestsTableData, setGuestsTableData] = useState<TableType[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<guests | null>(null);

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

  const getGuestData = () => {
    const selectedGuestData = guests.filter((guest) => guest.id === selectedGuestId);

    setSelectedGuest(selectedGuestData[0]);
  };

  const { eventTitle } = useParams<{ eventTitle: string }>();
  const eventId = getLocalEventId();

  useEffect(() => {
    if (eventId)
      connectPrivateSocket({
        url: makeMyPassSocket.listGuests(eventId),
      }).then((ws) => {
        ws.onmessage = (event) => {
          if (JSON.parse(event.data).response.guests)
            setGuests(JSON.parse(event.data).response.guests);
          else if (JSON.parse(event.data).response.data) {
            const newGuest = JSON.parse(event.data).response.data;

            setGuests((prev) => {
              const updatedGuests = [newGuest, ...prev];

              return updatedGuests;
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
  }, []);

  useEffect(() => {
    getGuestData();
  }, [selectedGuestId]);

  const handleDistrictChange = (event: any) => {
    const selectedDistrict = event.value;

    setSelectedGuest((prevState) => ({
      ...prevState!,
      district: selectedDistrict,
      id: prevState?.id ?? '',
    }));
  };

  const handleCategoryChange = (event: any) => {
    const selectedCategory = event.value;

    setSelectedGuest((prevState) => ({
      ...prevState!,
      category: selectedCategory,
      id: prevState?.id ?? '',
    }));
  };

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

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      border: 'none',
      backgroundColor: '#2A3533',
      fontFamily: 'Inter, sans-serif',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '0.9rem',
    }),

    group: (provided: any) => ({
      ...provided,
      paddingTop: 0,
    }),

    singleValue: (base: any) => ({
      ...base,
      color: '#fff',
    }),
    option: (provided: any) => ({
      ...provided,
      fontFamily: 'Inter, sans-serif',
      color: '#000',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '0.9rem',
    }),
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
          {selectedGuestId && (
            <dialog className={styles.onClickModal}>
              <div className={styles.userInfoModalContainer}>
                <p className={styles.modalHeader}>Edit Guest</p>
                <div className={styles.inputContainers}>
                  <div className={styles.inputContainer}>
                    <p className={styles.inputLabel}>Name</p>
                    <input
                      value={selectedGuest?.name}
                      className={styles.input}
                      type='text'
                      onChange={(event) => {
                        setSelectedGuest((prevState) => ({
                          ...prevState!,
                          name: event.target.value,
                        }));
                      }}
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <p className={styles.inputLabel}>Email</p>
                    <input
                      value={selectedGuest?.email}
                      className={styles.input}
                      type='text'
                      onChange={(event) => {
                        setSelectedGuest((prevState) => ({
                          ...prevState!,
                          email: event.target.value,
                        }));
                      }}
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <p className={styles.inputLabel}>Organization</p>
                    <input
                      value={selectedGuest?.organization}
                      className={styles.input}
                      type='text'
                      onChange={(event) => {
                        setSelectedGuest((prevState) => ({
                          ...prevState!,
                          organization: event.target.value,
                        }));
                      }}
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <p className={styles.inputLabel}>Phone Number</p>
                    <input
                      value={selectedGuest?.phone_number}
                      className={styles.input}
                      type='text'
                      onChange={(event) => {
                        setSelectedGuest((prevState) => ({
                          ...prevState!,
                          phone_number: event?.target.value || '',
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className={styles.dropdownContainer}>
                  <div className={styles.dropdown}>
                    <p className={styles.inputLabel}>District</p>
                    <Select
                      className='basic-single'
                      classNamePrefix='select'
                      value={
                        districtOptions.filter(
                          (district) => district.value === selectedGuest?.district,
                        )[0]
                      }
                      onChange={(event) => {
                        handleDistrictChange(event);
                      }}
                      name='district'
                      options={districtOptions}
                      styles={customStyles}
                    />
                  </div>
                  <div className={styles.dropdown}>
                    <p className={styles.inputLabel}>Category</p>
                    <Select
                      className='basic-single'
                      classNamePrefix='select'
                      value={
                        categoryOptions.filter(
                          (category) => category.value === selectedGuest?.category,
                        )[0]
                      }
                      onChange={(event) => {
                        handleCategoryChange(event);
                      }}
                      name='district'
                      options={categoryOptions}
                      styles={customStyles}
                    />
                  </div>
                </div>

                <div className={styles.buttons}>
                  <p
                    onClick={() => {
                      console.log(selectedGuest);
                    }}
                    className={styles.button}
                  >
                    Edit
                  </p>
                  <p
                    onClick={() => {
                      setSelectedGuestId(null);
                    }}
                    className={styles.button}
                  >
                    Cancel
                  </p>
                </div>
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
                setSelectedGuestId={setSelectedGuestId}
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
