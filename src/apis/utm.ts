import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import type { UTMDataType } from '../pages/app/EventGlance/components/UTMManager/types';

export const getUTMList = (
  eventId: string,
  UTMData: UTMDataType,
  setUTMData: React.Dispatch<React.SetStateAction<UTMDataType>>,
  setFirstRender: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  privateGateway
    .get(makeMyPass.utmList(eventId))
    .then((response) => {
      setUTMData({
        ...UTMData,
        data: response.data.response,
      });
    })
    .catch(() => {
      toast.error('Error while fetching UTM');
    })
    .finally(() => {
      setFirstRender(false);
    });
};

export const createUTM = async (eventId: string, data: UTMDataType['data']) => {
  privateGateway.post(makeMyPass.createUtm(eventId), data).catch(() => {
    toast.error('UTM Fetching Failed');
  });
};
