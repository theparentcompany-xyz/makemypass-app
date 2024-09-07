import React, { Dispatch } from 'react';
import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { ErrorResponse, Field } from '../pages/app/FormBuilder/types';

export const getFormBuilderForm = (
  eventId: string,
  setFormFields: React.Dispatch<React.SetStateAction<Field[]>>,
) => {
  privateGateway
    .get(makeMyPass.formBuilderForm(eventId))
    .then((response) => {
      setFormFields(response.data.response);
    })
    .catch((error) => {
      throw error;
    });
};

export const updateFormBuilderForm = (
  eventId: string,
  formFields: Field[],
  setFormFieldErrors: Dispatch<React.SetStateAction<ErrorResponse>>,
) => {
  privateGateway
    .post(makeMyPass.formBuilderForm(eventId), formFields)
    .then(() => {
      toast.success('Form updated successfully');
    })
    .catch((error) => {
      setFormFieldErrors(error.response.data.message);
    });
};
