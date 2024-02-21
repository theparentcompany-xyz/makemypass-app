import { Dispatch, SetStateAction } from 'react';
import { getEventId } from '../apis/events';
interface transformTableDataType {
  [key: string]: string;
}

export const transformTableData = (
  recentTableMapping: Record<string, string>,
  recentRegistrations: transformTableDataType[],
) => {
  return recentRegistrations.map((registration) => {
    const transformedRegistration: Record<string, string> = {};

    for (const key in recentTableMapping) {
      if (Object.prototype.hasOwnProperty.call(recentTableMapping, key)) {
        const newKey = recentTableMapping[key];
        transformedRegistration[newKey] = registration[key];
      }
    }

    return transformedRegistration;
  });
};

export const getEventUUID = (eventTitle: string, setEventId: Dispatch<SetStateAction<string>>) => {
  let eventData = JSON.parse(localStorage.getItem('eventData') as string);

  if (!eventData)
    setTimeout(() => {
      eventData = JSON.parse(localStorage.getItem('eventData') as string);

      if (eventData) {
        if (eventData.event_name !== eventTitle) {
          localStorage.removeItem('eventData');
          getEventId(eventTitle ?? '');
        } else {
          setEventId(eventData.event_id);
        }
      }
    }, 2000);

  setEventId(eventData?.event_id);
};

export const formatDate = (dateString: string) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const date = new Date(dateString);

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Function to get the ordinal suffix for the day
  function getOrdinal(n: number) {
    return (
      n +
      (n % 10 === 1 && n % 100 !== 11
        ? 'st'
        : n % 10 === 2 && n % 100 !== 12
          ? 'nd'
          : n % 10 === 3 && n % 100 !== 13
            ? 'rd'
            : 'th')
    );
  }

  return `${getOrdinal(day)} ${month} ${year}`;
};

export function timeAgo(date: string | number | Date) {
  const currentDate = new Date().getTime();
  const timestamp = new Date(date).getTime();

  const timeDifference = currentDate - timestamp;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `today`;
  }
}
