import React, { Dispatch } from 'react';
import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import type { ErrorResponse, Field } from '../pages/app/FormBuilder/types';

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
  setLoading?: Dispatch<React.SetStateAction<boolean>>,
) => {
  setLoading && setLoading(true);
  privateGateway
    .post(makeMyPass.formBuilderForm(eventId), formFields)
    .then(() => {
      toast.success('Form updated successfully');
    })
    .catch((error) => {
      setFormFieldErrors(error.response.data.message);
    })
    .finally(() => {
      setLoading && setLoading(false);
    });
};

export const closeFormMessage = (
  eventId: string,
  followupMessage: string,
  showFollowupMessage: boolean,
) => {
  privateGateway
    .patch(makeMyPass.closeForm(eventId), {
      close_form: showFollowupMessage,
      form_close_message: followupMessage,
    })
    .then(() => {
      toast.success('Form message closed successfully');
    })
    .catch((error) => {
      throw error;
    });
};

export const getCloseFormMessage = (
  eventId: string,
  setShowFollowupMessage: React.Dispatch<React.SetStateAction<boolean>>,
  setFollowupMessage: React.Dispatch<React.SetStateAction<string>>,
) => {
  privateGateway
    .get(makeMyPass.closeForm(eventId))
    .then((response) => {
      setShowFollowupMessage(response.data.response.close_form);
      setFollowupMessage(response.data.response.form_close_message);
    })
    .catch((error) => {
      throw error;
    });
};
