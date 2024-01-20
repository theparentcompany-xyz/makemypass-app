import styles from "../Authstyles.module.css";
import { GoPerson } from "react-icons/go";
import { LuKey } from "react-icons/lu";
import { IoIosArrowRoundForward } from "react-icons/io";
import Theme from "../../../components/Theme/Theme";
import { useRef } from "react";
import { login } from "../../../apis/auth";
import InputFIeld from "./InputFIeld";

const Login = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        if (emailRef.current?.value && passwordRef.current?.value)
            login(emailRef.current?.value, passwordRef.current?.value);
    };

    return (
        <>
            <Theme>
                <div>
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
                                        event Aweasome!!!
                                    </p>
                                </div>
                                <InputFIeld
                                    ref={emailRef}
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    icon={<GoPerson color="#A4A4A4" />}
                                />
                                <InputFIeld
                                    ref={passwordRef}
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    icon={<LuKey color="#A4A4A4" />}
                                />
                            </div>

                            <button
                                onClick={handleSubmit}
                                className={styles.submitButton}
                            >
                                SignIn{" "}
                                <span>
                                    <IoIosArrowRoundForward
                                        size={25}
                                        color="#A4A4A4"
                                    />
                                </span>
                            </button>
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
