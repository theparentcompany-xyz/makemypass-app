import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { Field } from '../pages/app/FormBuilder/types';

export const getForm = (
  eventId: string,
  setFormFields: React.Dispatch<React.SetStateAction<Field[]>>,
) => {
  privateGateway
    .get(makeMyPass.formBuilderGetForm(eventId))
    .then((response) => {
      setFormFields(response.data.response);
    })
    .catch((error) => {
      throw error;
    });
};

export const updateForm = (eventId: string, formFields: Field[]) => {
  privateGateway
    .post(makeMyPass.formBuilderUpdateForm(eventId), formFields)
    .then(() => {
      toast.success('Form updated successfully');
    })
    .catch((error) => {
      throw error;
    });
};
