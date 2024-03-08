import React from 'react';
import styles from './ProfilePage.module.css';
import Theme from '../../../components/Theme/Theme';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import { setUserData, updateProfile } from '../../../apis/user';
import { useLocation } from 'react-router-dom';

const ProfilePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token')?.replace(/\/+$/, '') as string;

  const handleUpdateProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    if (token) {
      setUserData({ formData, token });
    } else {
      updateProfile({ data: formData });
    }
  };

  return (
    <Theme>
      <div className={styles.profilePageContainer}>
        <div className={styles.viewProfile}>
          <h2>Update Profile</h2>
          <form
            className={styles.profileForm}
            onSubmit={(event) => {
              handleUpdateProfile(event);
            }}
          >
            <div className={styles.formGroup}>
              <label htmlFor='name'>Full Name</label>
              <input required type='text' id='name' name='name' autoComplete='off' />
            </div>
            {token ? (
              <div className={styles.formGroup}>
                <label htmlFor='password'>Password</label>
                <input required type='password' id='password' name='password' />
              </div>
            ) : (
              <div className={styles.formGroup}>
                <label htmlFor='email'>Email Address</label>
                <input required type='email' id='email' name='email' />
              </div>
            )}
            <div className={styles.formGroup}>
              <label htmlFor='profile_pic'>Profile Picture</label>
              <input required type='file' id='profile_pic' name='profile_pic' />
            </div>
            <SecondaryButton buttonText='Update Details' type='submit' />
            <div className={styles.formGroup}>
              <label className={styles.optional}>All fields are optional</label>
            </div>
          </form>
        </div>
      </div>
    </Theme>
  );
};

export default ProfilePage;
