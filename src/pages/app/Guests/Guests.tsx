import styles from './Guests.module.css';
import { useEffect, useState } from 'react';

import Theme from '../../../components/Theme/Theme';
import Glance from '../../../components/Glance/Glance';
import Header from '../../../components/EventHeader/EventHeader';

import { connectPrivateSocket } from '../../../../services/apiGateway';
import { makeMyPassSocket } from '../../../../services/urls';
import {
  downloadCSVData,
  downloadTicket,
  getGuestInfo,
  resentEventTicket,
} from '../../../apis/guests';
import { FormDataType } from '../../../apis/types';
import { getCategories } from '../../../apis/events';
import { transformTableData } from '../../../common/commonFunctions';

import { FormEventData, GuestsType, ResentTicket, SelectedGuest } from './types';
import { TableType } from '../../../components/Table/types';

import { RiSearchLine } from 'react-icons/ri';
import { HashLoader } from 'react-spinners';

import Table from '../../../components/Table/Table';
import ViewGuest from './components/ViewGuest/ViewGuest';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import { customStyles } from '../EventPage/constants';
import Select from 'react-select';
import { isArray } from 'chart.js/helpers';
import Modal from '../../../components/Modal/Modal';
import toast from 'react-hot-toast';
import Scanner from '../../../components/Scanner/Scanner';
import EventForm from '../EventPage/components/EventForm/EventForm';
import { useParams } from 'react-router';

