import toast from 'react-hot-toast';
import { privateGateway, publicGateway } from '../../services/apiGateway';
import { buildVerse, makeMyPass } from '../../services/urls';
import { Dispatch } from 'react';

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
    data['otp'] = password;
  } else {
    data['password'] = password;
  }

  publicGateway
    .post(buildVerse.login, data, {
      headers: {
        product: 'buildverse',
      },
    })
    .then((response) => {
      const userEmail = email.split('@')[0];
      localStorage.setItem('accessToken', response.data.response.access_token);
      localStorage.setItem('refreshToken', response.data.response.refresh_token);
      localStorage.setItem('userEmail', userEmail);
      setIsAuthenticated(true);
      onboardUser();
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0]);
    });
};

export const onboardUser = async () => {
  privateGateway.post(makeMyPass.onboardUser);
};

export const generateOTP = async (
  email: string,
  setIsOtpSent: (arg0: boolean) => void,
  setIsRegistered: Dispatch<React.SetStateAction<boolean>>,
  type: string,
) => {
  publicGateway
    .post(buildVerse.generateOTP, {
      email: email,
      type: type,
    })
    .then((response) => {
      toast.success(response.data.message.general[0]);
      setIsOtpSent(true);
      if (setIsRegistered) {
        setIsRegistered(true);
      }
      return response.data;
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0]);
      if (setIsRegistered) {
        setIsRegistered(false);
      }
    });
};

export const preRegister = async (email: string, setIsOtpSent: (arg0: boolean) => void) => {
  publicGateway
    .post(buildVerse.preRegister, {
      email: email,
    })
    .then((response) => {
      toast.success(response.data.message.general[0]);
      setIsOtpSent(true);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0]);
    });
};

export const register = async (
  email: string,
  otp: string,
  setIsRegistered: Dispatch<React.SetStateAction<boolean>>,
  setIsOtpSent: Dispatch<React.SetStateAction<boolean>>,
) => {
  publicGateway
    .post(buildVerse.register, {
      email: email,
      otp: otp,
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Registered successfully');
      setIsRegistered(true);
      setIsOtpSent(false);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Something went wrong');
    });
};

export const hostWithUs = async (name: string, email: string, phone: string) => {
  publicGateway
    .post(makeMyPass.hostWithUs, {
      name: name,
      email: email,
      phone: phone,
    })
    .then((response) => {
      toast.success(response.data.message.general[0]);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0]);
    });
};
