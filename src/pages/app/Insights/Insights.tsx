import styles from './Insights.module.css';
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
import { useContext, useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners';
import { connectPrivateSocket } from '../../../../services/apiGateway';
import { makeMyPassSocket } from '../../../../services/urls';
import { ChartData, AnalyticsData } from './types';
import Theme from '../../../components/Theme/Theme';
import Glance from '../../../components/Glance/Glance';
import Header from '../../../components/EventHeader/EventHeader';
import { GlobalContext } from '../../../contexts/globalContext';

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

const Insights = () => {
  const [message, setMessage] = useState<AnalyticsData>();

  const [lineData, setLineData] = useState<ChartData>();
  const [lineData2, setLineData2] = useState<ChartData>();
  const [pieData, setPieData] = useState<ChartData>();

  const [socket, setSocket] = useState<WebSocket | null>(null);

  const { eventId } = useContext(GlobalContext);

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
      },
    },
    ticks: {
      precision: 0,
    },
  };

  useEffect(() => {
    return () => {
      socket?.close();
    };
  }, []);

  useEffect(() => {
    if (eventId)
      connectPrivateSocket({
        url: makeMyPassSocket.analytics(eventId),
      }).then((ws) => {
        ws.onmessage = (event) => {
          const lineBarData = JSON.parse(event.data).response;

          setMessage(lineBarData);

          setLineData({
            labels: Object.keys(lineBarData?.analytics || {}),
            datasets: [
              {
                label: 'Daily Analytics',
                data: Object.values(lineBarData?.analytics || {}),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
            ],
          });

          setLineData2({
            labels: Object.keys(lineBarData?.daily_analytics || {}),
            datasets: [
              {
                label: 'Daily Analytics',
                data: Object.values(lineBarData?.daily_analytics || {}),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
            ],
          });

          setPieData({
            labels: Object.keys(lineBarData.active_timeframe || {}),
            datasets: [
              {
                label: 'Active Time',
                data: Object.values(lineBarData.active_timeframe || {}),
                backgroundColor: ['#FBD85B', '#C33D7B', '#47C97E', '#35A1EB'],
                borderColor: ['#FBD85B', '#C33D7B', '#47C97E', '#35A1EB'],
              },
            ],
          });
        };

        setSocket(ws);
      });
  }, [eventId]);

  return (
    <Theme>
      <>
        {lineData && lineData2 && pieData ? (
          <>
            <div className={styles.insightsOuterContainer}>
              <div className={styles.glanceContainer}>
                <Header />
                <Glance tab='insights' />
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
                          {message?.total_reg} <span>guests</span>
                        </p>
                      </div>
                      <div className={styles.weeklyCounts}>
                        <div className={styles.weeklyCount}>
                          <p className={styles.week}>Yesterday</p>
                          <p className={styles.wcount}>{message?.yesterday_reg}</p>
                        </div>
                        <div className={styles.weeklyCount}>
                          <p className={styles.week}>This week</p>
                          <p className={styles.wcount}>{message?.week_count}</p>
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
                        {Object.entries(message?.category_percentages || {}).map(([key, value]) => (
                          <div className={styles.category}>
                            <p className={styles.categoryName}>{key}</p>
                            <p className={styles.categoryCount}>{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.todayRegistered}>
                  {lineData2 && <Line options={options} data={lineData2} />}
                  <div className={styles.countSection}>
                    <div className={styles.cLeftSection}>
                      <div className={styles.totalRegistered}>
                        <p className={styles.total}>Today Registered</p>
                        <p className={styles.count}>
                          {message?.today_reg} <span>guests</span>
                        </p>
                      </div>
                      <div className={styles.weeklyCounts}>
                        {Object.entries(message?.today_category || {}).map(([key, value]) => (
                          <div className={styles.weeklyCount}>
                            <p className={styles.week}>{key.substring(0, 8)}..</p>
                            <p className={styles.wcount}>{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className={styles.liveTraffic}>
                        <p className={styles.live}>Event Date</p>
                        <p className={styles.lcount}>{message?.event_date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.insightsContainer}>
                <div className={styles.pieContainer}>
                  <div className={styles.pieSection}>
                    {pieData && pieData.datasets[0].data.length > 0 ? (
                      <Doughnut
                        data={pieData}
                        options={{
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                        }}
                      />
                    ) : (
                      <p className={styles.noData}>No Data to Show</p>
                    )}
                  </div>
                  <div className={styles.timeSection}>
                    <p className={styles.rightSectionHeading}>Active Time</p>
                    <div className={styles.times}>
                      {message?.active_timeframe.Morning && (
                        <div className={styles.time}>
                          <p
                            style={{
                              color: '#FBD85B',
                            }}
                            className={styles.line}
                          >
                            {message?.active_timeframe.Morning}
                          </p>
                          <p className='type'>Morning</p>
                        </div>
                      )}

                      {message?.active_timeframe.Afternoon && (
                        <div className={styles.time}>
                          <p
                            style={{
                              color: '#47C97E',
                            }}
                            className={styles.line}
                          >
                            {message?.active_timeframe.Afternoon}
                          </p>
                          <p className='type'>Afternoon</p>
                        </div>
                      )}

                      {message?.active_timeframe.Evening && (
                        <div className={styles.time}>
                          <p
                            style={{
                              color: '#35A1EB',
                            }}
                            className={styles.line}
                          >
                            {message?.active_timeframe.Evening}
                          </p>
                          <p className='type'>Evening</p>
                        </div>
                      )}
                      {message?.active_timeframe.Night && (
                        <div className={styles.time}>
                          <p
                            style={{
                              color: '#C33D7B',
                            }}
                            className={styles.line}
                          >
                            {message?.active_timeframe.Night}
                          </p>
                          <p className='type'>Night</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: '12px',
                  }}
                  className={styles.pageVisitsCount}
                >
                  <div className={styles.countSection}>
                    <div className={styles.cLeftSection}>
                      <div className={styles.totalRegistered}>
                        <div className='row'>
                          <div>
                            <p className={styles.total}>Page Visits</p>
                            <p className={styles.count}>
                              {message?.page_visit.total ? message?.page_visit.total : '-'}{' '}
                              <span>Visits</span>
                            </p>
                          </div>
                          <div>
                            <p className={styles.total}>Unique Visits</p>
                            <p className={styles.count}>
                              {message?.page_visit.total_unique
                                ? message?.page_visit.total_unique
                                : '-'}{' '}
                              <span>Visits</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={styles.weeklyCounts}>
                        <div className={styles.weeklyCount}>
                          <p className={styles.week}>Yesterday</p>
                          <p className={styles.wcount}>
                            {' '}
                            {message?.page_visit.yesterday
                              ? message?.page_visit.yesterday
                              : '-'}{' '}
                          </p>
                        </div>
                        <div className={styles.weeklyCount}>
                          <p className={styles.week}>This week</p>
                          <p className={styles.wcount}>
                            {' '}
                            {message?.page_visit.this_week
                              ? message?.page_visit.this_week
                              : '-'}{' '}
                          </p>
                        </div>
                      </div>
                      <div className={styles.liveTraffic}>
                        <p className={styles.live}>Conversion Rate Vs Page Visit</p>
                        <p className={styles.lcount}>
                          {' '}
                          {message?.page_visit.conversion_rate_vs_page_visit
                            ? Math.round(message?.page_visit.conversion_rate_vs_page_visit * 100) /
                              100
                            : '-'}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: '12px',
                  }}
                  className={styles.paymentCounts}
                >
                  <div className={styles.countSection}>
                    <div className={styles.cLeftSection}>
                      <div className={styles.totalRegistered}>
                        <p className={styles.total}>Payment Details</p>
                        <p className={styles.count}>
                          {message?.payment_analytics.total_paid_users} <span>Paid Users</span>
                        </p>
                      </div>
                      <div className={styles.weeklyCounts}>
                        <div className={styles.weeklyCount}>
                          <p className={styles.week}>Total Amount</p>
                          <p className={styles.wcount}>
                            {message?.payment_analytics.total_amount?.toLocaleString('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                            }) || '-'}
                          </p>
                        </div>
                        <div className={styles.weeklyCount}>
                          <p className={styles.week}>Withdrawable</p>
                          <p className={styles.wcount}>
                            {message?.payment_analytics.total_withdraw?.toLocaleString('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                            }) || '-'}
                          </p>
                        </div>
                      </div>
                      <div className={styles.liveTraffic}>
                        <p className={styles.live}>Paid User %</p>
                        <p className={styles.lcount}>
                          {message?.payment_analytics.paid_user_percentage}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.categorySection}>
                  <p className={styles.rightSectionHeading}>Organization Counts</p>

                  <div className={styles.categories}>
                    {Object.entries(message?.organisation_count || {}).map(([key, value]) => (
                      <div className={styles.category}>
                        <p className={styles.categoryName}>{key}</p>
                        <p className={styles.categoryCount}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.center}>
            <HashLoader color={'#46BF75'} size={50} />
          </div>
        )}
      </>
    </Theme>
  );
};

export default Insights;
