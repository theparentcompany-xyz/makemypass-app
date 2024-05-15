import React, { useEffect, useRef } from 'react';
import styles from './ProfilePage.module.css';
import Theme from '../../../components/Theme/Theme';
import { setUserData, updateProfile, getProfileInfo } from '../../../apis/user';
import { useLocation } from 'react-router-dom';
import ButtonLoader from '../../../components/ButtonLoader/ButtonLoader';

const ProfilePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token')?.replace(/\/+$/, '') as string;
  const NameRef = useRef<HTMLInputElement>(null);
  const EmailRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);
  const handleUpdateProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    if (token) {
      setUserData({ formData, token, setLoading });
    } else {
      updateProfile({ data: formData }, setLoading);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getProfileInfo();
      if (userInfo) {
        NameRef.current!.value = userInfo.name ?? '';
        EmailRef.current!.value = userInfo.email ?? '';
      }
      console.log(userInfo);
    };
    fetchData();
  }, []);

  return (
    <Theme>
      <div className={styles.profilePageContainer}>
        <div className={styles.viewProfile}>
          <h2>Update Profile</h2>
          <form className={styles.profileForm} onSubmit={handleUpdateProfile}>
            <div className={styles.formGroup}>
              <label htmlFor='name'>Full Name</label>
              <input type='text' id='name' name='name' autoComplete='off' ref={NameRef} />
            </div>
            {token ? (
              <div className={styles.formGroup}>
                <label htmlFor='password'>Password</label>
                <input type='password' id='password' name='password' />
              </div>
            ) : (
              <div className={styles.formGroup}>
                <label htmlFor='email'>Email Address</label>
                <input required type='email' id='email' name='email' ref={EmailRef} />
              </div>
            )}
            <div className={styles.formGroup}>
              <label htmlFor='profile_pic'>Profile Picture</label>
              <input type='file' id='profile_pic' name='profile_pic' className={styles.fileInput} />
            </div>
            <button type='submit' className={styles.updateButton}>
              <span className={styles.buttonText}>Update details</span>
              <ButtonLoader loading={loading} />
            </button>

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
