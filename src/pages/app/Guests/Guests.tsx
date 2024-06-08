import styles from './Guests.module.css';
import React, { useEffect, useState } from 'react';

import Theme from '../../../components/Theme/Theme';
import Glance from '../../../components/Glance/Glance';
import Header from '../../../components/EventHeader/EventHeader';

import { connectPrivateSocket } from '../../../../services/apiGateway';
import { makeMyPassSocket } from '../../../../services/urls';
import {
  downloadCSVData,
  downloadTicket,
  editSubmissons,
  getGuestInfo,
  resentEventTicket,
} from '../../../apis/guests';
import {
  ErrorMessages,
  EventType,
  FormDataType,
  FormFieldType,
  TicketType,
} from '../../../apis/types';
import { getCategories } from '../../../apis/events';
import { findMinDate, transformTableData } from '../../../common/commonFunctions';

import { GuestsType, ResentTicket, SelectedGuest } from './types';
import { TableType } from '../../../components/Table/types';

import { RiSearchLine } from 'react-icons/ri';
import { HashLoader } from 'react-spinners';

import Table from '../../../components/Table/Table';

import DynamicForm from '../../../components/DynamicForm/DynamicForm';
import ViewGuest from './components/ViewGuest/ViewGuest';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import { addGuest } from '../../../apis/guest';
import { customStyles } from '../EventPage/constants';
import Select from 'react-select';
import { isArray } from 'chart.js/helpers';
import Modal from '../../../components/Modal/Modal';
import toast from 'react-hot-toast';
import { getEventInfo } from '../../../apis/publicpage';
import { useParams } from 'react-router';
import { Tickets } from '../EventPage/types';
import SelectDate from '../../../components/SelectDate/SelectDate';
import SelectTicket from './components/SelectTicket/SelectTicket';
import ScanTicket from './components/ScanTicket/ScanTicket';
import Scanner from '../../../components/Scanner/Scanner';
import { filterTickets } from '../../../common/coreLogics';

