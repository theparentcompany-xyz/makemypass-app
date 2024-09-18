import { isArray } from 'chart.js/helpers';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaFileCsv } from 'react-icons/fa';
import { RiSearchLine } from 'react-icons/ri';
import { TiUserAdd } from 'react-icons/ti';
import { useNavigate, useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import Select from 'react-select';
import { HashLoader } from 'react-spinners';

import { Roles } from '../../../../services/enums';
import { getFormCategories } from '../../../apis/events';
import { listGuestsPagination } from '../../../apis/guest';
import {
  downloadRegisterCSVData,
  getEventFormData,
  getGuestEditPrefillData,
  getGuestInformation,
  resentGuestTicket,
  viewGuestTicket,
} from '../../../apis/guests';
import { checkSpinWheelPickUser } from '../../../apis/randomizer';
import { FormDataType } from '../../../apis/types';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import Glance from '../../../components/Glance/Glance';
import Modal from '../../../components/Modal/Modal';
import Scanner from '../../../components/Scanner/Scanner';
import Slider from '../../../components/SliderButton/Slider';
import Table from '../../../components/Table/Table';
import { TableType } from '../../../components/Table/types';
import Theme from '../../../components/Theme/Theme';
import EventForm from '../EventPage/components/EventForm/EventForm';
import { customStyles } from '../EventPage/constants';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import type { RegistrationDataType } from '../Overview/Overview/types';
import BulkUpload from './components/BulkUpload/BulkUpload';
import EditGuest from './components/EditGuest/EditGuest';
import ViewGuest from './components/ViewGuest/ViewGuest';
import styles from './Guests.module.css';
import {
  FormEventData,
  GuestsType,
  PaginationDataType,
  ResentTicket,
  SelectedGuest,
} from './types';

const Guests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventTitle } = useParams<{ eventTitle: string }>();
  const { event_id: eventId, current_user_role: userRole } = JSON.parse(
    sessionStorage.getItem('eventData')!,
  );

  const searchParams = new URLSearchParams(location.search);
  const eventRegisterId = searchParams.get('eventRegisterId');

  const [guests, setGuests] = useState<GuestsType[]>([]);
  const [paginationData, setPaginationData] = useState<PaginationDataType>({
    page: 1,
    total_pages: 0,
    total_items: 0,
    per_page: 10,
    next: null,
    previous: null,
    fetchingData: false,
    searchKeyword: '',
  });
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [showCheckedInOnly, setShowCheckedInOnly] = useState<boolean>(false);
  const [eventFormData, setEventFormData] = useState<FormEventData>();
  const [formData, setFormData] = useState<FormDataType>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>();
  const [ticketCode, setTicketCode] = useState<string>('');
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [isCashInHand, setIsCashInHand] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState('');

  const [showPicker, setShowPicker] = useState<boolean>(false);

  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);

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

  const getGuestData = () => {
    if (selectedGuestId && selectedGuestId.id && selectedGuestId.type == 'edit') {
      getGuestEditPrefillData(eventId, selectedGuestId.id, setSelectedGuest, setFormData);
    } else if (selectedGuestId && selectedGuestId.id && selectedGuestId.type == 'view')
      getGuestInformation(eventId, selectedGuestId.id, setSelectedGuest);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchKeyword(searchInput);
    }, 750);
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  useEffect(() => {
    if (eventRegisterId) {
      setSelectedGuestId({
        id: eventRegisterId,
        type: 'view',
      });

      getGuestInformation(eventId, eventRegisterId, setSelectedGuest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventRegisterId]);

  useEffect(() => {
    if (eventId) {
      // getGuestRegisterList(eventId, setGuests, showCheckedInOnly);
      listGuestsPagination(
        eventId,
        setGuests,
        paginationData,
        setPaginationData,
        showCheckedInOnly,
        searchKeyword,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, triggerFetch, showCheckedInOnly, searchKeyword]);

  useEffect(() => {
    if (eventId) {
      getFormCategories(eventId, setCategories);
      getEventFormData(eventId, setEventFormData);
      checkSpinWheelPickUser(eventId, setShowPicker);
    }
  }, [eventId]);

  useEffect(() => {
    if (!selectedGuestId?.id) {
      setSelectedGuest(undefined);
    } else {
      if (selectedGuestId.type === 'edit' || selectedGuestId.type === 'view') {
        getGuestData();
      } else if (selectedGuestId.type === 'download' && !isArray(selectedGuestId.id)) {
        if (selectedGuestId.id) {
          viewGuestTicket(eventId, selectedGuestId.id, navigate);
        } else {
          toast.error('Ticket download failed');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGuestId]);

  const handleTicketResend = () => {
    resentGuestTicket(resentTicket, setResentTicket);
  };

  const onClose = () => {
    setSelectedGuestId(null);
    setSelectedGuest(undefined);
  };

  useEffect(() => {
    if (ticketCode.length > 0) {
      setFormData({
        ...formData,
        ticket_code: ticketCode,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                setSelectedGuest={setSelectedGuest}
                setTriggerFetch={setTriggerFetch}
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
            formData={formData}
            eventRegisterId={selectedGuestId.id}
            setFormData={setFormData}
            eventFormData={eventFormData}
            setSelectedGuestId={setSelectedGuestId}
            eventId={eventId}
            onClose={onClose}
            setGuests={setGuests}
          />
        )}

        {guests ? (
          <>
            {resentTicket && resentTicket.status && (
              <Modal
                onClose={() => {
                  setResentTicket((prevState) => ({
                    ...prevState,
                    status: false,
                  }));
                }}
                title='Resend Ticket'
              >
                <p className={styles.modalSubText}>
                  By clicking on resend, the ticket with most resend will be sent to{' '}
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
                  onChange={(event) => setSearchInput(event.target.value)}
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
                setResentTicket={setResentTicket}
                setSelectedGuestId={setSelectedGuestId}
                secondaryButton={
                  <div className={styles.tableButtons}>
                    <Slider
                      checked={showCheckedInOnly}
                      onChange={() => setShowCheckedInOnly(!showCheckedInOnly)}
                      size='small'
                      text='Checked-In'
                    />

                    {showPicker && (
                      <SecondaryButton
                        buttonText='Pick User'
                        onClick={() => {
                          navigate(`/${eventTitle}/randomsizer`);
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
                          menu: (provided) => ({
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

                    {(userRole === Roles.ADMIN || userRole === Roles.OWNER) && (
                      <FaFileCsv
                        onClick={() => {
                          downloadRegisterCSVData(eventId, showCheckedInOnly);
                        }}
                        size={20}
                        color='#575f61'
                        className='pointer'
                      />
                    )}

                    <TiUserAdd
                      onClick={() => {
                        setSelectedGuestId({
                          id: '',
                          type: 'add',
                        });
                        setFormData({});
                      }}
                      size={25}
                      color='#575f61'
                      className='pointer'
                    />
                  </div>
                }
                paginationData={paginationData}
                setPaginationData={setPaginationData}
                setTriggerFetch={setTriggerFetch}
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
