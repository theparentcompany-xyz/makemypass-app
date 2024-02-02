import Glance from '../../../components/Glance/Glance';
import Theme from '../../../components/Theme/Theme';
import Header from '../../../components/EventHeader/EventHeader';
import styles from './InEventStats.module.css';
import { AnimatePresence, motion } from 'framer-motion';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { ChartData } from '../Insights/types';
import { guests } from '../Guests/types';
import { useParams } from 'react-router-dom';
import { connectPrivateSocket } from '../../../../services/apiGateway';
import { makeMyPassSocket } from '../../../../services/urls';
import { getEventId } from '../../../apis/events';
import Confetti from 'react-confetti';

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
  const [newUser, setNewUser] = useState<guests>();

  const [lineData, setLineData] = useState<ChartData>();
  const [barData, setBarData] = useState<ChartData>();
  const [districtData, setDistrictData] = useState<DistrictData>({});

  const [guests, setGuests] = useState<guests[]>([]);
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

  const { eventTitle } = useParams<{ eventTitle: string }>();
  const eventId = getLocalEventId();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!firstRender)
      if (guests.length > 0) {
        setNewUser(guests[0]);

        setTimeout(() => {
          setNewUser({} as guests);
        }, 5000);
      }
  }, [guests, firstRender]);

  useEffect(() => {
    if (eventId)
      connectPrivateSocket({
        url: makeMyPassSocket.checkInAnalytics(eventId),
      }).then((ws) => {
        ws.onmessage = (event) => {
          const lineData = JSON.parse(event.data).response.time;
          const barData = JSON.parse(event.data).response.district;
          setDistrictData(barData);

          const dates = Object.keys(lineData || {});

          const lineDataSet: LineDataSet[] = dates.map((date, index) => {
            const colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'];
            const borderColor = colors[index % colors.length];
            const backgroundColor = `rgba(${borderColor}, 0.5)`;

            return {
              label: date,
              data: Object.values(lineData[date] || {}),
              borderColor,
              backgroundColor,
            };
          });

          setLineData({
            labels: Object.keys(lineData['2024-02-02'] || {}),
            datasets: lineDataSet,
          });

          setBarData({
            labels: Object.keys(barData || {}),
            datasets: [
              {
                label: 'District-Wise Count',
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
  }, [eventId]);

  useEffect(() => {
    if (eventId)
      connectPrivateSocket({
        url: makeMyPassSocket.listCheckinGuests(eventId),
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
  }, [eventId]);

  useEffect(() => {
    return () => {
      socket?.close();
    };
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
      <>
        <AnimatePresence>
          {newUser && newUser.name && (
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
                <img src='/app/welcome.png' alt='' className={styles.image} />
                <div className={styles.welcomeText}>
                  <p className={styles.userType}>{newUser.category}</p>
                  <p className={styles.userName}>{newUser.name}</p>
                  <p className={styles.userEmail}>{newUser.email}</p>
                </div>
              </motion.dialog>
            </>
          )}
        </AnimatePresence>

        <div className={styles.inEventContainer}>
          <Header />
          <Glance tab='inevent' />
        </div>

        <div className={styles.insightsContainer}>
          <div className={styles.registrationCount}>
            {lineData && <Line options={options} data={lineData} />}

            <div className={styles.countSection}>
              <div className={styles.totalRegistered}>
                <p className={styles.total}>Total Check-Ins</p>
                <p className={styles.count}>
                  {guests.length}
                  <span> guests</span>
                </p>
              </div>
            </div>
          </div>

          <div className={styles.todayRegistered}>
            <div className={styles.graphContainer}>
              {barData && <Doughnut options={doughnutOption} data={barData} />}
            </div>

            <div className={styles.totalRegistered}>
              <p className={styles.total}>Top District: {findDistrictWithMostNumber()?.district}</p>
              <p className={styles.count}>
                {findDistrictWithMostNumber()?.value} <span>guests</span>
              </p>
            </div>
            <div className={styles.districtsCount}>
              <div className={styles.scrollContainer}>
                {Object.keys(districtData).map((key, index) => (
                  <div
                    key={index}
                    className={styles.district}
                    style={{ color: colors[index % colors.length] }}
                  >
                    {key}: {districtData[key]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.insightsContainer}>
          <div
            style={{
              borderRadius: '12px',
            }}
            className={styles.pageVisitsCount}
          >
            <p className={styles.header}>Recent Check-Ins</p>
            <div className={styles.countSection}>
              <div className={styles.usersContainer}>
                {guests &&
                  guests.length > 0 &&
                  guests.map((guest, index) => (
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
      </>
    </Theme>
  );
};

export default InEventStats;
