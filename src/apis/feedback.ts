import toast from 'react-hot-toast';
import { privateGateway, publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { ErrorMessages, FormDataType, FormFieldType } from './types';
import { Dispatch } from 'react';

export type Data = {
  title: string;
  description: string;
};

export const getPostEventFields = (
  eventId: string,
  setFormFields: Dispatch<React.SetStateAction<FormFieldType[]>>,
  setData: Dispatch<React.SetStateAction<Data>>,
) => {
  publicGateway
    .get(makeMyPass.getPostEventFields(eventId))
    .then((response) => {
      setFormFields(response.data.response.questions);
      setData({
        title: response.data.response.title,
        description: response.data.response.description,
      });
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Form Fields');
    });
};

// export const addFeedback = (eventId: string, formData: FormDataType, setFormErrors: Dispatch<React.SetStateAction<ErrorMessages>>) => {

// }

export const getPostEventCategories = (eventId: string) => {
  publicGateway
    .get(makeMyPass.getPostEventCategories(eventId))
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Categories fetched successfully');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Categories fetching failed');
    });
};

export const getFeedback = (eventId: string, setFeedback: any) => {
  privateGateway
    .get(makeMyPass.getFeedback(eventId))
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Feedback fetched successfully');
      setFeedback(response.data.response.feedbacks);
      console.log(response.data.response.feedbacks);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Feedback fetching failed');
    });
};

export const submitFeedback = (
  eventId: string,
  formData: FormDataType,
  setFormErrors: Dispatch<React.SetStateAction<ErrorMessages>>,
  setSuccess: Dispatch<React.SetStateAction<string>>,
  setFormData: Dispatch<React.SetStateAction<FormDataType>>,
) => {
  privateGateway
    .post(makeMyPass.submitFeedback(eventId), formData)
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Feedback submitted successfully');
      setSuccess && setSuccess(response.data.response.code);

      setTimeout(() => {
        setSuccess && setSuccess('');
        setFormData && setFormData({});
      }, 2000);
    })
    .catch((error) => {
      toast.error('Error in Registering Event');
      if (setFormErrors) setFormErrors(error.response.data.message);
    });
};
