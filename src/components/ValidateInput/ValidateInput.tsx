import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef } from 'react';

import { sendVerfication } from '../../apis/publicpage';
import styles from './ValidateInput.module.css';

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
}

const handleValidate = (type: string, value: string) => {
  sendVerfication(type, value);
};

const ValidateInput = forwardRef<HTMLInputElement, FormProps>(({ icon, ...inputProps }, ref) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className={styles.formInput}
    >
      <label className={styles.formLabel} htmlFor='email'>
        {inputProps.required ? inputProps.placeholder + '*' : inputProps.placeholder}
      </label>
      <p className={styles.fieldDescription}>{inputProps.description}</p>
      <div className={styles.inputValidationField}>
        <div className={styles.inputField}>
          {icon}
          <input
            {...inputProps}
            placeholder={`Enter Your ${inputProps.placeholder}`}
            ref={ref}
            style={{
              width: '100%',
              fontFamily: 'Inter',
            }}
          />
        </div>
        <button
          onClick={() => {
            handleValidate(inputProps.type, inputProps.value as string);
          }}
          className={styles.validateInputButton}
        >
          Validate
        </button>
      </div>
      <AnimatePresence>
        {inputProps.error && (
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

export default ValidateInput;
