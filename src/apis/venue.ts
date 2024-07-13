import { Dispatch } from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import toast from 'react-hot-toast';
import { VenueType } from '../pages/app/CheckIns/pages/Venue/types';

export const listVenues = async (
  eventId: string,
  setVenue: Dispatch<React.SetStateAction<VenueType[]>>,
) => {
  privateGateway
    .get(makeMyPass.listVenues(eventId))
    .then((response) => {
      setVenue(response.data.response.venues);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const checkInUserVenue = async (
  ticketCode: string,
  eventId: string,
  selectedVenue: VenueType | null,
  setShowScanner: Dispatch<React.SetStateAction<boolean>>,
) => {
  if (selectedVenue)
    privateGateway
      .post(makeMyPass.checkInUserVenue(ticketCode, eventId), {
        venue_id: selectedVenue?.id,
      })
      .then((response) => {
        toast.success(response.data.message.general[0] || 'User checked in successfully');
        setShowScanner(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message.general[0] || 'Unable to process the request');
      });
  else {
    toast.error('Please select a venue to check-in');
  }
};
