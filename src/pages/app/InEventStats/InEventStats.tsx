import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import Confetti from 'react-confetti';

import { connectPrivateSocket } from '../../../../services/apiGateway';
import { makeMyPassSocket } from '../../../../services/urls';
import { formatDate } from '../../../common/commonFunctions';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import Glance from '../../../components/Glance/Glance';
import Modal from '../../../components/Modal/Modal';
import Theme from '../../../components/Theme/Theme';
import InputField from '../../auth/Login/InputField';
import { RoomType } from '../CheckIns/pages/ScanQR/types';
import { GuestsType } from '../Guests/types';
import type { ChartData } from '../Insights/types';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import styles from './InEventStats.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,

  LinearScale,
  BarElement,

  ArcElement,
);

const InEventStats = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
      },
    },
  };

  const doughnutOption = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  type LineDataSet = {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  };

  type DistrictData = {
    [district: string]: number;
  };

  const colors = [
    'rgb(71, 201, 126)',
    'rgb(251, 216, 91)',
    'rgb(53, 161, 235)',
    'rgb(195, 61, 123)',
    'rgb(210, 212, 215)',
    'rgb(203, 62, 62)',
    'rgb(200, 62, 203)',
    'rgb(158, 62, 203)',
    'rgb(65, 62, 203)',
    'rgb(203, 96, 62)',
    'rgb(62, 203, 203)',
    'rgb(62, 203, 76)',
    'rgb(225, 57, 57)',
  ];

  const [firstRender, setFirstRender] = useState(true);
  const [newUser, setNewUser] = useState<GuestsType>();

  const [lineData, setLineData] = useState<ChartData>();
  const [barData, setBarData] = useState<ChartData>();
  const [districtData, setDistrictData] = useState<DistrictData>({});
  const [showWelcome, setShowWelcome] = useState(true);
  const [totalCheckIns, setTotalCheckIns] = useState(0);
  const [roomNumber, setRoomNumber] = useState<RoomType>({
    showModel: false,
    roomNumber: sessionStorage.getItem('roomNumber') || '',
  } as RoomType);

  type DailyCount = {
    day: string;
    count: number;
    color?: string;
  };

  const [dailyCount, setDailyCount] = useState<DailyCount[]>([]);

  const [guests, setGuests] = useState<GuestsType[]>([]);
  const getLocalEventId = () => {
    return JSON.parse(sessionStorage.getItem('eventData') as string).event_id;
  };

  const eventId = getLocalEventId();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!firstRender)
      if (guests.length > 0) {
        setNewUser(guests[0]);

        setTimeout(() => {
          setNewUser({} as GuestsType);
        }, 5000);
      }
  }, [guests, firstRender]);

  useEffect(() => {
    if (newUser && newUser.name) {
      const audio = new Audio('/sounds/count.mp3');
      audio.play();
    }
  }, [newUser]);

  useEffect(() => {
    if (roomNumber.showModel && roomNumber.roomNumber) {
      sessionStorage.setItem('roomNumber', roomNumber.roomNumber);
    }
  }, [roomNumber]);

  useEffect(() => {
    if (eventId && (!roomNumber.showModel || !roomNumber.roomNumber))
      connectPrivateSocket({
        url: makeMyPassSocket.checkinInsights(eventId) + `?room_id=${roomNumber.roomNumber}`,
      }).then((ws) => {
        ws.onmessage = (event) => {
          const lineData = JSON.parse(event.data).response.time;
          setTotalCheckIns(JSON.parse(event.data).response.total_checkin);
          const barData = JSON.parse(event.data).response.bargraph;
          setDistrictData(barData);
          const dates = Object.keys(lineData || {});
          setDailyCount([]);
          const lineDataSet: LineDataSet[] = dates.map((date, index) => {
            const colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'];
            const borderColor = colors[index % colors.length];
            const backgroundColor = `rgba(${borderColor}, 0.5)`;

            setDailyCount((prev: DailyCount[]) => {
              const updatedDailyCount = [
                ...prev,
                {
                  day: date,
                  count: Object.values(lineData[date] || {}).reduce(
                    (a, b) => (a as number) + (b as number),
                    0,
                  ) as number,
                  color: borderColor,
                },
              ];
              return updatedDailyCount;
            });

            return {
              label: date,
              data: Object.values(lineData[date] || {}),
              borderColor,
              backgroundColor,
            };
          });

          setLineData({
            labels: Object.keys(lineData[dates[0]] || {}),
            datasets: lineDataSet,
          });

          setBarData({
            labels: Object.keys(barData || {}),
            datasets: [
              {
                label: 'Category-Wise Count',
                data: Object.values(barData || {}),
                borderWidth: 1,
                borderColor: colors,
                backgroundColor: colors,
              },
            ],
          });
        };

        setSocket(ws);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, roomNumber.showModel, roomNumber.roomNumber]);

  useEffect(() => {
    if (eventId && (!roomNumber.showModel || !roomNumber.roomNumber))
      connectPrivateSocket({
        url: makeMyPassSocket.guestCheckinList(eventId) + `?room_id=${roomNumber.roomNumber}`,
      }).then((ws) => {
        ws.onmessage = (event) => {
          if (JSON.parse(event.data).response.datas)
            setGuests(JSON.parse(event.data).response.datas);
          else if (JSON.parse(event.data).response.data) {
            if (firstRender) setFirstRender(false);
            const newGuest = JSON.parse(event.data).response.data;

            setGuests((prev) => {
              const updatedGuests = [newGuest, ...prev];

              return updatedGuests;
            });
          }
        };

        setSocket(ws);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, roomNumber.showModel, roomNumber.roomNumber]);

  useEffect(() => {
    return () => {
      socket?.close();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const findDistrictWithMostNumber = () => {
    let maxDistrict = null;
    let maxNumber = -Infinity;

    for (const district in districtData) {
      if (districtData[district] > maxNumber) {
        maxNumber = districtData[district];
        maxDistrict = {
          district: district,
          value: maxNumber,
        };
      }
    }

    return maxDistrict;
  };

  return (
    <Theme>
      {roomNumber.showModel && (
        <Modal
          title='Add Room Number'
          onClose={() => {
            setRoomNumber({ ...roomNumber, showModel: false });
          }}
        >
          <InputField
            id='roomNumber'
            type='text'
            name='roomNumber'
            icon={<></>}
            title='Enter Room Number'
            value={roomNumber.roomNumber}
            onChange={(e) => {
              setRoomNumber({ ...roomNumber, roomNumber: e.target.value });
            }}
          />
          <button
            className={styles.submitButton}
            onClick={() => {
              setRoomNumber({ ...roomNumber, showModel: false });
            }}
          >
            Confirm Room
          </button>
        </Modal>
      )}
      <DashboardLayout prevPage='-1' tabName='inevent' isLive={true}>
        <Glance tab='inevent' />
        <div className={styles.makemypassbranding}>
          <div className={`${styles.backgroundBrand}`}>
            <img src='/app/mmpcolor.webp' alt='makemypass logo' />
            <p className={styles.logoText}>MakeMyPass</p>
          </div>
        </div>
        <AnimatePresence>
          {showWelcome && newUser && newUser.name && (
            <>
              <div className={styles.backgroundBlur}></div>
              <Confetti className={styles.confetti} />
              <motion.dialog
                initial={{
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.5,
                }}
                open
                className={styles.welcomeContainer}
              >
                <img
                  src='/app/welcome.webp'
                  alt='welcome image with confetti for card '
                  className={styles.image}
                />
                <div className={styles.welcomeText}>
                  {newUser.category && <p className={styles.userType}>{newUser?.category}</p>}
                  <p className={styles.userName}>{newUser?.name}</p>
                  <p className={styles.userEmail}>{newUser?.email}</p>
                </div>
              </motion.dialog>
            </>
          )}
        </AnimatePresence>

        <div className={styles.insightsContainer}>
          <div className={styles.registrationCount}>
            {lineData && lineData.datasets.length > 0 ? (
              <Line options={options} data={lineData} />
            ) : (
              <p className={styles.noData}>No Data Yet, Check Back Later</p>
            )}

            {dailyCount.length > 0 && (
              <div className={styles.countSection}>
                <div className={styles.totalRegistered}>
                  <p className={styles.total}>Total Check-Ins</p>
                  <p className={styles.count}>
                    {totalCheckIns}
                    <span> guests</span>
                  </p>
                </div>
              </div>
            )}

            <div className={styles.countSection}>
              {dailyCount.length > 0 &&
                dailyCount.map((day, index) => (
                  <div key={index} className={styles.dailyCount}>
                    <p
                      style={{
                        color: day.color,
                      }}
                      className={styles.day}
                    >
                      {formatDate(day.day, false, true)}
                    </p>
                    <p className={styles.dcount}>
                      {day.count} <span>guests</span>
                    </p>
                  </div>
                ))}
            </div>
          </div>
          {barData && barData.datasets.length > 0 && barData.datasets[0].data.length > 0 && (
            <div className={styles.todayRegistered}>
              <div className={styles.graphContainer}>
                <>
                  <Bar options={doughnutOption} data={barData} />
                  <div className={styles.totalRegistered}>
                    <p className={styles.total}>
                      Top Category: {findDistrictWithMostNumber()?.district}&nbsp;
                      <span>
                        ({findDistrictWithMostNumber()?.value} <span>guests</span>)
                      </span>
                    </p>
                    <p className={styles.count}></p>
                  </div>
                </>
              </div>

              <div className={styles.districtsCount}>
                <div className={styles.scrollContainerr}>
                  {Object.keys(districtData).map((key, index) => (
                    <div key={index} className={styles.district} style={{ color: colors[index] }}>
                      {key}: {districtData[key]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {guests && guests.length > 0 && (
          <div className={styles.insightsContainer}>
            <div
              style={{
                borderRadius: '12px',
              }}
              className={styles.pageVisitsCount}
            >
              <div className={styles.checkInHeader}>
                <p className={styles.header}>Recent Check-Ins</p>
                <div className='row'>
                  <SecondaryButton
                    onClick={() => {
                      setShowWelcome(() => !showWelcome);
                    }}
                    buttonText={showWelcome ? 'Hide Card' : 'Show Card'}
                  />
                  <SecondaryButton
                    onClick={() => {
                      setRoomNumber({ ...roomNumber, showModel: true });
                    }}
                    buttonText={
                      roomNumber.roomNumber
                        ? `Room Number: ${roomNumber.roomNumber}`
                        : 'Add Room Number'
                    }
                  />
                </div>
              </div>
              <div className={styles.countSection}>
                <div className={styles.usersContainer}>
                  {guests.map((guest, index) => (
                    <div
                      key={index}
                      className={styles.user}
                      style={
                        index === 0
                          ? {
                              background: 'rgba(31, 185, 31, 0.1)',
                            }
                          : {
                              border: '1px solid rgba(255, 255, 255, 0.04)',
                              background: 'rgba(255, 255, 255, 0.04)',
                            }
                      }
                    >
                      <p className={styles.cuserName}>{guest.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </Theme>
  );
};

export default InEventStats;