const Guests = () => {
  const [guests, setGuests] = useState<GuestsType[]>([]);
  const [guestsTableData, setGuestsTableData] = useState<TableType[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [formFields, setFormFields] = useState<FormFieldType[]>([]);
  const [formErrors, setFormErrors] = useState<ErrorMessages>({});
  const [formData, setFormData] = useState<FormDataType>({});
  const [ticketInfo, setTicketInfo] = useState<TicketType[]>();

  const [tickets, setTickets] = useState<Tickets[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>();
  const [ticketCode, setTicketCode] = useState<string>('');
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const [eventData, setEventData] = useState<EventType>();

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

  const { eventTitle } = useParams<{ eventTitle: string }>();
  useEffect(() => {
    if (eventTitle) getEventInfo(eventTitle, setEventData);
  }, [eventTitle]);

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
      getGuestInfo(eventId, setFormFields, setTicketInfo);
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

  const handleSubmissionEdit = () => {
    if (selectedGuest)
      editSubmissons(eventId, formData, setSelectedGuestId, setFormData, setFormErrors);
  };

  const onFieldChange = (fieldName: string, fieldValue: string | string[]) => {
    setFormData({
      ...formData,
      [fieldName]: fieldValue,
    });

    if (formErrors[fieldName]) {
      setFormErrors({
        ...formErrors,
        [fieldName]: [],
      });
    }
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

  const handleDateChange = (date: string | null | undefined | Date) => {
    let newDate;
    if (date) newDate = new Date(date);
    if (newDate && eventData && setSelectedDate) {
      setSelectedDate(newDate.toISOString().split('T')[0]);
    }
  };

  useEffect(() => {
    if (eventData) handleDateChange(findMinDate(eventData));
  }, [eventData]);

  const [filteredTickets, setFilteredTickets] = React.useState<TicketType[]>([]);

  useEffect(() => {
    filterTickets({
      eventData,
      selectedDate,
      setFilteredTickets,
      formData,
    });
  }, [selectedDate]);

  useEffect(() => {
    console.log(tickets);
  }, [tickets]);

  return (
    <Theme>
      {selectedGuestId && formData && selectedGuestId.id && selectedGuestId.type == 'view' && (
        <>
          <div onClick={onClose} className={styles.backgroundBlur}></div>
          <ViewGuest
            formFields={formFields}
            formData={formData}
            setSelectedGuestId={setSelectedGuestId}
            eventId={eventId}
            setResentTicket={setResentTicket}
          />
        </>
      )}

      {selectedGuestId && selectedGuestId.type === 'add' && (
        <Modal onClose={onClose}>
          <div
            className={styles.userInfoModalContainer}
            style={{
              maxHeight: '40rem',
              padding: '1rem 0',
            }}
          >
            <p className={styles.modalHeader}>Add Guest</p>
            {!showScanner ? (
              <>
                {eventData && findMinDate(eventData) && (
                  <SelectDate
                    eventData={eventData}
                    selectedDate={selectedDate}
                    handleDateChange={handleDateChange}
                    type='addGuest'
                    value={formData['entry_date']}
                    onFieldChange={(fieldName, fieldValue) => onFieldChange(fieldName, fieldValue)}
                  />
                )}

                {filteredTickets && (
                  <>
                    <SelectTicket
                      filteredTickets={filteredTickets}
                      selectedDate={selectedDate}
                      tickets={tickets}
                      setTickets={setTickets}
                    />
                    <ScanTicket
                      ticketCode={ticketCode}
                      setTicketCode={setTicketCode}
                      setShowScanner={setShowScanner}
                    />
                  </>
                )}

                <div
                  style={{
                    marginBottom: '1rem',
                  }}
                >
                  <p className={styles.formLabel}>Cash In Hand*</p>
                  <div className={styles.checkboxContainer}>
                    <>
                      <div className={styles.checkbox}>
                        <input
                          type='radio'
                          id='is_cash_in_hand'
                          name='is_cash_in_hand'
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onFieldChange('is_cash_in_hand', e.target.checked ? 'true' : 'false');
                          }}
                          className={styles.checkboxInput}
                        />
                        <label>Yes</label>
                      </div>
                      <div className={styles.checkbox}>
                        <input
                          type='radio'
                          id='is_cash_in_hand'
                          name='is_cash_in_hand'
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onFieldChange('is_cash_in_hand', e.target.checked ? 'false' : 'true');
                          }}
                          className={styles.checkboxInput}
                          defaultChecked
                        />
                        <label>No</label>
                      </div>
                    </>
                  </div>
                </div>

                <DynamicForm
                  formFields={formFields}
                  formErrors={formErrors}
                  formData={formData}
                  onFieldChange={onFieldChange}
                />

                <div className={styles.buttons}>
                  <p
                    onClick={() => {
                      if (tickets.some((ticket) => ticket.count > 0))
                        addGuest(
                          eventId,
                          tickets,
                          formData,
                          setFormErrors,
                          setSelectedGuestId,
                          selectedDate,
                        );
                      else {
                        toast.error('Please select atleast one ticket');
                      }
                    }}
                    className={styles.button}
                  >
                    Add
                  </p>
                  <p
                    onClick={() => {
                      setSelectedGuestId({
                        id: '',
                        type: '',
                      });
                    }}
                    className={styles.button}
                  >
                    Cancel
                  </p>
                </div>
              </>
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
          {selectedGuestId && selectedGuestId.type === 'edit' && (
            <Modal onClose={onClose}>
              <div className={styles.userInfoModalContainer}>
                <p className={styles.modalHeader}>Edit Guest</p>
                <div className={styles.formFields}>
                  {eventData && isSelectDateNeeded(eventData) && (
                    <SelectDate
                      eventData={eventData}
                      selectedDate={selectedDate}
                      handleDateChange={handleDateChange}
                      type='addGuest'
                      value={formData['entry_date']}
                      onFieldChange={(fieldName, fieldValue) =>
                        onFieldChange(fieldName, fieldValue)
                      }
                    />
                  )}
                  <DynamicForm
                    formFields={formFields}
                    formErrors={formErrors}
                    formData={formData}
                    onFieldChange={onFieldChange}
                  />
                </div>

                {!showScanner && (
                  <div className={styles.buttons}>
                    <p
                      onClick={() => {
                        handleSubmissionEdit();
                      }}
                      className={styles.button}
                    >
                      Edit
                    </p>
                    <p
                      onClick={() => {
                        setSelectedGuestId({
                          id: '',
                          type: '',
                        });
                      }}
                      className={styles.button}
                    >
                      Cancel
                    </p>
                  </div>
                )}
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
                        getGuestInfo(eventId, setFormFields, setTicketInfo);
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
