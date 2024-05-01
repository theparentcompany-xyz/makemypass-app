import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';

export const getForm = (
  eventId: string,
  setFormFields: React.Dispatch<React.SetStateAction<never[]>>,
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
