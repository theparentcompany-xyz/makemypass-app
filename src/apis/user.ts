import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { buildVerse, makeMyPass } from '../../services/urls';

type UserInfoType = {
  category: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  organization: string;
};

export const getUserInfo = async (
  eventId: string,
  ticketCode: string,
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfoType>>,
) => {
  return privateGateway
    .get(makeMyPass.userInfo(eventId, ticketCode))
    .then((response) => {
      setUserInfo({
        category: response.data.response.category,
        name: response.data.response.name,
        email: response.data.response.email,
        phone: response.data.response.phone_number,
        district: response.data.response.district,
        organization: response.data.response.organization,
      });
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching User Info');
    });
};

export const updateProfile = async ({ data }: { [k: string]: FormData }) => {
  return privateGateway
    .put(buildVerse.updateProfile, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => {
      toast.success('Profile Updated Successfully');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Updating Profile');
    });
};

export const setUserData = async ({ formData, token }: { formData: FormData; token: string }) => {
  return privateGateway
    .post(buildVerse.setUserData(token), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => {
      toast.success('Profile Updated Successfully');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Updating Profile');
    });
};
