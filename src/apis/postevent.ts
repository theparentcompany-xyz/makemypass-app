import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';

export const sentPostEventMail = async (eventId: string, type: boolean) => {
  try {
    await privateGateway.post(makeMyPass.communcationPostEventSendMail(eventId), {
      checkedin_user: type,
    });
    toast.success('Mail Sent Successfully');
  } catch (e) {
    toast.error('Mail Sent Failed');
  }
};

export const sentTextMail = async (eventId: string, mailId: string) => {
  try {
    await privateGateway.post(makeMyPass.communicationMailTest(eventId, mailId));
    toast.success('Mail Sent Successfully');
  } catch (e) {
    toast.error('Mail Sent Failed');
  }
};

export const getPostEventStatus = async (
  eventId: string,
  setPostEventStatus: React.Dispatch<React.SetStateAction<PostEventStatus | undefined>>,
) => {
  try {
    const response = await privateGateway.get(makeMyPass.communicationPostEventStatus(eventId));
    setPostEventStatus(response.data.response);
  } catch (e) {
    toast.error('Error getting post event status');
  }
};
