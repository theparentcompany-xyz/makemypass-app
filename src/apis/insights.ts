import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

import { privateGateway, publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import type { SubEventInsightsType } from '../pages/app/Insights/types';
import { AnalyticsData, EventPerkClaimedHourly, HourlyDataVenue } from './types';

export const getInsightsVisibility = (
  id: string,
  setVisibility: Dispatch<SetStateAction<boolean>>,
) => {
  publicGateway
    .get(makeMyPass.getAnalyticsVisibility(id))
    .then((response) => {
      setVisibility(response.data.response.public);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Visibility Data');
    });
};

export const getPerkAnalytics = (
  id: string,
  setPerkAnalytics: Dispatch<SetStateAction<EventPerkClaimedHourly>>,
) => {
  privateGateway
    .get(makeMyPass.getPerkAnalytics(id))
    .then((response) => {
      setPerkAnalytics(response.data.response);
    })
    .catch((error) => {
      toast.error(
        error.response.data.message.general[0] || 'Error in Fetching Perk Analytics Data',
      );
    });
};

export const getVenueAnalytics = (
  id: string,
  setVenueAnalytics: Dispatch<SetStateAction<HourlyDataVenue>>,
) => {
  privateGateway
    .get(makeMyPass.getVenueAnalytics(id))
    .then((response) => {
      setVenueAnalytics(response.data.response);
    })
    .catch((error) => {
      toast.error(
        error.response.data.message.general[0] || 'Error in Fetching Venue Analytics Data',
      );
    });
};

export const getPageViewAnalytics = (
  id: string,
  setVenueAnalytics: Dispatch<SetStateAction<AnalyticsData | undefined>>,
  setDataLoaded: Dispatch<SetStateAction<boolean>>,
) => {
  privateGateway
    .get(makeMyPass.getPageViewAnalytics(id))
    .then((response) => {
      setVenueAnalytics(response.data.response);
    })
    .catch((error) => {
      toast.error(
        error.response.data.message.general[0] || 'Error in Fetching Page View Analytics Data',
      );
    })
    .finally(() => {
      setDataLoaded(true);
    });
};

export const getSubEventAnalytics = (
  eventId: string,
  setSubEventAnalytics: Dispatch<SetStateAction<SubEventInsightsType | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.subEventAnalytics(eventId))
    .then((response) => {
      setSubEventAnalytics(response.data.response.sub_event_analytics);
    })
    .catch((error) => {
      toast.error(
        error.response.data.message.general[0] || 'Error in Fetching Sub Event Analytics Data',
      );
    });
};
