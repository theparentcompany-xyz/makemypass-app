import { forwardRef } from 'react';
import styles from '../Authstyles.module.css';

interface FormProps {
  type: string;
  name: string;
  id: string;
  placeholder: string;
  icon: React.ReactNode;
  required?: boolean;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
}

const InputFIeld = forwardRef<HTMLInputElement, FormProps>(({ icon, ...inputProps }, ref) => {
  return (
    <div className={styles.formInput}>
      <label className={styles.formLabel} htmlFor='email'>
        {inputProps.required ? inputProps.placeholder + '*' : inputProps.placeholder}
      </label>
      <p className={styles.fieldDescription}>{inputProps.description}</p>
      <div className={styles.inputField}>
        {icon}
        <input
          style={{
            width: '100%',
            fontFamily: 'Inter',
          }}
          {...inputProps}
          placeholder={`Enter Your ${inputProps.placeholder}`}
          ref={ref}
        />
      </div>
      {inputProps.error && (
        <p className={styles.errorText}>{`${inputProps.placeholder} is required.`}</p>
      )}
    </div>
  );
});

export default InputFIeld;
