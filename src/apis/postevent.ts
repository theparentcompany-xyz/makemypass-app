import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';

export const sentPostEventMail = async (eventId: string, type: boolean) => {
  privateGateway.post(makeMyPass.sentPostMail(eventId), {
    checkedin_user: type,
  });
};

export const sentTextMail = async (eventId: string, mailId: string) => {
  privateGateway
    .post(makeMyPass.sentTestMail(eventId, mailId))
    .then(() => {
      toast.success('Mail Sent Successfully');
    })
    .catch(() => {
      toast.error('Mail Sent Failed');
    });
};

export const getPostEventStatus = async (
  eventId: string,
  setPostEventStatus: React.Dispatch<React.SetStateAction<PostEventStatus | undefined>>,
) => {
  try {
    const response = await privateGateway.get(makeMyPass.getPostEventStatus(eventId));
    setPostEventStatus(response.data.response);
  } catch (e) {
    toast.error('Error getting post event status');
  }
};
