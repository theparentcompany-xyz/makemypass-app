import toast from 'react-hot-toast';
import { privateGateway, publicGateway } from '../../services/apiGateway';
import { buildVerse, makeMyPass } from '../../services/urls';
import { Dispatch } from 'react';

export const login = async (
  email: string,
  password: string,
  setIsAuthenticated: (arg0: boolean) => void,
  isOtpSent?: boolean,
  setIsRegistered?: Dispatch<React.SetStateAction<boolean>>,
  passwordRef?: React.RefObject<HTMLInputElement>,
  setIsPassword?: Dispatch<React.SetStateAction<boolean>>,
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
      console.log(error.response);
      // toast.error(error.response.data);
      if (error.response.data.statusCode === 1001) {
        setIsRegistered && setIsRegistered(false);
        setIsAuthenticated(false);
        if (passwordRef && passwordRef.current) {
          passwordRef.current.value = '';
          setIsPassword && setIsPassword(false);
        }
      }
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
      console.log(error);
      if (error.response.data.statusCode === 1001) {
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
  setIsAuthenticated: Dispatch<React.SetStateAction<boolean>>,
) => {
  publicGateway
    .post(buildVerse.register, {
      email: email,
      otp: otp,
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Registered successfully');
      localStorage.setItem('accessToken', response.data.response.access_token);
      localStorage.setItem('refreshToken', response.data.response.refresh_token);
      localStorage.setItem('userEmail', email.split('@')[0]);
      setIsAuthenticated(true);
      onboardUser();
      setIsRegistered(true);
      setIsOtpSent(false);
      setIsAuthenticated(true);
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
      mobile: phone,
    })
    .then((response) => {
      toast.success(response.data.message.general[0]);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0]);
    });
};
