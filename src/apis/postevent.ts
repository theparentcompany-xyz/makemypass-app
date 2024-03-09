import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';

export const sentPostEventMail = async (eventId: string, type: boolean) => {
  privateGateway.post(makeMyPass.sentPostMail(eventId), {
    checkedin_user: type,
  });
};
