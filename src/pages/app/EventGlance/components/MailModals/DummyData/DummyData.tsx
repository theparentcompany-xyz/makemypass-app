import React, { useEffect } from 'react';
import { BiLoader } from 'react-icons/bi';

import { sentTestMail } from '../../../../../../apis/postevent';
import InputField from '../../../../../auth/Login/InputField';
import styles from './DummyData.module.css';

type Props = {
  dummyData: { showModal: boolean; data: { [key: string]: string } | null; mailId: string };
  setDummyData: React.Dispatch<
    React.SetStateAction<{
      showModal: boolean;
      data: { [key: string]: string } | null;
      mailId: string;
    }>
  >;
};

const DummyData = ({ dummyData, setDummyData }: Props) => {
  useEffect(() => {
    console.log(dummyData);
  }, [dummyData]);

  return (
    <>
      {dummyData.data && Object.keys(dummyData?.data).length != 0 ? (
        <>
          {Object.keys(dummyData.data).map((key) => (
            <>
              <InputField
                type='text'
                name={key}
                id={key}
                icon={<></>}
                description={`${key}`}
                placeholder=''
                value={dummyData.data ? dummyData.data[key] : ''}
                style={{ width: '100%' }}
                onChange={(e) => {
                  setDummyData((prevData) => ({
                    ...prevData,
                    data: {
                      ...prevData.data,
                      [key]: e.target.value,
                    },
                  }));
                }}
              />
            </>
          ))}
          <div className={styles.modalButtons}>
            <button
              className={styles.confirmButton}
              onClick={() => {
                sentTestMail(dummyData.mailId, dummyData.data);
                setDummyData({ showModal: false, data: {}, mailId: '' });
              }}
            >
              Send
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => {
                setDummyData({ showModal: false, data: {}, mailId: '' });
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>{dummyData.data ? <div>No dummy data found to replace with</div> : <BiLoader />}</>
      )}
    </>
  );
};

export default DummyData;
