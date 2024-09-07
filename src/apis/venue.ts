import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { formatDate } from '../common/commonFunctions';
import { VenueType } from '../pages/app/CheckIns/pages/Venue/types';
import { LogType } from '../pages/app/CheckIns/pages/Venue/Venue';
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

export const createEventVenue = async (
  eventId: string,
  venueName: string,
  setVenues: Dispatch<SetStateAction<VenueCRUDType>>,
) => {
  privateGateway
    .post(makeMyPass.eventVenueCreate(eventId), {
      name: venueName,
    })
    .then((response) => {
      toast.success(response.data.response.message);
      setVenues((prev) => ({
        ...prev,
        venueList: [
          ...prev.venueList,
          {
            id: response.data.response.venue_id,
            name: venueName,
            count: 0,
          },
        ],
      }));
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const updateEventVenue = async (
  eventId: string,
  venue: VenueType,
  setVenues: Dispatch<SetStateAction<VenueCRUDType>>,
) => {
  privateGateway
    .put(makeMyPass.eventVenueUpdate(eventId, venue.id), {
      name: venue.name,
    })
    .then((response) => {
      toast.success(response.data.message.general[0]);
      setVenues((prev) => ({
        ...prev,
        venueList: prev.venueList.map((item) => {
          if (item.id === venue.id) {
            return {
              ...item,
              name: venue.name,
            };
          }
          return item;
        }),
      }));
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const deleteEventVenue = async (eventId: string, venueId: string) => {
  privateGateway
    .delete(makeMyPass.eventVenueUpdate(eventId, venueId))
    .then((response) => {
      toast.success(response.data.message.general[0]);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
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
