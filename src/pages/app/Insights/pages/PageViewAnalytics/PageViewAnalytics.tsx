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
import { Bar, Line } from 'react-chartjs-2';
import { HashLoader } from 'react-spinners';

import { getPageViewAnalytics } from '../../../../../apis/insights';
import EventHeader from '../../../../../components/EventHeader/EventHeader';
import GenericTable from '../../../../../components/Table/GenericTable';
import Theme from '../../../../../components/Theme/Theme';
import { transformData } from './functions';
import styles from './PageViewAnalytics.module.css';
import type { AnalyticsData } from './types';

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

const PageViewAnalytics = () => {
  const [pageViewAnalytics, setPageViewAnalytics] = useState<AnalyticsData | undefined>();
  const [dataLoaded, setDataLoaded] = useState(false);
  const eventId = JSON.parse(sessionStorage.getItem('eventData')!)?.event_id;

  useEffect(() => {
    getPageViewAnalytics(eventId, setPageViewAnalytics, setDataLoaded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pageViewAnalytics) {
      console.log(transformData(pageViewAnalytics.metadata));
      console.log(Object.keys(pageViewAnalytics.metadata));
    }
  }, [pageViewAnalytics]);

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

  interface UTMData {
    [key: string]: {
      [key: string]: number;
    };
  }

  const renderBarChart = (utmKey: string, utmData: UTMData) => {
    const allKeys: string[] = [
      ...new Set([
        ...Object.keys(utmData['Page view'] || {}),
        ...Object.keys(utmData['Register'] || {}),
      ]),
    ];

    const chartData = {
      labels: allKeys,
      datasets: [
        {
          label: 'Page View',
          data: allKeys.map((key) => utmData['Page view'][key] || 0),
          backgroundColor: 'rgb(71, 201, 126)',
          barPercentage: 0.9,
          categoryPercentage: 0.8,
        },
        {
          label: 'Register',
          data: allKeys.map((key) => utmData['Register'][key] || 0),
          backgroundColor: 'rgb(251, 216, 91)',
          barPercentage: 0.9,
          categoryPercentage: 0.8,
        },
      ],
    };

    const barOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' as const },
        title: { display: true, text: `UTM ${utmKey}` },
      },
      scales: {
        x: {
          stacked: false,
        },
        y: {
          stacked: false,
        },
      },
    };

    return (
      <div key={utmKey} className={styles.utmGraph}>
        <Bar data={chartData} options={barOptions} />
      </div>
    );
  };

  return (
    <Theme>
      <EventHeader previousPageNavigate='-1' />
      {dataLoaded ? (
        <>
          <div className={styles.pageGraphContainer}>
            <p className={styles.pageHeader}>Page View Analytics</p>
            <div className={styles.pageGraph}>
              <Line
                data={{
                  datasets: Object.entries(pageViewAnalytics?.page_to_reg_total ?? {}).map(
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
            </div>
          </div>

          <div className={styles.utmGraphContainer}>
            {pageViewAnalytics && pageViewAnalytics.utm && (
              <p className={styles.pageHeader}>UTM Analytics</p>
            )}
            <div className={styles.utmGraphContainer}>
              {pageViewAnalytics &&
                pageViewAnalytics.utm &&
                Object.entries(pageViewAnalytics.utm).map(([utmKey, utmData]) => {
                  if (Object.keys(utmData).length === 0) return null; // Skip empty utm sections
                  return renderBarChart(utmKey, utmData);
                })}
            </div>
          </div>

          <div className={styles.analyticsTableContainers}>
            {pageViewAnalytics &&
              pageViewAnalytics.metadata &&
              Object.keys(pageViewAnalytics.metadata).map((key) => (
                <div key={key} className={styles.analyticsTableContainer}>
                  <GenericTable
                    tableData={transformData(pageViewAnalytics.metadata)[key]}
                    tableHeading={
                      key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) + ' Analytics'
                    }
                  />
                </div>
              ))}
          </div>
        </>
      ) : (
        <div className='center'>
          <HashLoader color={'#46BF75'} size={50} />
        </div>
      )}
    </Theme>
  );
};

export default PageViewAnalytics;