const Guests = () => {
  const { eventTitle } = useParams<{ eventTitle: string }>();
  const [guests, setGuests] = useState<GuestsType[]>([]);
  const [guestsTableData, setGuestsTableData] = useState<TableType[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [eventFormData, setEventFormData] = useState<FormEventData>();
  const [formData, setFormData] = useState<FormDataType>({});
  // const [tickets, setTickets] = useState<Tickets[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>();
  const [ticketCode, setTicketCode] = useState<string>('');
  const [showScanner, setShowScanner] = useState<boolean>(false);

  const [selectedGuestId, setSelectedGuestId] = useState<SelectedGuest | null>({
    id: '',
    type: '',
  });
  const [selectedGuest, setSelectedGuest] = useState<GuestsType | null>(null);

  const [resentTicket, setResentTicket] = useState<ResentTicket>({
    status: false,
    guestId: '',
    name: '',
  });

  const getGuestData = () => {
    const selectedGuestData = guests.filter((guest) => guest?.id === selectedGuestId?.id);
    setSelectedGuest(selectedGuestData[0]);
    setFormData(selectedGuestData[0]);
  };

  const { event_id: eventId, current_user_role: userRole } = JSON.parse(
    sessionStorage.getItem('eventData')!,
  );

  useEffect(() => {
    if (eventId && !selectedGuestId?.id) {
      if (socket) socket.close();
      ``;
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
    }
  }, [eventId, selectedGuestId]);

  useEffect(() => {
    if (eventId) {
      getCategories(eventId, setCategories);
      getGuestInfo(eventId, setEventFormData);
    }
    return () => {
      socket?.close();
    };
  }, [eventId]);

  useEffect(() => {
    if (
      selectedGuestId?.id &&
      (selectedGuestId.type === 'edit' || selectedGuestId.type === 'view')
    ) {
      getGuestData();
    } else if (
      selectedGuestId?.id &&
      selectedGuestId.type === 'download' &&
      !isArray(selectedGuestId.id)
    )
      if (selectedGuestId.id && selectedGuest?.name)
        downloadTicket(eventId, selectedGuestId?.id, selectedGuest?.name);
      else toast.error('Ticket download failed');
  }, [selectedGuestId]);

  useEffect(() => {
    const guestsTableMapping = {
      id: 'id',
      name: 'name',
      email: 'email',
      category: 'category',
      registered_at: 'date',
      check_in_date: 'check_in_date',
      phone_number: 'phone_number',
      amount: 'amount',
      is_approved: 'is_approved',
      team_id: 'team_id',
    };

    if (guests) {
      const transformedData = transformTableData(guestsTableMapping, guests);

      setGuestsTableData(transformedData as unknown as TableType[]);
    }
  }, [guests]);

  const handleTicketResend = () => {
    resentEventTicket(resentTicket, setResentTicket);
  };

  const onClose = () => {
    setSelectedGuestId({
      id: '',
      type: '',
    });
  };

  useEffect(() => {
    if (ticketCode.length > 0) {
      setFormData({
        ...formData,
        ticket_code: ticketCode,
      });
    }
  }, [ticketCode]);

  return (
    <Theme>
      {eventFormData &&
        selectedGuestId &&
        formData &&
        selectedGuestId.id &&
        selectedGuestId.type == 'view' && (
          <>
            <div onClick={onClose} className={styles.backgroundBlur}></div>
            <ViewGuest
              formFields={eventFormData.form}
              formData={formData}
              setSelectedGuestId={setSelectedGuestId}
              eventId={eventId}
              setResentTicket={setResentTicket}
            />
          </>
        )}

      {selectedGuestId && selectedGuestId.type === 'add' && (
        <Modal onClose={onClose} type='side'>
          <div
            className={styles.userInfoModalContainer}
            style={{
              maxHeight: '100%',
              padding: '2rem 0',
            }}
          >
            {!showScanner ? (
              eventFormData && (
                <>
                  <EventForm
                    eventFormData={eventFormData}
                    eventTitle={eventTitle}
                    type='addGuest'
                  />
                </>
              )
            ) : (
              <Scanner
                ticketId={ticketCode}
                setTicketId={setTicketCode}
                trigger={true}
                setTrigger={() => {
                  if (setShowScanner) setShowScanner(false);
                }}
                scanCount={0}
              />
            )}
          </div>
        </Modal>
      )}

      {guests ? (
        <>
          {resentTicket && resentTicket.status && (
            <Modal onClose={onClose}>
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

                    setSelectedGuestId({
                      id: resentTicket.guestId,
                      type: 'view',
                    });
                  }}
                  className={styles.button}
                >
                  Cancel
                </p>
              </div>
            </Modal>
          )}

          <div className={styles.guestsContainer}>
            <Header />

            <Glance tab='guests' />

            <div className={styles.guests}>
              <div className={styles.tableHeader}>
                <p className={styles.tableHeading}>Guests List</p>
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
                tableData={
                  currentCategory
                    ? guestsTableData.filter((guest) => guest.category === currentCategory)
                    : guestsTableData
                }
                search={searchKeyword}
                setResentTicket={setResentTicket}
                setSelectedGuestId={setSelectedGuestId}
                secondaryButton={
                  <div className={styles.tableButtons}>
                    <SecondaryButton
                      buttonText='Add Guests +'
                      onClick={() => {
                        setSelectedGuestId({
                          id: '',
                          type: 'add',
                        });
                        setFormData({});
                      }}
                    />
                    {(userRole === 'Admin' || userRole === 'Owner') && (
                      <SecondaryButton
                        buttonText='CSV'
                        onClick={() => {
                          downloadCSVData(eventId);
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
                        options={[
                          ...categories.map((category) => ({
                            value: category,
                            label: category,
                          })),
                          {
                            value: '',
                            label: 'All',
                          },
                        ]}
                        styles={{
                          ...customStyles,
                          menu: (provided: any) => ({
                            ...provided,
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            backgroundColor: '#1C2222',
                            color: '#fff',
                            fontFamily: 'Inter, sans-serif',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '0.9rem',
                            zIndex: 1000,
                          }),
                        }}
                      />
                    )}
                  </div>
                }
              />
            </div>
          </div>
        </>
      ) : (
        <div className={styles.center}>
          <HashLoader color='#47C97E' size={50} />
        </div>
      )}
    </Theme>
  );
};

export default Guests;
