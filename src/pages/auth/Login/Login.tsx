import styles from '../Authstyles.module.css';
import { GoPerson } from 'react-icons/go';
import { LuKey } from 'react-icons/lu';
import { IoIosArrowRoundForward } from 'react-icons/io';
import Theme from '../../../components/Theme/Theme';
import { useEffect, useRef, useState } from 'react';
import {
  login,
  generateOTP,
  preRegister,
  register,
  googleLogin,
  resetPassword,
} from '../../../apis/auth';
import InputField from './InputField.tsx';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TbAlertTriangleFilled } from 'react-icons/tb';
import { errorType } from './types';
import { FaGoogle } from 'react-icons/fa6';
import toast from 'react-hot-toast';
const Login = () => {
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const otpRef = useRef<HTMLInputElement>(null);

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isLoginWithOtp, setIsLoginWithOtp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true);

  const [timer, setTimer] = useState(120);

  const [error, setError] = useState<errorType>();

  const ruri = window.location.href.split('=')[1];

  const handleSubmit = () => {
    setError({
      email: '',
      password: '',
      otp: '',
    });
    if (isPassword && !passwordRef.current?.value) {
      setError({
        email: '',
        password: 'Password is required',
        otp: '',
      });
      return;
    }
    if (isForgetPassword) {
      if (!passwordRef.current?.value) {
        setError({
          email: '',
          password: 'Password is required',
          otp: '',
        });
        return;
      }
      if (!otpRef.current?.value) {
        setError({
          email: '',
          password: '',
          otp: 'OTP is required',
        });
        return;
      }

      if (emailRef.current?.value && otpRef.current?.value && passwordRef.current?.value)
        resetPassword(
          emailRef.current?.value,
          otpRef.current?.value,
          passwordRef.current?.value,
          setError,
        ).then((responseData: any) => {
          if (responseData.response.access_token) {
            const userEmail = emailRef.current?.value.split('@')[0];
            localStorage.setItem('accessToken', responseData.response.access_token);
            localStorage.setItem('refreshToken', responseData.response.refresh_token);
            if (userEmail) localStorage.setItem('userEmail', userEmail);

            toast.success('Password reset successfully');

            setIsAuthenticated(true);
            navigate('/events');
          }
        });
    } else if (isRegistered) {
      if (isPassword && emailRef.current?.value && passwordRef.current?.value)
        login(
          emailRef.current?.value,
          passwordRef.current?.value,
          setIsAuthenticated,
          setError,
          isOtpSent,
          setIsRegistered,
          passwordRef,
          setIsPassword,
        );
      else if (isOtpSent && emailRef.current?.value && otpRef.current?.value)
        login(
          emailRef.current?.value,
          otpRef.current?.value,
          setIsAuthenticated,
          setError,
          isOtpSent,
        );
      else if (!isOtpSent && emailRef.current?.value) {
        generateOTP(
          emailRef.current?.value,
          setIsOtpSent,
          setIsRegistered,
          isForgetPassword ? 'Forget Password' : 'Login',
        );
      }
    } else {
      if (!isOtpSent && emailRef.current?.value) preRegister(emailRef.current?.value, setIsOtpSent);
      else if (isOtpSent && emailRef.current?.value && otpRef.current?.value)
        register(
          emailRef.current?.value,
          otpRef.current?.value,
          setIsRegistered,
          setIsOtpSent,
          setIsAuthenticated,
          setError,
        );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) setIsAuthenticated(true);

    if (isAuthenticated) {
      if (ruri) navigate(`/${ruri}`);
      else navigate('/events');
    }
  }, [isAuthenticated, navigate, ruri]);

  useEffect(() => {
    if (!isRegistered) setIsOtpSent(false);
  }, [isRegistered]);

  useEffect(() => {
    if (isForgetPassword && emailRef.current?.value) {
      passwordRef.current!.value = '';
      generateOTP(emailRef.current?.value, setIsOtpSent, setIsRegistered, 'Forget Password');
      setIsForgetPassword(true);
      setTimer(120);
    } else if (isForgetPassword && !emailRef.current?.value) {
      setError({
        email: 'Email is required',
        password: '',
        otp: '',
      });
      setIsForgetPassword(true);
      setIsPassword(false);
    }
  }, [isForgetPassword]);

  function handleGoogleLogin(): void {
    googleLogin();
  }

  return (
    <>
      <Theme>
        <div
          style={{
            width: '100%',
          }}
        >
          <div className={styles.formContainer}>
            <motion.div
              initial={{
                opacity: 0,
                y: 100,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className={styles.form}
            >
              <div className={styles.formFields}>
                <div className={styles.formHeader}>
                  <p className={styles.formTitle}>
                    {isRegistered ? 'Hola, to MakeMyPass' : 'Register to MakeMyPass'}
                  </p>
                  {isRegistered ? (
                    <p className={styles.formText}>Sign In now to make your event Awesome!</p>
                  ) : (
                    <p className={styles.formText}>Register now to make your event Awesome!</p>
                  )}
                </div>
                <br />
                <InputField
                  ref={emailRef}
                  type='email'
                  name='email'
                  id='email'
                  placeholder='Enter your Email*'
                  icon={<GoPerson color='#A4A4A4' />}
                  onChange={() => {
                    setTimer(120);
                    setIsOtpSent(false);

                    if (isForgetPassword && emailRef.current?.value) {
                      setIsForgetPassword(false);
                      setError((prevError) => {
                        return {
                          ...prevError,
                          email: '',
                        };
                      });
                    }
                  }}
                />
                {error && error.email && <p className={styles.alertMessage}>{error.email}</p>}

                {((isOtpSent && !isPassword) ||
                  (isOtpSent && isForgetPassword) ||
                  isLoginWithOtp) && (
                  <>
                    <InputField
                      ref={otpRef}
                      type='number'
                      name='otp'
                      id='otp'
                      placeholder='Enter OTP*'
                      icon={<LuKey color='#A4A4A4' />}
                      onChange={() =>
                        setError((prevError) => {
                          return {
                            ...prevError,
                            otp: '',
                          };
                        })
                      }
                    />
                    {error && error.otp && <p className={styles.alertMessage}>{error.otp}</p>}
                  </>
                )}

                {((isPassword && !isOtpSent) || (isForgetPassword && isOtpSent)) && (
                  <>
                    <InputField
                      ref={passwordRef}
                      type='password'
                      name='password'
                      id='password'
                      placeholder={isForgetPassword ? 'Enter New Password*' : 'Enter Password*'}
                      icon={<LuKey color='#A4A4A4' />}
                      onChange={() =>
                        setError((prevError) => {
                          return {
                            ...prevError,
                            password: '',
                          };
                        })
                      }
                    />
                    <div className={styles.passwordResetContainer}>
                      {error && error.password && (
                        <p className={styles.alertMessage}>{error.password}</p>
                      )}
                      {(!isForgetPassword || !isOtpSent) && (
                        <p className={styles.passwordReset}>
                          <span
                            className='pointer'
                            onClick={() => {
                              setIsForgetPassword(true);
                            }}
                          >
                            Forgot Password?
                          </span>
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {isOtpSent && !isRegistered && (
                <p className={styles.alertMessage}>
                  <TbAlertTriangleFilled size={20} color='#FF6384' />
                  By clicking register you are creating a new account
                </p>
              )}

              <div className={styles.formFooter}>
                <p
                  className='pointer'
                  onClick={() => {
                    setError({
                      email: '',
                      password: '',
                      otp: '',
                    });
                    if (!isPassword) {
                      setIsOtpSent(false);
                      setIsPassword(true);
                      setIsRegistered(true);
                      setIsLoginWithOtp(false);
                      isForgetPassword && setIsForgetPassword(false);
                    } else {
                      setIsOtpSent(false);
                      setIsPassword(false);
                      setIsRegistered(true);
                      setIsLoginWithOtp(true);
                    }
                  }}
                >
                  Login with {isPassword ? 'OTP' : 'Password'}
                </p>
                {isOtpSent && (
                  <button
                    className={styles.submitButton}
                    style={{
                      minHeight: '2.3rem',
                      width: 'fit-content',
                      display: 'flex',
                      whiteSpace: 'nowrap',
                    }}
                    onClick={() => {
                      if (emailRef.current?.value === '' || emailRef.current?.value === undefined) {
                        setError({
                          email: 'Email is required',
                          password: '',
                          otp: '',
                        });
                        return;
                      }
                      if (isForgetPassword)
                        generateOTP(
                          emailRef.current?.value,
                          setIsOtpSent,
                          setIsRegistered,
                          'Forget Password',
                        );
                      else if (isRegistered) {
                        generateOTP(
                          emailRef.current?.value,
                          setIsOtpSent,
                          setIsRegistered,
                          'Login',
                        );
                      } else preRegister(emailRef.current?.value, setIsOtpSent);

                      setTimer(120);
                    }}
                    disabled={timer > 0} // Disable button when timer is still running
                  >
                    {timer > 0 ? `Resend (${timer}s)` : 'Resend'}
                  </button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleSubmit}
                  className={styles.submitButton}
                >
                  {isRegistered
                    ? isOtpSent
                      ? isForgetPassword
                        ? 'Reset Password'
                        : 'Login'
                      : isPassword
                        ? 'Login'
                        : 'Get OTP'
                    : 'Register'}
                  <span>
                    <IoIosArrowRoundForward size={25} color='#A4A4A4' />
                  </span>
                </motion.button>
              </div>
              {import.meta.env.VITE_CURRENT_ENV === 'dev' && (
                <>
                  <div className={styles.orContainer}>
                    <div className={styles.line}></div>
                    <div className={styles.or}>OR</div>
                    <div className={styles.line}></div>
                  </div>
                  <div className={styles.formAltLoginContainer}>
                    <div
                      className={`pointer ${styles.googleIcon}`}
                      onClick={() => handleGoogleLogin()}
                    >
                      <FaGoogle />
                      Continue with Google
                    </div>
                  </div>
                </>
              )}
            </motion.div>
            <motion.img
              initial={{
                opacity: 0,
                x: 100,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              src='/app/mascot.webp'
              alt='tickachu mascot'
              className={styles.mascot}
            />
          </div>
        </div>
      </Theme>
    </>
  );
};

export default Login;
