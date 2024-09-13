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

import { getVenueAnalytics } from '../../../../../apis/insights';
import { HourlyDataVenue } from '../../../../../apis/types';
import EventHeader from '../../../../../components/EventHeader/EventHeader';
import Theme from '../../../../../components/Theme/Theme';
import styles from './VenueAnalytics.module.css';

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

const VenueAnalytics = () => {
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

  const [venueAnalytics, setVenueAnalytics] = useState<HourlyDataVenue>({});
  const eventId = JSON.parse(sessionStorage.getItem('eventData')!)?.event_id;

  useEffect(() => {
    getVenueAnalytics(eventId, setVenueAnalytics);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Theme>
      <div className={styles.detailedVenueAnalyticsContainer}>
        <EventHeader previousPageNavigate='-1' />
        <p className={styles.pageHeader}>Venue Detailed Analytics</p>
        <div className={styles.venuesContainer}>
          {Object.entries(venueAnalytics).map(([venueName, venueData]) => (
            <div key={venueName} className={styles.venueGraph}>
              <>
                <h4>Venue Name: {venueName}</h4>
                <Line
                  data={{
                    datasets: Object.entries(venueData).map(([key, value], index) => ({
                      label: key,
                      data: value,
                      fill: false,
                      backgroundColor: colors[index],
                      borderColor: colors[index],
                    })),
                  }}
                  options={options}
                />
              </>
            </div>
          ))}
        </div>
      </div>
    </Theme>
  );
};

export default VenueAnalytics;
