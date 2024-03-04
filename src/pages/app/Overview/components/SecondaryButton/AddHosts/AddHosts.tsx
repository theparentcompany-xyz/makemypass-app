import React, { SetStateAction } from 'react';
import styles from './AddHosts.module.css';
import { hostData } from '../../../Overview/types';

import Select from 'react-select';
import roleOptions from './data';
import Modal from '../../../../../../components/Modal/Modal';

const AddHosts = ({
  hostData,
  setHostData,
  onSubmit,
  onClose,
}: {
  hostData: hostData;
  setHostData: React.Dispatch<SetStateAction<hostData>>;
  onSubmit: () => void;
  onClose: () => void;
}) => {
  const handleRoleChange = (event: any) => {
    const selectedRole = event.value;
    setHostData((prevState) => ({
      ...prevState!,
      role: selectedRole,
    }));
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      border: 'none',
      backgroundColor: '#2A3533',
      fontFamily: 'Inter, sans-serif',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '0.9rem',
    }),

    group: (provided: any) => ({
      ...provided,
      paddingTop: 0,
    }),

    singleValue: (base: any) => ({
      ...base,
      color: '#fff',
    }),
    option: (provided: any) => ({
      ...provided,
      fontFamily: 'Inter, sans-serif',
      color: '#000',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '0.9rem',
    }),
  };

  return (
    <Modal>
      <div className={styles.userInfoModalContainer}>
        <p className={styles.modalHeader}>Edit Guest</p>
        <div className={styles.inputContainers}>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Email</p>

            <input
              value={hostData?.email}
              className={styles.input}
              disabled={hostData.id ? true : false}
              type='text'
              onChange={(event) => {
                setHostData((prevState) => ({
                  ...prevState!,
                  email: event.target.value,
                }));
              }}
            />
          </div>
        </div>
        <div className={styles.dropdownContainer}>
          <div className={styles.dropdown}>
            <p className={styles.inputLabel}>Select Role</p>
            <Select
              className='basic-single'
              classNamePrefix='select'
              value={roleOptions.filter((role) => role.value === hostData?.role)[0]}
              onChange={(event) => {
                handleRoleChange(event);
              }}
              name='role'
              options={roleOptions}
              styles={customStyles}
            />
          </div>
        </div>

        <div className={styles.buttons}>
          <p className={styles.button} onClick={onSubmit}>
            {hostData.id ? 'Edit Host' : 'Add Host'}
          </p>
          <p className={styles.button} onClick={onClose}>
            Cancel
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default AddHosts;
