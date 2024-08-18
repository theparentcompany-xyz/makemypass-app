import toast from 'react-hot-toast';
import { privateGateway, publicGateway } from '../../services/apiGateway';
import { buildVerse, makeMyPass } from '../../services/urls';
import { Dispatch } from 'react';
import { errorType } from '../pages/auth/Login/types';

export const userLogin = async (
  email: string,
  password: string,
  setIsAuthenticated: (arg0: boolean) => void,
  setError: Dispatch<React.SetStateAction<errorType | undefined>>,
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
        Product: 'buildverse',
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
      setError({
        email: error.response.data.message.email ? error.response.data.message.email : undefined,
        password: error.response.data.message.password
          ? error.response.data.message.password
          : error.response.data.message.general[0],
        otp: error.response.data.message.otp
          ? error.response.data.message.otp
          : error.response.data.message.general[0],
      });
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
      if (setIsRegistered && type !== 'Forget Password') {
        setIsRegistered(true);
      }
      return response.data;
    })
    .catch((error) => {
      if (error.response.data.statusCode === 1001) {
        setIsRegistered(false);
        initiatePreRegistration(email, setIsOtpSent);
      }
    });
};

export const initiatePreRegistration = async (
  email: string,
  setIsOtpSent: (arg0: boolean) => void,
) => {
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

export const registerUser = async (
  email: string,
  otp: string,
  setIsRegistered: Dispatch<React.SetStateAction<boolean>>,
  setIsOtpSent: Dispatch<React.SetStateAction<boolean>>,
  setIsAuthenticated: Dispatch<React.SetStateAction<boolean>>,
  setError: Dispatch<React.SetStateAction<errorType | undefined>>,
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
      setError({
        email: error.response.data.message.email ? error.response.data.message.email : undefined,
        password: error.response.data.message.password
          ? error.response.data.message.password
          : undefined,
        otp: error.response.data.message.otp ? error.response.data.message.otp : undefined,
      });
    });
};

export const loginUsingGoogle = async () => {
  publicGateway
    .get(buildVerse.googleLogin)
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Logged in successfully');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Something went wrong');
    });
};

export const resetUserPassword = (
  email: string,
  otp: string,
  password: string,
  setError: Dispatch<React.SetStateAction<errorType | undefined>>,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    publicGateway
      .post(buildVerse.resetPassword, {
        email: email,
        otp: otp,
        password: password,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        setError({
          email: error.response.data.message.email ? error.response.data.message.email : undefined,
          password: error.response.data.message.password
            ? error.response.data.message.password
            : error.response.data.message.general[0],
          otp: error.response.data.message.otp
            ? error.response.data.message.otp
            : error.response.data.message.general[0],
        });
        reject(error);
      });
  });
};
