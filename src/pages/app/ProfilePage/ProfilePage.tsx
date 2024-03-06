import React from 'react';
import styles from './ProfilePage.module.css';
import Theme from '../../../components/Theme/Theme';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import toast from 'react-hot-toast';
import { updateProfile } from '../../../apis/user';

const ProfilePage = () => {
  const handleUpdateProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(event);
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    if (data.name === '' || data.email === '' || data.profile_pic === '') {
      toast.error('Please fill all the fields');
    } else {
      updateProfile(data);
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
              <label htmlFor='name'>Username</label>
              <input type='text' id='name' name='name' />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='email'>Email</label>
              <input type='email' id='email' name='email' />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='profile_pic'>Profile Picture</label>
              <input type='file' id='profile_pic' name='profile_pic' />
            </div>
            <SecondaryButton buttonText='Update Details' type='submit' />
          </form>
        </div>
      </div>
    </Theme>
  );
};

export default ProfilePage;
