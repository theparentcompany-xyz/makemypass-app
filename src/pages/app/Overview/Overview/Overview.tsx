import { AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { BsQrCodeScan } from 'react-icons/bs';
import { FaWrench } from 'react-icons/fa';
import { HiUserGroup } from 'react-icons/hi2';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

import { connectPrivateSocket } from '../../../../../services/apiGateway';
import { TillRoles } from '../../../../../services/enums';
import { makeMyPassSocket } from '../../../../../services/urls';
import { createEventHost, removeEventHost, updateEventHost } from '../../../../apis/host';
import { getEventHosts } from '../../../../apis/overview';
import {
  isUserAuthorized,
  isUserEditor,
  transformTableData,
} from '../../../../common/commonFunctions';
import DashboardLayout from '../../../../components/DashboardLayout/DashboardLayout';
import Glance from '../../../../components/Glance/Glance';
import Modal from '../../../../components/Modal/Modal';
import SectionButton from '../../../../components/SectionButton/SectionButton';
import Table from '../../../../components/Table/Table';
import { TableType } from '../../../../components/Table/types';
import Theme from '../../../../components/Theme/Theme';
import { SelectedGuest } from '../../Guests/types';
import AddHosts from '../components/AddHosts/AddHosts';
import SecondaryButton from '../components/SecondaryButton/SecondaryButton';
import styles from './Overview.module.css';
import type { hostData, hostId, hostList, recentRegistration } from './types';

const Overview = () => {
  const navigate = useNavigate();
  const { eventTitle } = useParams<{ eventTitle: string }>();
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const addRef = useRef<boolean>(false);

  const [recentRegistrations, setRecentRegistrations] = useState<recentRegistration[]>([]);
  const [recentTableData, setRecentTableData] = useState<TableType[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<SelectedGuest | null>({
    id: '',
    type: '',
  });
  const [hostList, setHostList] = useState<hostList[]>([]);
  const [hostListTableData, setHostListTableData] = useState<TableType[]>([]);
  const [hostId, setHostId] = useState<hostId>({
    id: '',
    type: null,
  });

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [hostData, setHostData] = useState<hostData>({
    email: '',
    role: '',
    is_private: true,
  });

  useEffect(() => {
    return () => {
      socket?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedGuestId?.id)
      navigate(`/${eventTitle}/guests?eventRegisterId=${selectedGuestId?.id}`);
  }, [selectedGuestId, eventTitle, navigate]);

  useEffect(() => {
    if (eventId) {
      connectPrivateSocket({
        url: makeMyPassSocket.guestRecentRegistrations(eventId),
      }).then((ws) => {
        ws.onmessage = (event) => {
          if (JSON.parse(event.data).response && !JSON.parse(event.data).response.data)
            setRecentRegistrations(JSON.parse(event.data).response);
          else if (JSON.parse(event.data).response.data) {
            const newRegistration = JSON.parse(event.data).response.data;

            setRecentRegistrations((prev) => {
              const updatedRegistrations = [newRegistration, ...prev];

              updatedRegistrations.pop();
              return updatedRegistrations;
            });
          }
        };

        setSocket(ws);
      });

      getEventHosts(eventId, setHostList);
    }
  }, [eventId]);

  useEffect(() => {
    const recentTableMapping = {
      id: 'id',
      name: 'name',
      email: 'email',
      category: 'category',
      registered_at: 'registered_at',
      is_checked_in: 'is_checked_in',
      phonenumber: 'phonenumber',
      amount: 'amount',
      is_approved: 'is_approved',
      team_id: 'team_id',
      is_team_lead: 'is_team_lead',
    };

    if (recentRegistrations) {
      const transformedRecentRegistrations = transformTableData(
        recentTableMapping,
        recentRegistrations,
      );
      setRecentTableData(transformedRecentRegistrations as unknown as TableType[]);
    }
  }, [recentRegistrations]);

  useEffect(() => {
    const hostListMapping = {
      name: 'name',
      email: 'email',
      role: 'category',
      is_private: 'is_private',
      id: 'id',
    };
    if (hostList) {
      const transformedHostList = transformTableData(
        hostListMapping,
        hostList.map((host) => ({
          ...host,
          is_private: `${host.is_private}`,
        })),
      );
      setHostListTableData(transformedHostList as unknown as TableType[]);
    }
  }, [hostList]);

  useEffect(() => {
    if (hostId && hostId.type === 'edit' && hostId.id.length > 0) {
      const selectedHost = hostList.filter((host) => host.id === hostId.id)[0];

      setHostData((prevState) => ({
        ...prevState!,
        email: selectedHost?.email,
        role: selectedHost?.role,
        id: selectedHost?.id,
        is_private: selectedHost?.is_private,
      }));

      setOpenAddModal(true);
    }

    if (hostId && hostId.type === 'delete') {
      const selectedHost = hostList.filter((host) => host.id === hostId.id)[0];

      setHostData((prevState) => ({
        ...prevState!,
        email: selectedHost?.email,
        role: selectedHost?.role,
        is_private: selectedHost?.is_private,
        id: selectedHost?.id,
      }));
      setOpenDeleteModal(true);
    }
  }, [hostId, hostList]);

  const addHost = () => {
    addRef.current = true;
    setOpenAddModal(true);
  };

  const removeHostAccount = () => {
    removeEventHost(eventId, hostId.id, setOpenDeleteModal);
  };

  const onSubmit = () => {
    if (!hostData.id)
      createEventHost(eventId, hostData.email, hostData.role, hostData.is_private, setHostData);
    if (hostData.id)
      updateEventHost(
        eventId,
        hostData.id,
        hostData.role,
        hostData.is_private,
        setHostData,
        setHostList,
      );
    setOpenAddModal(false);
  };

  const hostValidate: () => boolean = () => {
    if (!hostData.email) {
      toast.error('Email is required');
      return false;
    }
    if (!hostData.role) {
      toast.error('Role is required');
      return false;
    }
    return true;
  };

  return (
    <Theme>
      <DashboardLayout prevPage='/events' tabName='overview' isLive={true}>
        <Glance tab='overview' />

        <>
          {openAddModal && (
            <AddHosts
              hostData={hostData}
              setHostData={setHostData}
              onSubmit={() => {
                if (hostValidate()) {
                  onSubmit();
                }
                setHostData({ email: '', role: '', is_private: true });
                setHostId({ id: '', type: null });
                addRef.current = false;
              }}
              onClose={() => {
                setOpenAddModal(false);
                setHostData({ email: '', role: '', is_private: true });
                addRef.current = false;
              }}
              add={addRef.current}
            />
          )}
          {openDeleteModal && (
            <Modal
              onClose={() => {
                setOpenDeleteModal(false);
              }}
            >
              <p className={styles.modalHeader}>Remove Host</p>
              <p className={styles.modalSubText}>
                Are you sure you want to delete&nbsp;
                <span
                  style={{
                    fontWeight: '600',
                    color: '#ff0c28',
                  }}
                >
                  {hostData.email}
                </span>
              </p>
              <div className={styles.buttons}>
                <p
                  onClick={() => {
                    removeHostAccount();
                  }}
                  className={`pointer ${styles.button}`}
                >
                  Remove Host
                </p>
                <p
                  onClick={() => {
                    setOpenDeleteModal(false);
                  }}
                  className={`pointer ${styles.button}`}
                >
                  Cancel
                </p>
              </div>
            </Modal>
          )}
          {recentRegistrations && hostList && recentRegistrations.length >= 0 ? (
            <>
              <div className={styles.buttons}>
                <Link to={`/${eventTitle}/guests`}>
                  <SectionButton
                    buttonText='Guest List'
                    buttonColor='#7662FC'
                    icon={<HiUserGroup size={25} color='#7662FC' />}
                  />
                </Link>

                {isUserAuthorized(TillRoles.VOLUNTEER) && (
                  <a href='#hosts'>
                    <SectionButton
                      buttonText='Host List'
                      buttonColor='#C33D7B'
                      icon={<FaWrench size={25} color='#C33D7B' />}
                    />
                  </a>
                )}

                <Link to={`/${eventTitle}/checkins`}>
                  <SectionButton
                    buttonText='Check In'
                    buttonColor='#5B75FB'
                    icon={<BsQrCodeScan size={25} color='#5B75FB' />}
                  />
                </Link>
              </div>

              <AnimatePresence>
                {recentTableData.length >= 0 && (
                  <Table
                    tableHeading='Recent Registration'
                    tableData={recentTableData}
                    setSelectedGuestId={setSelectedGuestId}
                  />
                )}
              </AnimatePresence>

              <div id='hosts'>
                <Table
                  tableHeading='Event Hosts'
                  tableData={hostListTableData}
                  secondaryButton={
                    isUserAuthorized(TillRoles.ADMIN) ? (
                      <SecondaryButton buttonText='Add Hosts +' onClick={addHost} />
                    ) : undefined
                  }
                  setHostId={setHostId}
                />
              </div>
            </>
          ) : (
            <div className={styles.center}>
              <HashLoader color='#47C97E' size={50} />
            </div>
          )}
        </>
      </DashboardLayout>
    </Theme>
  );
};

export default Overview;
