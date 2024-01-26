import toast from "react-hot-toast";
import { privateGateway, publicGateway } from "../../services/apiGateway";
import { buildVerse, makeMyPass } from "../../services/urls";

export const login = async (
  email: string,
  password: string,
  setIsAuthenticated: (arg0: boolean) => void,
  isOtpSent?: boolean,
) => {
  type LoginData = {
    email: string;
    otp?: string;
    password?: string;
  };

  const data: LoginData = {
    email: email,
  };

  if (isOtpSent) {
    data["otp"] = password;
  } else {
    data["password"] = password;
  }

  publicGateway
    .post(buildVerse.login, data, {
      headers: {
        product: "buildverse",
      },
    })
    .then((response) => {
      const userEmail = email.split("@")[0];
      localStorage.setItem("accessToken", response.data.response.access_token);
      localStorage.setItem(
        "refreshToken",
        response.data.response.refresh_token,
      );
      localStorage.setItem("userEmail", userEmail);
      setIsAuthenticated(true);
      onboardUser();
    })
    .catch((error) => {
      console.log(error);
      toast.error(error.response.data.message.general[0]);
    });
};

export const onboardUser = async () => {
  privateGateway
    .post(makeMyPass.onboardUser)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const generateOTP = async (
  email: string,
  setIsOtpSent: (arg0: boolean) => void,
  type: string,
) => {
  publicGateway
    .post(buildVerse.generateOTP, {
      email: email,
      type: type,
    })
    .then((response) => {
      console.log(response.data.message.general[0]);
      toast.success(response.data.message.general[0]);
      setIsOtpSent(true);
      return response.data;
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0]);
    });
};
