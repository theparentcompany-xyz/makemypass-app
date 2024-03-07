import React from 'react';
import styles from './ProfilePage.module.css';
import Theme from '../../../components/Theme/Theme';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import { setUserData } from '../../../apis/user';
import { useLocation } from 'react-router-dom';

const ProfilePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token')?.replace(/\/+$/, "") as string;


  const handleUpdateProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    setUserData({ formData, token })
  }


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
              <label htmlFor='name' >Full Name</label>
              <input type='text' id='name' name='name' autoComplete="off" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='password'>Password</label>
              <input type='password' id='password' name='password' />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='profile_pic'>Profile Picture</label>
              <input type='file' id='profile_pic' name='profile_pic' />
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
