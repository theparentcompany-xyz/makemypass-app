import { forwardRef } from 'react';
import styles from '../Authstyles.module.css';
import { AnimatePresence, motion } from 'framer-motion';

interface FormProps {
  type: string;
  name: string;
  id: string;
  placeholder: string;
  icon: React.ReactNode;
  value?: string | string[];
  required?: boolean;
  error?: string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const InputField = forwardRef<HTMLInputElement, FormProps>(({ icon, ...inputProps }, ref) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className={styles.formInput}
      // style={inputProps.error ? { marginBottom: '0' }}
    >
      <label className={styles.formLabel} htmlFor='email'>
        {inputProps.required ? inputProps.placeholder + '*' : inputProps.placeholder}
      </label>
      <p className={styles.fieldDescription}>{inputProps.description}</p>
      <div className={styles.inputField}>
        {icon}
        <input
          {...inputProps}
          type={inputProps.type}
          disabled={inputProps.disabled}
          placeholder={`${inputProps.placeholder}`}
          ref={ref}
          style={{
            width: '100%',
            fontFamily: 'Inter',
          }}
        />
      </div>
      <AnimatePresence>
        {inputProps.error && inputProps.error[0].length > 0 && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={styles.errorText}
          >{`${inputProps.error.join()}`}</motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default InputField;
