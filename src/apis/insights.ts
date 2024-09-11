import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

import { privateGateway, publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { EventPerkClaimedHourly } from './types';

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

// export const getVenueAnalytics = (id: string, setVenueAnalytics: Dispatch<SetStateAction<any>>) => {
//   publicGateway
//     .get(makeMyPass.getVenueAnalytics(id))
//     .then((response) => {
//       setVenueAnalytics(response.data.response);
//     })
//     .catch((error) => {
//       toast.error(
//         error.response.data.message.general[0] || 'Error in Fetching Venue Analytics Data',
//       );
//     });
// };
