import styles from "../Authstyles.module.css";
import { GoPerson } from "react-icons/go";
import { LuKey } from "react-icons/lu";
import { IoIosArrowRoundForward } from "react-icons/io";
import Theme from "../../../components/Theme/Theme";
import { useEffect, useRef, useState } from "react";
import { login, generateOTP } from "../../../apis/auth";
import InputFIeld from "./InputFIeld";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const otpRef = useRef<HTMLInputElement>(null);

    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isPassword, setIsPassword] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    let ruri = window.location.href.split("=")[1];

    const handleSubmit = () => {
        if (isPassword && emailRef.current?.value && passwordRef.current?.value)
            login(
                emailRef.current?.value,
                passwordRef.current?.value,
                setIsAuthenticated
            );
        else if (isOtpSent && emailRef.current?.value && otpRef.current?.value)
            login(
                emailRef.current?.value,
                otpRef.current?.value,
                setIsAuthenticated,
                isOtpSent
            );
        else if (!isOtpSent && emailRef.current?.value)
            generateOTP(emailRef.current?.value, setIsOtpSent, "Login");
    };

    useEffect(() => {
        if (localStorage.getItem("accessToken")) setIsAuthenticated(true);

        if (isAuthenticated) {
            if (ruri) navigate(`/${ruri}`);
            else navigate("/events");
        }
    }, [isAuthenticated]);

    return (
        <>
            <Theme>
                <div
                    style={{
                        width: "100%",
                    }}
                >
                    <div className={styles.formContainer}>
                        <div className={styles.form}>
                            <div className={styles.formFields}>
                                <div className={styles.formHeader}>
                                    <p className={styles.formTitle}>
                                        Hola, to MakeMyPass
                                    </p>
                                    <p className={styles.formText}>
                                        Sign In now to make your
                                        <br />
                                        event Aweasome!
                                    </p>
                                </div>
                                <InputFIeld
                                    ref={emailRef}
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Enter your Email*"
                                    icon={<GoPerson color="#A4A4A4" />}
                                />

                                {isPassword && !isOtpSent && (
                                    <InputFIeld
                                        ref={passwordRef}
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="Enter your Password*"
                                        icon={<LuKey color="#A4A4A4" />}
                                    />
                                )}

                                {isOtpSent && !isPassword && (
                                    <InputFIeld
                                        ref={otpRef}
                                        type="text"
                                        name="otp"
                                        id="otp"
                                        placeholder="Enter OTP*"
                                        icon={<LuKey color="#A4A4A4" />}
                                    />
                                )}
                            </div>

                            <div className={styles.formFooter}>
                                <p
                                    onClick={() => {
                                        if (!isPassword) {
                                            setIsOtpSent(false);
                                            setIsPassword(true);
                                        } else {
                                            setIsOtpSent(false);
                                            setIsPassword(false);
                                        }
                                    }}
                                >
                                    Login with {isPassword ? "OTP" : "Password"}
                                </p>
                                <button
                                    onClick={handleSubmit}
                                    className={styles.submitButton}
                                >
                                    {isOtpSent
                                        ? "Login"
                                        : isPassword
                                        ? "Login"
                                        : "Get OTP"}
                                    <span>
                                        <IoIosArrowRoundForward
                                            size={25}
                                            color="#A4A4A4"
                                        />
                                    </span>
                                </button>
                            </div>
                        </div>
                        <img
                            src="/mascot.webp"
                            alt=""
                            className={styles.mascot}
                        />
                    </div>
                </div>
            </Theme>
        </>
    );
};

export default Login;
