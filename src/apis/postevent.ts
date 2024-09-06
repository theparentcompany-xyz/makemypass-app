import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';

export const sentPostEventMail = async (type: boolean) => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  privateGateway
    .post(makeMyPass.communcationPostEventSendMail(eventId), {
      checkedin_user: type,
    })
    .then((response) => {
      toast.success(response.data.message.general[0]);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Sending Post Event Mail');
    });
};

export const sentTestMail = async (mailId: string, data?: Object | null) => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  privateGateway
    .post(makeMyPass.communicationMailTest(eventId, mailId), data)
    .then((response) => {
      toast.success(response.data.message.general[0]);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Sending Test Mail');
    });
};

export const getPostEventStatus = async (
  setPostEventStatus: React.Dispatch<React.SetStateAction<PostEventStatus | undefined>>,
) => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  privateGateway
    .get(makeMyPass.communicationPostEventStatus(eventId))
    .then((response) => {
      setPostEventStatus(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Post Event Status');
    });
};
