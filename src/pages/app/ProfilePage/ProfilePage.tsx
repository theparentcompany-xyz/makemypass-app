import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { BiUser } from 'react-icons/bi';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { FaCamera } from 'react-icons/fa';
import { FiEdit3 } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

import { getEventsList } from '../../../apis/events';
import { Event } from '../../../apis/types';
import {
  getProfileInfo,
  setUserData,
  udpateUserProfile,
  updateProfilePassword,
} from '../../../apis/user';
import Loader from '../../../components/Loader';
import ButtonLoader from '../../../components/LoaderButton/LoaderButton';
import Modal from '../../../components/Modal/Modal';
import Theme from '../../../components/Theme/Theme';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import EventBox from './components/EventBox/EventBox';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token')?.replace(/\/+$/, '') as string;
  const [user, setUser] = React.useState<{
    name?: string;
    email?: string;
    profile_pic?: string;
  }>();
  const [editUser, setEditUser] = React.useState<{
    name?: string;
    email?: string;
    profile_pic?: Blob | File;
  }>();
  const NameRef = useRef<HTMLInputElement>(null);
  const EmailRef = useRef<HTMLInputElement>(null);
  const ProfilePicRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);
  const [dataLoading, setDataLoading] = React.useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  // const [currentTab, setCurrentTab] = useState('owner');
  const [eventsData, setEventsData] = useState<Event[]>([]);
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  enum EventStatus {
    Published = 'Published',
    Completed = 'Completed',
    Draft = 'Draft',
  }

  const handleUpdateProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    if (token) {
      setUserData({ formData, token, setLoading });
    } else {
      udpateUserProfile({ data: formData }, setLoading);
    }
  };

  const handleUpdatePassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    if (formData.get('new_password') !== formData.get('confirm_new_password')) {
      toast.error('Passwords do not match');
      return;
    }

    updateProfilePassword({ data: formData }, setLoading);
  };

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getProfileInfo();
      await getEventsList(setEventsData, setDataLoading);
      setUser(userInfo);
      if (userInfo) {
        setEditUser({
          name: userInfo.name,
          email: userInfo.email,
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user && NameRef.current && EmailRef.current) {
      setEditUser({
        name: user.name,
        email: user.email,
      });
    }
  }, [isOpenModal, user]);

  return (
    <>
      {user && dataLoading ? (
        <>
          <Theme>
            {isOpenModal && (
              <Modal type='side' onClose={() => setIsOpenModal(false)} title='Edit Profile'>
                <div className={styles.modalContainer}>
                  <form onSubmit={handleUpdateProfile}>
                    <div className={styles.userDetailsContainer}>
                      {user?.profile_pic?.includes('.png') && !editUser?.profile_pic && (
                        <>
                          <img
                            src={user?.profile_pic}
                            alt='profile picture'
                            className={styles.profilePic}
                            style={{ objectFit: 'cover' }}
                          />
                          <FaCamera
                            className={styles.cameraIcon}
                            onClick={() => ProfilePicRef.current?.click()}
                          />
                        </>
                      )}
                      {editUser?.profile_pic && (
                        <>
                          <img
                            src={URL.createObjectURL(editUser?.profile_pic)}
                            alt='profile picture'
                            style={{ objectFit: 'cover' }}
                            className={styles.profilePic}
                          />
                          <FaCamera
                            className={styles.cameraIcon}
                            onClick={() => ProfilePicRef.current?.click()}
                          />
                        </>
                      )}
                      {!user?.profile_pic?.includes('.png') && !editUser?.profile_pic && (
                        <>
                          <BiUser
                            className={styles.profilePic}
                            style={{
                              padding: '10px',
                              color: 'black',
                              width: '80px',
                              height: '80px',
                            }}
                          />
                          <FaCamera
                            className={styles.cameraIcon}
                            onClick={() => ProfilePicRef.current?.click()}
                          />
                        </>
                      )}
                      <div className={styles.modalUserDetails}>
                        <label className={styles.modalUserName}>{editUser?.name}</label>
                        <label className={styles.modalUserMail}>{editUser?.email}</label>
                      </div>
                    </div>{' '}
                    <div className={styles.formGroupContainer}>
                      <div className={styles.formGroup}>
                        <label htmlFor='name'>Full Name</label>
                        <input
                          type='text'
                          id='name'
                          name='name'
                          autoComplete='off'
                          onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                          value={editUser?.name}
                        />
                      </div>
                      {token ? (
                        <div className={styles.formGroup}>
                          <label htmlFor='password'>Password</label>
                          <input type='password' id='password' name='password' />
                        </div>
                      ) : (
                        <div className={styles.formGroup}>
                          <label htmlFor='email' style={{ opacity: 0.5 }}>
                            Email Address
                          </label>
                          <input
                            required
                            type='email'
                            id='email'
                            name='email'
                            value={editUser?.email}
                            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                            disabled={true}
                            style={{ opacity: 0.5 }}
                          />
                        </div>
                      )}
                      <div className={styles.formGroup}>
                        <input
                          type='file'
                          id='profile_pic'
                          name='profile_pic'
                          className={styles.fileInput}
                          onChange={(e) =>
                            setEditUser({ ...editUser, profile_pic: e.target?.files?.[0] })
                          }
                          ref={ProfilePicRef}
                        />
                      </div>
                      <button type='submit' className={styles.updateButton}>
                        <span className={styles.buttonText}>Update details</span>
                        <ButtonLoader loading={loading} />
                      </button>
                    </div>
                  </form>
                  <div className={styles.lineContainer} />
                  <form onSubmit={handleUpdatePassword}>
                    <div className={styles.formGroup}>
                      <label htmlFor='current_password'>Current Password</label>
                      <div className={styles.passwordContainer}>
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          id='current_password'
                          name='current_password'
                          style={{
                            backgroundColor: 'transparent',
                            width: '100%',
                            borderRadius: '0',
                            padding: '0',
                          }}
                          required
                        />
                        <div onClick={() => setShowCurrentPassword((prevPass) => !prevPass)}>
                          {showCurrentPassword ? <BsEye /> : <BsEyeSlash />}
                        </div>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor='new_password'>New Password</label>
                      <div className={styles.passwordContainer}>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          id='new_password'
                          name='new_password'
                          style={{
                            backgroundColor: 'transparent',
                            width: '100%',
                            borderRadius: '0',
                            padding: '0',
                          }}
                          required
                        />
                        <div onClick={() => setShowNewPassword((prevPass) => !prevPass)}>
                          {showNewPassword ? <BsEye /> : <BsEyeSlash />}
                        </div>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor='confirm_new_password'>Confirm New Password</label>
                      <div className={styles.passwordContainer}>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id='confirm_new_password'
                          name='confirm_new_password'
                          style={{
                            backgroundColor: 'transparent',
                            width: '100%',
                            borderRadius: '0',
                            padding: '0',
                          }}
                          required
                        />
                        <div onClick={() => setShowConfirmPassword((prevPass) => !prevPass)}>
                          {showConfirmPassword ? <BsEye /> : <BsEyeSlash />}
                        </div>
                      </div>
                    </div>
                    <button type='submit' className={styles.updateButton2}>
                      <span className={styles.buttonText}>Update Password</span>
                      <ButtonLoader loading={loading} />
                    </button>
                  </form>
                </div>
              </Modal>
            )}
            <div className={styles.profilePageContainer}>
              <div className={styles.profileSection}>
                {user?.profile_pic?.includes('.png') ? (
                  <img src={user?.profile_pic} className={styles.profilePic} />
                ) : (
                  <div>
                    <BiUser className={styles.profilePic} style={{ padding: '10px' }} />
                  </div>
                )}
                <div className={styles.profileInfo}>
                  <label className={styles.infoName}>{user?.name}</label>
                  <label className={styles.infoEmail}>{user?.email}</label>
                  <SecondaryButton
                    onClick={() => setIsOpenModal(true)}
                    buttonText='Edit Profile'
                    icon={<FiEdit3 />}
                  />
                </div>
              </div>

              <div className={styles.eventSection}>
                <div className={styles.eventBoxesContainer}>
                  {Object.values(EventStatus).map((status) => {
                    return (
                      <div>
                        <motion.p
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className={styles.homeHeader}
                        >
                          {eventsData.filter((event) => event.status == status).length > 0
                            ? `${status} Events (${eventsData.filter((event) => event.status == status).length})`
                            : ''}
                        </motion.p>
                        <div className={styles.eventsContainer}>
                          {eventsData
                            .filter((event) => event.status == status)
                            .map((event) => (
                              <EventBox key={event.id} eventData={event} />
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Theme>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ProfilePage;
