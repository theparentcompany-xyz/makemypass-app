import styles from './Guests.module.css';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/globalContext';

import Theme from '../../../components/Theme/Theme';
import Glance from '../../../components/Glance/Glance';
import Header from '../../../components/EventHeader/EventHeader';

import { connectPrivateSocket } from '../../../../services/apiGateway';
import { makeMyPassSocket } from '../../../../services/urls';
import {
  downloadCSVData,
  downloadTicket,
  editSubmissons,
  resentEventTicket,
} from '../../../apis/guests';
import { ErrorMessages, FormData, FormField } from '../../../apis/types';
import { getFormFields, getTickets } from '../../../apis/publicpage';
import { getCategories } from '../../../apis/events';
import { transformTableData } from '../../../common/commonFunctions';

import { GuestsType, ResentTicket, SelectedGuest } from './types';
import { TableType } from '../../../components/Table/types';

import { RiSearchLine } from 'react-icons/ri';
import { HashLoader } from 'react-spinners';

import Table from '../../../components/Table/Table';

import DynamicForm from '../../../components/DynamicForm/DynamicForm';
import ViewGuest from './components/ViewGuest/ViewGuest';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import { TicketOptions } from '../EventPage/types';
import { addGuest } from '../../../apis/guest';
import { customStyles } from '../EventPage/constants';
import Select from 'react-select';
import { isArray } from 'chart.js/helpers';
import Modal from '../../../components/Modal/Modal';
import toast from 'react-hot-toast';

const Guests = () => {
  const [guests, setGuests] = useState<GuestsType[]>([]);
  const [guestsTableData, setGuestsTableData] = useState<TableType[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formErrors, setFormErrors] = useState<ErrorMessages>({});
  const [formData, setFormData] = useState<FormData>({});
  const [ticketInfo, setTicketInfo] = useState<TicketOptions>();
  const [ticketId, setTicketId] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>();

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

  const { eventId } = useContext(GlobalContext);

  useEffect(() => {
    if (eventId && !selectedGuestId?.id) {
      if (socket) socket.close();
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
      getFormFields(eventId, setFormFields);
      getTickets(eventId, setTicketInfo);
      getCategories(eventId, setCategories);
    }
    return () => {
      socket?.close();
    };
  }, [eventId]);

  useEffect(() => {
    if (selectedGuestId?.id && (selectedGuestId.type === 'edit' || selectedGuestId.type === 'view'))
      getGuestData();
    else if (
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
      is_shortlisted: 'is_shortlisted',
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
    if (selectedGuest) editSubmissons(eventId, formData, setSelectedGuestId, setFormData);
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

  return (
    <Theme>
      {selectedGuestId && formData && selectedGuestId.id && selectedGuestId.type == 'view' && (
        <>
          <div className={styles.backgroundBlur}></div>
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
        <Modal>
          <div
            className={styles.userInfoModalContainer}
            style={{
              maxHeight: '40rem',
              padding: '1rem 0',
            }}
          >
            <p className={styles.modalHeader}>Add Guest</p>
            <DynamicForm
              formFields={formFields}
              formErrors={formErrors}
              formData={formData}
              onFieldChange={onFieldChange}
              ticketInfo={ticketInfo}
              setTicketId={setTicketId}
              ticketId={ticketId}
            />

            <div className={styles.buttons}>
              <p
                onClick={() => {
                  addGuest(eventId, ticketId, formData, setFormErrors, setSelectedGuestId);
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
          </div>
        </Modal>
      )}
      {guests ? (
        <>
          {resentTicket && resentTicket.status && (
            <Modal>
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
            <Modal>
              <div className={styles.userInfoModalContainer}>
                <p className={styles.modalHeader}>Edit Guest</p>
                <DynamicForm
                  formFields={formFields}
                  formErrors={formErrors}
                  formData={formData}
                  onFieldChange={onFieldChange}
                />

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
                    <SecondaryButton
                      buttonText='CSV'
                      onClick={() => {
                        downloadCSVData(eventId);
                      }}
                    />
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
