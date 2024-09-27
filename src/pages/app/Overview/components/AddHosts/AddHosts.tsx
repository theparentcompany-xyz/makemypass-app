/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { SetStateAction } from 'react';
import Select from 'react-select';

import { Roles } from '../../../../../../services/enums';
import { getLoggedInUserRole } from '../../../../../common/commonFunctions';
import Modal from '../../../../../components/Modal/Modal';
import Slider from '../../../../../components/SliderButton/Slider';
import { customStyles } from '../../../EventPage/constants';
import type { hostData } from '../../Overview/types';
import styles from './AddHosts.module.css';
import roleOptions from './data';

const AddHosts = ({
  hostData,
  setHostData,
  onSubmit,
  onClose,
  add,
}: {
  hostData: hostData;
  setHostData: React.Dispatch<SetStateAction<hostData>>;
  onSubmit: () => void;
  onClose: () => void;
  add: boolean;
}) => {
  const handleRoleChange = (event: any) => {
    const selectedRole = event.value;
    setHostData((prevState) => ({
      ...prevState!,
      role: selectedRole,
    }));
  };

  function getOptionsForUserRole(): { value: Roles; label: Roles }[] {
    const userRole = getLoggedInUserRole() as Roles;
    const options: { value: Roles; label: Roles }[] = [];

    const roleHierarchy: { [key in Roles]?: Roles[] } = {
      [Roles.EDITOR]: [Roles.EDITOR, Roles.VIEWER, Roles.VOLUNTEER, Roles.DEVICE],
      [Roles.ADMIN]: [Roles.ADMIN, Roles.EDITOR, Roles.VIEWER, Roles.VOLUNTEER, Roles.DEVICE],
      [Roles.OWNER]: [Roles.ADMIN, Roles.EDITOR, Roles.VIEWER, Roles.VOLUNTEER, Roles.DEVICE],
    };

    if (roleHierarchy[userRole]) {
      roleHierarchy[userRole]!.forEach((role) => {
        options.push({ value: role, label: role });
      });
    }

    return options;
  }

  return (
    <Modal onClose={onClose} title={add ? 'Add Host' : 'Edit Host'}>
      <div className={styles.userInfoModalContainer}>
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
              options={getOptionsForUserRole()}
              styles={customStyles}
            />
          </div>
        </div>
        <div className={styles.inputContainers}>
          <div className={styles.inputContainer}>
            <Slider
              checked={!hostData?.is_private}
              onChange={() => {
                setHostData((prevState) => ({
                  ...prevState,
                  is_private: !hostData.is_private,
                }));
              }}
              text='Do you want to make this host public?'
            />
          </div>
        </div>

        <div className={styles.buttons}>
          <p className={`pointer ${styles.button}`} onClick={onSubmit}>
            {hostData.id ? 'Edit Host' : 'Add Host'}
          </p>
          <p className={`pointer ${styles.button}`} onClick={onClose}>
            Cancel
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default AddHosts;
