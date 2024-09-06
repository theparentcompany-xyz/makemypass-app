import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';

export const sentPostEventMail = async (eventId: string, type: boolean) => {
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

export const sentTestMail = async (eventId: string, mailId: string, data?: Object | null) => {
  console.log(data);

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
  eventId: string,
  setPostEventStatus: React.Dispatch<React.SetStateAction<PostEventStatus | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.communicationPostEventStatus(eventId))
    .then((response) => {
      setPostEventStatus(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Post Event Status');
    });
};
