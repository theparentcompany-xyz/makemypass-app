import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import type { OrganizationType } from '../pages/app/Organization/OrganizationGlance/types';
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
  setOrganization: Dispatch<SetStateAction<OrganizationType>>,
) => {
  privateGateway
    .get(makeMyPass.orgCRUD(orgId))
    .then((response) => {
      setOrganization(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};
