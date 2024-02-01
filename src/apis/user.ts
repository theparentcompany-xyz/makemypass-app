import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';

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
      console.log(error);
    });
};
