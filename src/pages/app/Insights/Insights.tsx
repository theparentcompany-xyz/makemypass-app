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
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { useEffect, useRef, useState } from 'react';
import { HashLoader } from 'react-spinners';
import { connectPrivateSocket } from '../../../../services/apiGateway';
import { makeMyPassSocket } from '../../../../services/urls';
import { ChartData, AnalyticsData } from './types';
import Theme from '../../../components/Theme/Theme';
import Modal from '../../../components/Modal/Modal';
import { MdOutlinePublishedWithChanges } from 'react-icons/md';
import { editEvent } from '../../../apis/events';
import { IoCopyOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { getVisibility } from '../../../apis/insights';
import { getEventInfo } from '../../../apis/publicpage';
import { useNavigate, useParams } from 'react-router';
import { EventType } from '../../../apis/types';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';

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

const Insights = ({ type }: { type?: string }) => {
  const [message, setMessage] = useState<AnalyticsData>();
  const navigate = useNavigate();
  const [lineData, setLineData] = useState<ChartData>();
  const [lineData2, setLineData2] = useState<ChartData>();
  const [entryDateCount, setEntryDateCount] = useState<ChartData>();
  const [pieData, setPieData] = useState<ChartData>();
  const [venueBarData, setVenueBarData] = useState<ChartData>();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const expandedColors = [
    '#47C97E',
    '#7662FC',
    '#C33D7B',
    '#FBD85B',
    '#5B75FB',
    '#D2D4D7',
    '#3DB590',
    '#8A54E8',
    '#E34765',
    '#F7CA45',
    '#4A8AFF',
    '#BEC2C9',
    '#59D168',
    '#6270D9',
    '#A83C6F',
    '#FFE347',
    '#7C9BF2',
    '#E6E8EC',
    '#2EAF6D',
    '#9B4FD3',
  ];

  const eventId = useRef<string>('');
  const eventName = useRef<string>('');

  if (sessionStorage.getItem('eventData')) {
    eventId.current = JSON.parse(sessionStorage.getItem('eventData')!)?.event_id;
    eventName.current = JSON.parse(sessionStorage.getItem('eventData')!)?.event_name;
  }

  const [eventData, setEventData] = useState<EventType>();
  const { eventTitle } = useParams();

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

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
  });

  useEffect(() => {
    if (type === 'public' && eventTitle) {
      getEventInfo(eventTitle, setEventData);
    }
  }, [type, eventTitle]);

  useEffect(() => {
    if (eventData || eventId.current) {
      if (eventData && eventData.id) getVisibility(eventData.id, setIsPublished);
      else getVisibility(eventId.current, setIsPublished);
    }
  }, [eventData, type, eventId]);

  useEffect(() => {
    if (eventData && eventData.id) eventId.current = eventData.id;

    if (eventId)
      connectPrivateSocket({
        url: makeMyPassSocket.analytics(eventId.current),
        type: type,
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

          setVenueBarData({
            labels: Object.keys(lineBarData?.venue_analytics || {}),
            datasets: [
              {
                label: 'Venue Analytics',
                data: Object.values(lineBarData?.venue_analytics || {}),
                borderColor: expandedColors,
                backgroundColor: expandedColors,
              },
            ],
          });

          const sortedEntryDateCount = Object.entries(lineBarData?.entry_date_count || {}).sort(
            (a, b) => {
              const dateA = new Date(a[0]);
              const dateB = new Date(b[0]);
              return dateA.getTime() - dateB.getTime();
            },
          );

          setEntryDateCount({
            labels: sortedEntryDateCount.map((entry) => entry[0]),
            datasets: [
              {
                label: 'Entry Date Count',
                data: sortedEntryDateCount.map((entry) => entry[1]),
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
            labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
            datasets: [
              {
                label: 'Registration Time',
                data: [
                  lineBarData.active_timeframe.Morning || 0,
                  lineBarData.active_timeframe.Afternoon || 0,
                  lineBarData.active_timeframe.Evening || 0,
                  lineBarData.active_timeframe.Night || 0,
                ],
                backgroundColor: ['#35A1EB', '#47C97E', '#FBD85B', '#C33D7B'],
                borderColor: ['#35A1EB', '#47C97E', '#FBD85B', '#C33D7B'],
              },
            ],
          });
        };

        setSocket(ws);
      });
  }, [eventId, eventData]);

  const publishPage = () => {
    const eventData = new FormData();
    eventData.append('is_public_insight', isPublished ? 'false' : 'true');
    editEvent({ eventId: eventId.current, eventData, setIsPublished });
  };

  return (
    <Theme>
      <DashboardLayout
        prevPage='/events'
        tabName='insights'
        setShowPublishModal={setShowPublishModal}
      >
        {showPublishModal && (
          <Modal
            title='Publish'
            onClose={() => {
              setShowPublishModal(false);
            }}
          >
            <div className={styles.publicEventModal}>
              {!isPublished ? (
                <div>
                  <div className={styles.sectionContent1}>
                    <MdOutlinePublishedWithChanges size={25} color='white' />
                    <p className={styles.sectionText}>Publish a static website for this event</p>
                  </div>
                  <button
                    onClick={() => {
                      publishPage();
                    }}
                    className={styles.publishButton}
                  >
                    Publish
                  </button>
                </div>
              ) : (
                <div>
                  <div className={styles.sectionContent}>
                    <div className={styles.publicLinkField}>
                      <input
                        className={styles.publicLink}
                        value={`${import.meta.env.VITE_FRONTEND_URL}/${eventName.current}/public/insights`}
                        readOnly
                      />
                      <IoCopyOutline
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${import.meta.env.VITE_FRONTEND_URL}/${eventName.current}/public/insights`,
                          );
                          toast.success('Link copied to clipboard');
                        }}
                        className='pointer'
                      />
                    </div>
                    <div className={styles.alert}>Live on the web</div>

                    <div className={styles.publicLinkField}>
                      <textarea
                        rows={5}
                        className={styles.publicLink}
                        value={`<iframe src=${`${import.meta.env.VITE_FRONTEND_URL}/${eventName.current}/public/insights`} width="600" height="400" frameborder="0" scrolling="no"></iframe>
                                    `}
                        readOnly
                      />
                      <IoCopyOutline
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `<iframe src=${`${import.meta.env.VITE_FRONTEND_URL}/${eventName.current}/public/insights`} width="600" height="400" frameborder="0" scrolling="no"></iframe>`,
                          );
                          toast.success('Link copied to clipboard');
                        }}
                        className='pointer'
                      />
                    </div>
                  </div>
                  <div className={styles.buttons}>
                    <p
                      onClick={() => {
                        publishPage();
                        setShowPublishModal(false);
                      }}
                      className='pointer'
                    >
                      Unpublish
                    </p>
                    <button
                      onClick={() => {
                        window.open(
                          `${import.meta.env.VITE_FRONTEND_URL}/${eventName.current}/public/insights`,
                          '_blank',
                        );
                      }}
                      style={{
                        maxWidth: '100px',
                      }}
                      className={styles.publishButton}
                    >
                      View Site
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )}

        {lineData && lineData2 && pieData ? (
          <>
            <div className={styles.insightsOuterContainer}>
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
                        {message?.event_start_date && (
                          <p className={styles.lcount}>
                            {new Intl.DateTimeFormat('en-GB', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })
                              .format(new Date(message?.event_start_date))
                              .replace(/\s/g, '-')}
                          </p>
                        )}
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
                    <p className={styles.rightSectionHeading}>Registration Time</p>
                    <div className={styles.times}>
                      {message?.active_timeframe.Morning && (
                        <div className={styles.time}>
                          <p
                            style={{
                              color: '#35A1EB',
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
                              color: '#FBD85B',
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

                <div className={styles.pageVisitsCount}>
                  <div className={styles.countSection}>
                    <div className={styles.cLeftSection}>
                      <div className={styles.totalRegistered}>
                        <div className='row'>
                          <div>
                            <p className={styles.total}>Page Visits</p>
                            <p className={styles.count}>
                              {message?.page_visit.register_page.total
                                ? message?.page_visit.register_page.total
                                : '-'}{' '}
                              <span>Visits</span>
                            </p>
                          </div>
                          <div>
                            <p className={styles.total}>Unique Visits</p>
                            <p className={styles.count}>
                              {message?.page_visit.register_page.total_unique
                                ? message?.page_visit.register_page.total_unique
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
                            {message?.page_visit.register_page.yesterday
                              ? message?.page_visit.register_page.yesterday
                              : '-'}{' '}
                          </p>
                        </div>
                        <div className={styles.weeklyCount}>
                          <p className={styles.week}>This week</p>
                          <p className={styles.wcount}>
                            {' '}
                            {message?.page_visit.register_page.this_week
                              ? message?.page_visit.register_page.this_week
                              : '-'}{' '}
                          </p>
                        </div>
                      </div>
                      <div className={styles.liveTraffic}>
                        <p className={styles.live}>Conversion Rate Vs Page Visit</p>
                        <p className={styles.lcount}>
                          {' '}
                          {message?.page_visit.register_page.conversion_rate_vs_page_visit
                            ? Math.round(
                                message?.page_visit.register_page.conversion_rate_vs_page_visit *
                                  100,
                              ) / 100
                            : '-'}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {(message?.payment_analytics.total_paid_users ?? 0 > 0) && (
                  <div className={styles.paymentCounts}>
                    <div className={styles.logButton}>
                      <SecondaryButton
                        buttonText='View Logs'
                        onClick={() => {
                          navigate(`/${eventTitle}/payment-analytics`);
                        }}
                      />
                    </div>
                    <div className={styles.countSection}>
                      <div className={styles.cLeftSection}>
                        <div className={styles.totalRegistered}>
                          <p className={styles.total}>Payment Details</p>
                        </div>
                        <div className={styles.weeklyCounts}>
                          <div className={styles.weeklyCount}>
                            <p className={styles.live}>
                              Total Amount
                              {`(${message?.payment_analytics.total_paid_users ?? '0'})`}
                            </p>
                            <p className={styles.wcount}>
                              {message?.payment_analytics.total_amount?.toLocaleString('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                              }) || '-'}
                              <span>
                                {message?.payment_analytics.total_paid_percentage
                                  ? `(${Number(
                                      message?.payment_analytics.total_paid_percentage,
                                    ).toFixed(2)}%)`
                                  : ''}
                              </span>
                            </p>
                          </div>
                          <div className={styles.weeklyCount}>
                            <p className={styles.live}>
                              Paid Via App
                              {`(${message?.payment_analytics.platform_paid_users ?? '0'})`}
                            </p>
                            <p className={styles.wcount}>
                              {message?.payment_analytics.total_platform_payments?.toLocaleString(
                                'en-IN',
                                {
                                  style: 'currency',
                                  currency: 'INR',
                                },
                              ) || '-'}
                              <span>
                                {message?.payment_analytics.cash_in_hand_user_percent
                                  ? `(${Number(message?.payment_analytics.platform_paid_user_percent).toFixed(2)}%)`
                                  : ''}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className={styles.weeklyCounts}>
                          <div className={styles.weeklyCount}>
                            <p className={styles.live}>
                              Cash In Hand
                              {`(${message?.payment_analytics.cash_in_hand_users ?? '0'})`}
                            </p>
                            <p className={styles.wcount}>
                              {message?.payment_analytics.total_cash_in_hand?.toLocaleString(
                                'en-IN',
                                {
                                  style: 'currency',
                                  currency: 'INR',
                                },
                              ) || '-'}
                              <span>
                                {message?.payment_analytics.cash_in_hand_user_percent
                                  ? `(${Number(message?.payment_analytics.cash_in_hand_user_percent).toFixed(2)}%)`
                                  : ''}
                              </span>
                            </p>
                          </div>

                          <div className={styles.weeklyCount}>
                            <p className={styles.live}>Withdrawable</p>
                            <p className={styles.wcount}>
                              {message?.payment_analytics.with_drawable_amount?.toLocaleString(
                                'en-IN',
                                {
                                  style: 'currency',
                                  currency: 'INR',
                                },
                              ) || '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.insightsContainer}>
                {Object.entries(message?.organisation_count || {}).length > 0 && (
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
                )}

                {venueBarData && venueBarData.datasets[0].data.length > 0 && (
                  <div className={styles.registrationCount}>
                    <div className={styles.graphContainer}>
                      {venueBarData && venueBarData.datasets[0].data && (
                        <Bar options={options} data={venueBarData} />
                      )}
                    </div>
                  </div>
                )}

                {Object.entries(message?.referral_analytics || {}).length > 0 && (
                  <div className={styles.categorySection}>
                    <p className={styles.rightSectionHeading}>Referral Analytics</p>

                    <div className={styles.categories}>
                      <div className={styles.category}>
                        <p className={styles.categoryName}>Referral Code</p>
                        <p className={styles.categoryCount}>Registrations</p>

                        <p className={styles.categoryCount}>Amount(Rs.)</p>
                      </div>

                      {Object.entries(message?.referral_analytics || {}).map(([key, value]) => (
                        <div className={styles.category}>
                          <p className={styles.categoryName}>{key}</p>
                          <p className={styles.categoryCount}>{value.count}</p>

                          <p className={styles.categoryCount}>Rs.{value.amount}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {entryDateCount && entryDateCount.datasets[0].data.length > 0 && (
                  <div className={styles.registrationCount}>
                    <div className={styles.graphContainer}>
                      {entryDateCount && entryDateCount.datasets[0].data && (
                        <Bar options={options} data={entryDateCount} />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* <div className={styles.insightsContainer}>
                {Object.entries(message?.coupon_analytics || {}).length > 0 && (
                  <div className={styles.categorySection}>
                    <p className={styles.rightSectionHeading}>Referral Analytics</p>

                    <div className={styles.categories}>
                      <div className={styles.category}>
                        <p className={styles.categoryName}>Coupon Code</p>
                        <p className={styles.categoryCount}>Registrations</p>

                        <p className={styles.categoryCount}>Amount(Rs.)</p>
                      </div>

                      {Object.entries(message?.coupon_analytics || {}).map(([key, value]) => (
                        <div className={styles.category}>
                          <p className={styles.categoryName}>{key}</p>
                          <p className={styles.categoryCount}>{value.count}</p>

                          <p className={styles.categoryCount}>Rs.{value.amount}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div> */}
            </div>
          </>
        ) : (
          <div className={styles.center}>
            <HashLoader color={'#46BF75'} size={50} />
          </div>
        )}
      </DashboardLayout>
    </Theme>
  );
};

export default Insights;
