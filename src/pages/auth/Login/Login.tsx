import styles from "../Authstyles.module.css";
import { GoPerson } from "react-icons/go";
import { LuKey } from "react-icons/lu";
import { IoIosArrowRoundForward } from "react-icons/io";
import Theme from "../../../components/Theme/Theme";
import { useRef } from "react";
import { login } from "../../../apis/auth/auth";

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
                                <div className={styles.formInput}>
                                    <label
                                        className={styles.formLabel}
                                        htmlFor="email"
                                    >
                                        Email
                                    </label>
                                    <div className={styles.inputField}>
                                        <GoPerson color="#A4A4A4" />
                                        <input
                                            ref={emailRef}
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>
                                <div className={styles.formInput}>
                                    <label
                                        className={styles.formLabel}
                                        htmlFor="password"
                                    >
                                        Password
                                    </label>
                                    <div className={styles.inputField}>
                                        <LuKey color="#A4A4A4" />
                                        <input
                                            ref={passwordRef}
                                            type="password"
                                            name="password"
                                            id="password"
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                </div>
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
                            src="/mascot.png"
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
