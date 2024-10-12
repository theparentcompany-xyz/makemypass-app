import { EventType } from '../../../../../apis/types';

const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th'; // covers 11th to 20th
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export const getFormatedStartAndEndTime = (eventData: EventType) => {
  const startDate = new Date(eventData?.event_start_date ?? '');
  const endDate = new Date(eventData?.event_end_date ?? '');
  const startTime = startDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const endTime = endDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const formatDateWithOrdinal = (date: Date) => {
    const day = date.getDate();
    const ordinalSuffix = getOrdinalSuffix(day);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString([], options).replace(day.toString(), `${day}${ordinalSuffix}`);
  };

  if (startDate.toDateString() !== endDate.toDateString()) {
    const endDateString = formatDateWithOrdinal(endDate);

    return `${startTime} - ${endDateString} ${endTime}`;
  }

  return `${startTime} - ${endTime}`;
};
