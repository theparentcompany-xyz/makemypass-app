import { forwardRef } from "react";
import styles from "../Authstyles.module.css";

interface FormProps {
    type: string;
    name: string;
    id: string;
    placeholder: string;
    icon: React.ReactNode;
}

const InputFIeld = forwardRef<HTMLInputElement, FormProps>(
    ({ icon, ...inputProps }, ref) => {
        return (
            <div className={styles.formInput}>
                <label className={styles.formLabel} htmlFor="email">
                    Email
                </label>
                <div className={styles.inputField}>
                    {icon}
                    <input {...inputProps} ref={ref} />
                </div>
            </div>
        );
    }
);

export default InputFIeld;
