import { Dispatch, SetStateAction } from 'react';
import { getEventId } from '../apis/events';
import { EventType, TicketType } from '../apis/types';
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
  let eventData = JSON.parse(sessionStorage.getItem('eventData') as string);

  if (!eventData)
    setTimeout(() => {
      eventData = JSON.parse(sessionStorage.getItem('eventData') as string);

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

export const formatDate = (dateString: string, withTime?: boolean, justDate?: boolean) => {
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

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const year = date.getFullYear();
  const dayOfWeekText = date.toLocaleString('en-US', { weekday: 'long' });

  if (!withTime)
    if (justDate) return `${getOrdinal(day)} ${month}`;
    else return `${getOrdinal(day)} ${month} ${year}, ${dayOfWeekText}`;
  return `${getOrdinal(day)} ${month} at ${formattedHours}:${formattedMinutes} ${ampm}`;
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

export const getCurrentTimezone = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const hours = offset / 60;
  const sign = hours < 0 ? '+' : '-';
  const absOffset = Math.abs(hours);
  const formattedHourOffset = `${Math.floor(absOffset)}`.padStart(2, '0');
  const formattedMinuteOffset = `${Math.round((absOffset % 1) * 60)}`.padStart(2, '0');
  const gmtString = `GMT ${sign}${formattedHourOffset}:${formattedMinuteOffset}`;
  return { zoneName: timezone, offset: gmtString };
};

//this function was made to send a converted date to backend
export function convertDate(date: Date | undefined) {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  // const ampm = Number(hours) >= 12 ? 'PM' : 'AM';
  // const formattedHours = String(Number(hours) % 12 || 12).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const findMinDate = (eventData: EventType): Date | null => {
  const todayDate: Date = new Date();
  let minDate: Date | null = null;

  eventData.tickets.forEach((ticket: TicketType) => {
    ticket.entry_date.forEach((entry) => {
      const entryDate = new Date(entry.date);
      if (entryDate >= todayDate && (entry.capacity === null || entry.capacity > 0)) {
        if (minDate === null || entryDate < minDate) {
          minDate = entryDate;
        }
      }
    });
  });
  return minDate;
};

export const findMaxDate = (eventData: EventType): Date | null => {
  const todayDate: Date = new Date();
  let maxDate: Date | null = null;

  eventData.tickets.forEach((ticket: TicketType) => {
    ticket.entry_date.forEach((entry) => {
      const entryDate = new Date(entry.date);
      if (entryDate > todayDate && (entry.capacity === null || entry.capacity > 0)) {
        if (maxDate === null || entryDate > maxDate) {
          maxDate = entryDate;
        }
      }
    });
  });
  return maxDate;
};
