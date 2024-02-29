import { HiUserGroup } from 'react-icons/hi2';
import { FaWrench } from 'react-icons/fa';
import { BsQrCodeScan } from 'react-icons/bs';
import Glance from '../../../../components/Glance/Glance';

import styles from './Overview.module.css';
import SectionButton from '../../../../components/SectionButton/SectionButton';
import { useContext, useEffect, useState } from 'react';

import { hostData, hostId, hostList, recentRegistration } from './types';

import { HashLoader } from 'react-spinners';
import { getHosts } from '../../../../apis/overview';
import { connectPrivateSocket } from '../../../../../services/apiGateway';
import { makeMyPassSocket } from '../../../../../services/urls';
import Theme from '../../../../components/Theme/Theme';
import { Link, useParams } from 'react-router-dom';
import Header from '../../../../components/EventHeader/EventHeader';
import Table from '../../../../components/Table/Table';
import { TableType } from '../../../../components/Table/types';
import { transformTableData } from '../../../../common/commonFunctions';
import SecondaryButton from '../components/SecondaryButton/SecondaryButton';
import AddHosts from '../components/SecondaryButton/AddHosts/AddHosts';
import { addHosts, removeHost, updateHostRole } from '../../../../apis/host';
import { AnimatePresence } from 'framer-motion';
import { GlobalContext } from '../../../../contexts/globalContext';

const Overview = () => {
  const [recentRegistrations, setRecentRegistrations] = useState<recentRegistration[]>([]);
  const [recentTableData, setRecentTableData] = useState<TableType[]>([]);

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [hostList, setHostList] = useState<hostList[]>([]);
  const [hostListTableData, setHostListTableData] = useState<TableType[]>([]);
  const [hostId, setHostId] = useState<hostId>({
    id: '',
    type: 'edit',
  });

  const eventTitle = useParams<{ eventTitle: string }>();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [hostData, setHostData] = useState<hostData>({
    email: '',
    role: '',
  });

  const { eventId } = useContext(GlobalContext);

  useEffect(() => {
    if (eventId && hostList.length === 0) getHosts(eventId, setHostList);
  }, [eventId, hostList]);

  useEffect(() => {
    return () => {
      socket?.close();
    };
  }, []);

  useEffect(() => {
    if (eventId)
      connectPrivateSocket({
        url: makeMyPassSocket.recentRegistrations(eventId),
      }).then((ws) => {
        ws.onmessage = (event) => {
          if (JSON.parse(event.data).response.guests)
            setRecentRegistrations(JSON.parse(event.data).response.guests);
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
  }, [eventId]);

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

  useEffect(() => {
    const hostListMapping = {
      name: 'name',
      email: 'email',
      role: 'category',
      id: 'id',
    };
    if (hostList) {
      const transformedHostList = transformTableData(hostListMapping, hostList);
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
      }));

      setOpenAddModal(true);
    }

    if (hostId && hostId.type === 'delete') {
      const selectedHost = hostList.filter((host) => host.id === hostId.id)[0];

      setHostData((prevState) => ({
        ...prevState!,
        email: selectedHost?.email,
        role: selectedHost?.role,
        id: selectedHost?.id,
      }));
      setOpenDeleteModal(true);
    }
  }, [hostId]);

  const addHost = () => {
    setOpenAddModal(true);
  };

  const removeHostAccount = () => {
    removeHost(eventId, hostId.id, setOpenDeleteModal);
  };

  const onSubmit = () => {
    if (!hostData.id) addHosts(eventId, hostData.email, hostData.role, setHostData);
    if (hostData.id) updateHostRole(eventId, hostData.id, hostData.role, setHostData);
    setOpenAddModal(false);
  };

  return (
    <Theme>
      <>
        {openAddModal && (
          <AddHosts
            hostData={hostData}
            setHostData={setHostData}
            onSubmit={() => {
              onSubmit();
            }}
            onClose={() => {
              setOpenAddModal(false);
            }}
          />
        )}
        {openDeleteModal && (
          <dialog className={styles.onClickModal}>
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
                className={styles.button}
              >
                Remove Host
              </p>
              <p
                onClick={() => {
                  setOpenDeleteModal(false);
                }}
                className={styles.button}
              >
                Cancel
              </p>
            </div>
          </dialog>
        )}
        {recentRegistrations && hostList && recentRegistrations.length >= 0 ? (
          <div className={styles.overviewContainer}>
            <Header />
            <Glance tab='overview' />

            <div className={styles.buttons}>
              <Link to={`/${eventTitle}/guests`}>
                <SectionButton
                  buttonText='Guest List'
                  buttonColor='#7662FC'
                  icon={<HiUserGroup size={25} color='#7662FC' />}
                />
              </Link>

              <a href='#hosts'>
                <SectionButton
                  buttonText='Host List'
                  buttonColor='#C33D7B'
                  icon={<FaWrench size={25} color='#C33D7B' />}
                />
              </a>

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
                <Table tableHeading='Recent Registration' tableData={recentTableData} />
              )}
            </AnimatePresence>

            <div id='hosts'>
              <Table
                tableHeading='Event Hosts'
                tableData={hostListTableData}
                secondaryButton={<SecondaryButton buttonText='Add Hosts +' onClick={addHost} />}
                setHostId={setHostId}
              />
            </div>
          </div>
        ) : (
          <div className={styles.center}>
            <HashLoader color='#47C97E' size={50} />
          </div>
        )}
      </>
    </Theme>
  );
};

export default Overview;
