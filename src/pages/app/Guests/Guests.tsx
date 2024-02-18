import { useEffect, useState } from 'react';
import Theme from '../../../components/Theme/Theme';
import Glance from '../../../components/Glance/Glance';
import Header from '../../../components/EventHeader/EventHeader';
import styles from './Guests.module.css';
import { connectPrivateSocket } from '../../../../services/apiGateway';
import { makeMyPassSocket } from '../../../../services/urls';
import { useParams } from 'react-router-dom';
import { GuestsType, ResentTicket, SelectedGuest } from './types';
import { getEventId } from '../../../apis/events';
import { RiSearchLine } from 'react-icons/ri';
import { HashLoader } from 'react-spinners';
import Table from '../../../components/Table/Table';
import { transformTableData } from '../../../common/commonFunctions';
import { TableType } from '../../../components/Table/types';
import { downloadTicket, editSubmissons, resentEventTicket } from '../../../apis/guests';
import { FormData, FormField } from '../../../apis/types';
import { getFormFields } from '../../../apis/publicpage';
import DynamicType from '../../../components/DynamicType/DynamicType';

const Guests = () => {
  const [guests, setGuests] = useState<GuestsType[]>([]);
  const [guestsTableData, setGuestsTableData] = useState<TableType[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formErrors, setFormErrors] = useState<any>({});
  const [formData, setFormData] = useState<FormData>({});

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
    const selectedGuestData = guests.filter((guest) => guest?.id === selectedGuestId?.id);
    setSelectedGuest(selectedGuestData[0]);
    setFormData(selectedGuestData[0]);
  };

  const { eventTitle } = useParams<{ eventTitle: string }>();
  const eventId = getLocalEventId();

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
    getFormFields(eventId, setFormFields);
    return () => {
      socket?.close();
    };
  }, []);

  useEffect(() => {
    if (selectedGuestId?.id && selectedGuestId.type === 'edit') getGuestData();
    else if (selectedGuestId?.id && selectedGuestId.type === 'download')
      downloadTicket(eventId, selectedGuestId?.id);
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
    };

    if (guests) {
      const transformedData = transformTableData(guestsTableMapping, guests);

      setGuestsTableData(transformedData as TableType[]);
    }
  }, [guests]);

  const handleTicketResend = () => {
    resentEventTicket(resentTicket, setResentTicket);
  };

  const handleSubmissionEdit = () => {
    if (selectedGuest) editSubmissons(eventId, formData, setSelectedGuestId);
  };

  const onFieldChange = (fieldName: string, fieldValue: string) => {
    setFormData({
      ...formData,
      [fieldName]: fieldValue,
    });

    if (formErrors[fieldName]) {
      setFormErrors({
        ...formErrors,
        [fieldName]: '',
      });
    }
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
          {selectedGuestId && selectedGuestId.id.length > 0 && selectedGuestId.type === 'edit' && (
            <dialog className={styles.onClickModal}>
              <div className={styles.userInfoModalContainer}>
                <p className={styles.modalHeader}>Edit Guest</p>
                <DynamicType
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
