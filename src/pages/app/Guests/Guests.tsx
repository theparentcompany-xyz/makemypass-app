import styles from './Guests.module.css';
import { useEffect, useState } from 'react';

import Theme from '../../../components/Theme/Theme';
import {
  downloadCSVData,
  downloadTicket,
  getEditGuestData,
  getGuestInfo,
  getIndividualGuestInfo,
  listGuests,
  resentEventTicket,
} from '../../../apis/guests';
import { FormDataType } from '../../../apis/types';
import { getCategories } from '../../../apis/events';

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
import { useNavigate, useParams } from 'react-router';
import EditGuest from './components/EditGuest/EditGuest';
import BulkUpload from './components/BulkUpload/BulkUpload';
import { RegistrationDataType } from '../Overview/Overview/types';
import { Roles } from '../../../../services/enums';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import Glance from '../../../components/Glance/Glance';
import Slider from '../../../components/SliderButton/Slider';

const Guests = () => {
  const { eventTitle } = useParams<{ eventTitle: string }>();
  const [guests, setGuests] = useState<GuestsType[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [eventFormData, setEventFormData] = useState<FormEventData>();
  const [formData, setFormData] = useState<FormDataType>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>();
  const [ticketCode, setTicketCode] = useState<string>('');
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [isCashInHand, setIsCashInHand] = useState<boolean>(false);

  const navigate = useNavigate();

  const [selectedGuestId, setSelectedGuestId] = useState<SelectedGuest | null>({
    id: '',
    type: '',
  });
  const [selectedGuest, setSelectedGuest] = useState<RegistrationDataType>();

  const [resentTicket, setResentTicket] = useState<ResentTicket>({
    status: false,
    guestId: '',
    name: '',
  });

  useEffect(() => {
    console.log('Form Data: ', formData);
  }, [formData]);

  const getGuestData = () => {
    setSelectedGuest({} as RegistrationDataType);
    if (selectedGuestId && selectedGuestId.id && selectedGuestId.type == 'edit') {
      getEditGuestData(eventId, selectedGuestId.id, setSelectedGuest);
    } else if (selectedGuestId)
      getIndividualGuestInfo(eventId, selectedGuestId.id, setSelectedGuest);
  };

  const { event_id: eventId, current_user_role: userRole } = JSON.parse(
    sessionStorage.getItem('eventData')!,
  );

  useEffect(() => {
    if (eventId && !selectedGuestId?.id) {
      listGuests(eventId, setGuests);
    }
  }, [eventId, selectedGuestId]);

  useEffect(() => {
    if (eventId) {
      getCategories(eventId, setCategories);
      getGuestInfo(eventId, setEventFormData);
    }
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
      if (selectedGuestId.id) downloadTicket(eventId, selectedGuestId?.id, navigate);
      else toast.error('Ticket download failed');
  }, [selectedGuestId]);

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
      <DashboardLayout prevPage='/events' tabName='guests'>
        <Glance tab='guests' />
        {eventFormData &&
          selectedGuestId &&
          formData &&
          selectedGuestId.id &&
          selectedGuestId.type == 'view' && (
            <>
              <div onClick={onClose} className={styles.backgroundBlur}></div>
              <ViewGuest
                selectedGuestData={selectedGuest}
                setSelectedGuestId={setSelectedGuestId}
                eventId={eventId}
                setResentTicket={setResentTicket}
              />
            </>
          )}

        {selectedGuestId && selectedGuestId.type === 'bulk' && <BulkUpload onClose={onClose} />}

        {selectedGuestId && selectedGuestId.type === 'add' && (
          <Modal title='Invite Guest' onClose={onClose} type='side'>
            <div className={styles.userInfoModalContainer}>
              <button
                className={styles.bulkUploadButton}
                onClick={() => {
                  setSelectedGuestId({
                    id: '',
                    type: 'bulk',
                  });
                }}
              >
                Bulk Upload
              </button>
              <div className={styles.orContainer}>
                <hr />
                <p>OR</p>
                <hr />
              </div>
              <p className={styles.ticketLabel}>Enter Ticket Code</p>
              <div className={styles.ticketCode}>
                <input
                  onChange={(event) => {
                    setTicketCode(event.target.value);
                  }}
                  placeholder='Ticket Code'
                  type='text'
                  value={ticketCode}
                  className={styles.scanInput}
                />
                <button
                  onClick={() => {
                    setShowScanner(true);
                  }}
                  className={styles.scanButton}
                >
                  Scan
                </button>
              </div>
              {!showScanner ? (
                eventFormData && (
                  <>
                    <Slider
                      checked={isCashInHand}
                      onChange={() => setIsCashInHand(!isCashInHand)}
                      key={isCashInHand ? 'cash' : 'online'}
                      size='medium'
                      text='Cash in Hand'
                    />
                    <EventForm
                      eventFormData={eventFormData}
                      eventTitle={eventTitle}
                      type='addGuest'
                      ticketCode={ticketCode}
                      setSelectedGuestId={setSelectedGuestId}
                      isCashInHand={isCashInHand}
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
                />
              )}
            </div>
          </Modal>
        )}

        {selectedGuestId && eventFormData && selectedGuestId.type === 'edit' && (
          <EditGuest
            formData={{
              ...selectedGuest?.submission,
              id: selectedGuestId.id,
            }}
            setFormData={setFormData}
            eventFormData={eventFormData}
            setSelectedGuestId={setSelectedGuestId}
            eventId={eventId}
            onClose={onClose}
          />
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
                    className={`pointer ${styles.button}`}
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
                        id: resentTicket.guestId.toString(),
                        type: 'view',
                      });
                    }}
                    className={`pointer ${styles.button}`}
                  >
                    Cancel
                  </p>
                </div>
              </Modal>
            )}

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
                    ? (guests.filter(
                        (guest) => guest.category === currentCategory,
                      ) as unknown as TableType[])
                    : (guests as unknown as TableType[])
                }
                search={searchKeyword}
                setResentTicket={setResentTicket}
                setSelectedGuestId={setSelectedGuestId}
                secondaryButton={
                  <div className={styles.tableButtons}>
                    <SecondaryButton
                      buttonText='Invite Guests +'
                      onClick={() => {
                        setSelectedGuestId({
                          id: '',
                          type: 'add',
                        });
                        setFormData({});
                      }}
                    />

                    {(userRole === Roles.ADMIN || userRole === Roles.OWNER) && (
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
          </>
        ) : (
          <div className={styles.center}>
            <HashLoader color='#47C97E' size={50} />
          </div>
        )}
      </DashboardLayout>
    </Theme>
  );
};

export default Guests;
