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
        phone: response.data.response.phonenumber,
        district: response.data.response.district,
        organization: response.data.response.organization,
      });
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching User Info');
    });
};

export const updateProfile = async (
  { data }: { [k: string]: FormData },
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setLoading && setLoading(true);
  const toastId = toast.loading('Updating Profile...');
  return privateGateway
    .put(buildVerse.updateProfile, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => {
      toast.success('Profile Updated Successfully', {
        id: toastId,
      });
    })
    .catch((error) => {
      toast.error(error.response?.data?.message?.general[0] || 'Error in Updating Profile', {
        id: toastId,
      });
    })
    .finally(() => {
      setLoading && setLoading(false);
    });
};

export const updateProfilePassword = async (
  { data }: { [k: string]: FormData },
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const toastId = toast.loading('Updating Password...');
  return privateGateway
    .post(
      buildVerse.updateProfilePassword,
      {
        old_password: data.get('current_password'),
        new_password: data.get('new_password'),
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    .then(() => {
      toast.success('Password Updated Successfully', {
        id: toastId,
      });
    })
    .catch((error) => {
      toast.error(error.response?.data?.message?.general[0] || 'Error in Updating Password', {
        id: toastId,
      });
    })
    .finally(() => {
      setLoading && setLoading(false);
    });
};

export const setUserData = async ({
  formData,
  token,
  setLoading,
}: {
  formData: FormData;
  token: string;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  setLoading && setLoading(true);
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
      toast.error(error?.response?.data?.message.general[0] || 'Error in Updating Profile');
    })
    .finally(() => {
      setLoading && setLoading(false);
    });
};

export const getProfileInfo = (): Promise<{
  name?: string;
  email?: string;
  profile_pic?: string;
}> => {
  return privateGateway
    .get(buildVerse.profileInfo)
    .then((response) => {
      return response.data.response;
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Profile Info');
    });
};
