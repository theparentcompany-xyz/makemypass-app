import { Dispatch } from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import toast from 'react-hot-toast';
import { VenueType } from '../pages/app/CheckIns/pages/Venue/types';
import { LogType } from '../pages/app/CheckIns/pages/Venue/Venue';
import { formatDate } from '../common/commonFunctions';
import { VenueCRUDType } from './types';

export const listGuestVenues = async (
  eventId: string,
  setVenue: Dispatch<React.SetStateAction<VenueType[]>>,
) => {
  privateGateway
    .get(makeMyPass.scanGuestVenueList(eventId))
    .then((response) => {
      setVenue(response.data.response.venues);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const listEventVenues = async (
  eventId: string,
  setVenue: Dispatch<React.SetStateAction<VenueCRUDType>>,
) => {
  privateGateway
    .get(makeMyPass.eventVenueList(eventId))
    .then((response) => {
      setVenue((prev) => ({
        ...prev,
        venueList: response.data.response.venues,
      }));
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const updateEventVenueList = (venues: VenueType[], eventId: string) => {
  return new Promise((resolve, reject) => {
    privateGateway
      .post(makeMyPass.eventVenueUpdate(eventId), {
        venues,
      })
      .then((response) => {
        toast.success(response.data.message.general[0]);
        resolve(response.data.message.general[0]);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const checkInUserVenue = async (
  ticketCode: string,
  eventId: string,
  selectedVenue: VenueType | null,
  setScanLogs: Dispatch<React.SetStateAction<LogType[]>>,
) => {
  if (selectedVenue)
    privateGateway
      .post(makeMyPass.scanGuestVenueCheckin(eventId), {
        venue_id: selectedVenue?.id,
        ticket_code: ticketCode,
      })
      .then((response) => {
        setScanLogs((prev) => [
          ...prev,
          {
            message: `${response.data.message.general[0]}`,
            timestamp: formatDate(new Date().toString(), true),
            hasError: false,
          },
        ]);
      })
      .catch((error) => {
        setScanLogs((prev) => [
          ...prev,
          {
            message: `${error.response.data.message.general[0]}`,
            timestamp: formatDate(new Date().toString(), true),
            hasError: true,
          },
        ]);
      });
  else {
    toast.error('Please select a venue to check-in');
  }
};
