import Glance from '../../../components/Glance/Glance';
import Theme from '../../../components/Theme/Theme';
import Header from '../../../components/EventHeader/EventHeader';
import styles from './InEventStats.module.css';

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
import { Line, Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { AnalyticsData, ChartData } from '../Insights/types';
import { guests } from '../Guests/types';
import { useParams } from 'react-router-dom';
import { connectPrivateSocket } from '../../../../services/apiGateway';
import { makeMyPassSocket } from '../../../../services/urls';
import { getEventId } from '../../../apis/events';

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

  const [message, setMessage] = useState<AnalyticsData>();

  const [lineData, setLineData] = useState<ChartData>();
  const [barData, setBarData] = useState<ChartData>();

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
    if (eventId)
      connectPrivateSocket({
        url: makeMyPassSocket.checkInAnalytics(eventId),
      }).then((ws) => {
        ws.onmessage = (event) => {
          const lineBarData = JSON.parse(event.data).response['2024-01-28'];
          setMessage(lineBarData);
          setLineData({
            labels: Object.keys(lineBarData || {}),
            datasets: [
              {
                label: 'Daily Analytics',
                data: Object.values(lineBarData || {}),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
            ],
          });

          setBarData({
            labels: Object.keys(lineBarData?.today_category || {}),
            datasets: [
              {
                label: 'Category Count',
                data: Object.values(lineBarData?.today_category || {}),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
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

  return (
    <Theme>
      <>
        <div className={styles.inEventContainer}>
          <Header />
          <Glance tab='inevent' />
        </div>

        <div className={styles.insightsContainer}>
          <div className={styles.registrationCount}>
            <div className={styles.graphContainer}>
              {lineData && <Line options={options} data={lineData} />}
            </div>
            <div className={styles.countSection}>
              <div className={styles.cLeftSection}>
                <div className={styles.totalRegistered}>
                  <p className={styles.total}>Total Registered</p>
                  <p className={styles.count}>
                    {guests.length}
                    <span> guests</span>
                  </p>
                </div>
                <div className={styles.weeklyCounts}>
                  <div className={styles.weeklyCount}>
                    <p className={styles.week}>Yesterday</p>
                    <p className={styles.wcount}>-</p>
                  </div>
                  <div className={styles.weeklyCount}>
                    <p className={styles.week}>This week</p>
                    <p className={styles.wcount}>-</p>
                  </div>
                </div>
                <div className={styles.liveTraffic}>
                  <p className={styles.live}>Live Traffic</p>
                  <p className={styles.lcount}>_</p>
                </div>
              </div>
              <div className={styles.cRightSection}>
                <p className={styles.rightSectionHeading}>Total Category %</p>

                <div className={styles.categories}>
                  {/* <div className={styles.category}>
                    <p className={styles.categoryName}>Student</p>
                    <p className={styles.categoryCount}>100%</p>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.todayRegistered}>
            <div className={styles.graphContainer}>
              {barData && <Bar options={options} data={barData} />}
            </div>
            <div className={styles.totalRegistered}>
              <p className={styles.total}>Today Registered</p>
              <p className={styles.count}>
                - <span>guests</span>
              </p>
            </div>
            <div className={styles.weeklyCounts}>
              <div className={styles.weeklyCount}>
                <p className={styles.week}>Student</p>
                <p className={styles.wcount}>-</p>
              </div>
            </div>
            <div className={styles.liveTraffic}>
              <p className={styles.live}>Event Date</p>
              <p className={styles.lcount}>3rd February</p>
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
                      <p className={styles.userName}>{guest.name}</p>
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
