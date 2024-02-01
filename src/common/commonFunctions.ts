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
