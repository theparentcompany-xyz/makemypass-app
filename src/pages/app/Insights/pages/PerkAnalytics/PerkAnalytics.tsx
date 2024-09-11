// import { useEffect, useState } from 'react';
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
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import { getPerkAnalytics } from '../../../../../apis/insights';
import { EventPerkClaimedHourly } from '../../../../../apis/types';
import EventHeader from '../../../../../components/EventHeader/EventHeader';
import Theme from '../../../../../components/Theme/Theme';
import styles from './PerkAnalytics.module.css';

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

const PerkAnalytics = () => {
  const [perkAnalytics, setPerkAnalytics] = useState<EventPerkClaimedHourly>({});
  const eventId = JSON.parse(sessionStorage.getItem('eventData')!)?.event_id;

  useEffect(() => {
    getPerkAnalytics(eventId, setPerkAnalytics);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: false, // Modified line
        precision: 0,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <Theme>
      <EventHeader previousPageNavigate='-1' />
      <div className={styles.perkAnalyticsContainer}>
        <div className={styles.registrationCount}>
          {Object.entries(perkAnalytics).map(
            ([ticketName, perkData]) =>
              Object.values(Object.values(perkData)).length > 0 && (
                <div key={ticketName} className={styles.ticketContainer}>
                  <p className={styles.ticketName}>Ticket: {ticketName}</p>
                  <div className={styles.perksContainer}>
                    {Object.entries(perkData).map(([perkName, perkClaimedData]) => (
                      <div key={perkName} className={styles.perkGraph}>
                        {Object.keys(perkClaimedData).length > 0 && (
                          <>
                            <h4>{perkName}</h4>
                            <Line
                              data={{
                                datasets: Object.entries(perkClaimedData).map(
                                  ([key, value], index) => ({
                                    label: key,
                                    data: value,
                                    fill: false,
                                    backgroundColor: colors[index],
                                    borderColor: colors[index],
                                  }),
                                ),
                              }}
                              options={options}
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ),
          )}
        </div>
      </div>
    </Theme>
  );
};

export default PerkAnalytics;
