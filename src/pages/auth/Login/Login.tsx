import styles from '../Authstyles.module.css';
import { GoPerson } from 'react-icons/go';
import { LuKey } from 'react-icons/lu';
import { IoIosArrowRoundForward } from 'react-icons/io';
import Theme from '../../../components/Theme/Theme';
import { useEffect, useRef, useState } from 'react';
import { login, generateOTP, preRegister, register, googleLogin } from '../../../apis/auth';
import InputField from './InputField.tsx';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TbAlertTriangleFilled } from 'react-icons/tb';
import { errorType } from './types';
import { FaGoogle } from 'react-icons/fa6';

const Login = () => {
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const otpRef = useRef<HTMLInputElement>(null);

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    if (isRegistered) {
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
      else if (!isOtpSent && emailRef.current?.value)
        generateOTP(emailRef.current?.value, setIsOtpSent, setIsRegistered, 'Login');
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
    if (timer === 0) {
      setTimer(120);
      setIsOtpSent(false);
    }
  }, [timer]);

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
                  }}
                />
                {error && error.email && <p className={styles.alertMessage}>{error.email}</p>}

                {isPassword && !isOtpSent && (
                  <>
                    <InputField
                      ref={passwordRef}
                      type='password'
                      name='password'
                      id='password'
                      placeholder='Enter your Password*'
                      icon={<LuKey color='#A4A4A4' />}
                      onChange={() =>
                        setError({
                          email: '',
                          password: '',
                          otp: '',
                        })
                      }
                    />
                    {error && error.password && (
                      <p className={styles.alertMessage}>{error.password}</p>
                    )}
                  </>
                )}

                {isOtpSent && !isPassword && (
                  <>
                    <InputField
                      ref={otpRef}
                      type='number'
                      name='otp'
                      id='otp'
                      placeholder='Enter OTP*'
                      icon={<LuKey color='#A4A4A4' />}
                      onChange={() =>
                        setError({
                          email: '',
                          password: '',
                          otp: '',
                        })
                      }
                    />
                    {error && error.otp && <p className={styles.alertMessage}>{error.otp}</p>}
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
                    if (!isPassword) {
                      setIsOtpSent(false);
                      setIsPassword(true);
                      setIsRegistered(true);
                    } else {
                      setIsOtpSent(false);
                      setIsPassword(false);
                      setIsRegistered(true);
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
                      if (isRegistered)
                        generateOTP(
                          emailRef.current?.value,
                          setIsOtpSent,
                          setIsRegistered,
                          'Login',
                        );
                      else preRegister(emailRef.current?.value, setIsOtpSent);
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
                      ? 'Login'
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
