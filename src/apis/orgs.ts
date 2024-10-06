import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { DefaultListType } from './types';

export const createOrg = (eventTitle: string) => {
  const userEmail = localStorage.getItem('userEmail');
  privateGateway
    .post(makeMyPass.orgCreate, {
      title: eventTitle,
      email: userEmail,
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Org Created Successfully');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const listOrgs = (setOrgs: Dispatch<SetStateAction<DefaultListType[]>>) => {
  privateGateway
    .get(makeMyPass.listOrgs)
    .then((response) => {
      console.log(response);
      setOrgs(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const getOrgData = (
  orgId: string,
  setOrgTitle?: Dispatch<SetStateAction<string>>,
  setOrgData?: Dispatch<SetStateAction<DefaultListType | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.orgCRUD(orgId))
    .then((response) => {
      setOrgData && setOrgData(response.data.response);
      setOrgTitle && setOrgTitle(response.data.response.title);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};
