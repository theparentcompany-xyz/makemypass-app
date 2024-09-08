import { useEffect, useState } from 'react';
import { LuPencil, LuPlus, LuSave, LuTrash } from 'react-icons/lu';
import { MdClose } from 'react-icons/md';

import { createUTM, getUTMList } from '../../../../../apis/utm';
import InputField from '../../../../auth/Login/InputField';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import type { UTMDataType } from './types';
import styles from './UTMManager.module.css';

const UTMManager = ({
  UTMData,
  setUTMData,
}: {
  UTMData: UTMDataType;
  setUTMData: React.Dispatch<React.SetStateAction<UTMDataType>>;
}) => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    getUTMList(eventId, UTMData, setUTMData, setFirstRender);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!firstRender) {
      createUTM(eventId, UTMData.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UTMData.data]);

  return (
    <div className={styles.utmContainer}>
      <button
        className={styles.closeButton}
        onClick={() => {
          setUTMData({
            ...UTMData,
            showUTM: false,
          });
        }}
      >
        <MdClose color='white' size={20} />
      </button>
      {Object.keys(UTMData.data).map((key: string) => (
        <div className={styles.utmColumn} key={key}>
          <p className={styles.utmHeading}>{key.charAt(0).toUpperCase() + key.slice(1)}</p>

          {UTMData.data[key as keyof UTMDataType['data']].map((value, index) =>
            UTMData.editUTM.type === key && UTMData.editUTM.index === index ? (
              <div key={index} className={styles.utmValue}>
                <InputField
                  placeholder='Edit UTM'
                  icon={<LuPencil size={15} />}
                  id='utm'
                  name='utm'
                  type='text'
                  value={UTMData.editUTM.value}
                  onChange={(e) => {
                    setUTMData((prevState) => ({
                      ...prevState,
                      editUTM: {
                        ...prevState.editUTM,
                        value: e.target.value,
                      },
                    }));
                  }}
                />

                <div className={styles.buttonsContainer}>
                  <SecondaryButton
                    buttonText='Save'
                    icon={<LuSave size={15} />}
                    onClick={() => {
                      const newData = [...UTMData.data[key as keyof UTMDataType['data']]];
                      newData[index] = UTMData.editUTM.value;
                      setUTMData({
                        ...UTMData,
                        data: {
                          ...UTMData.data,
                          [key]: newData,
                        },
                        editUTM: {
                          type: '',
                          value: '',
                          index: -1,
                        },
                      });
                    }}
                  />

                  <SecondaryButton
                    buttonText='Cancel'
                    icon={<MdClose size={15} />}
                    onClick={() => {
                      setUTMData({
                        ...UTMData,
                        editUTM: {
                          type: '',
                          value: '',
                          index: -1,
                        },
                      });
                    }}
                  />
                </div>
              </div>
            ) : (
              <div key={index} className={styles.utmValue}>
                <input
                  type='radio'
                  name={key}
                  value={value}
                  onDoubleClick={(e) => {
                    e.currentTarget.checked = false;
                    setUTMData({
                      ...UTMData,
                      selectedData: {
                        ...UTMData.selectedData,
                        [key]: '',
                      },
                    });
                  }}
                  onClick={(e) => {
                    setUTMData({
                      ...UTMData,
                      selectedData: {
                        ...UTMData.selectedData,
                        [key]: e.currentTarget.value,
                      },
                    });
                  }}
                />
                <label>{value}</label>
                <LuPencil
                  color='#939597'
                  size={15}
                  onClick={() => {
                    setUTMData({
                      ...UTMData,
                      editUTM: {
                        type: key as keyof UTMDataType['data'],
                        value: value,
                        index: index,
                      },
                    });
                  }}
                />
                <LuTrash
                  color='#939597'
                  size={15}
                  style={{ marginLeft: '5px' }}
                  onClick={() => {
                    const newData = [...UTMData.data[key as keyof UTMDataType['data']]];
                    newData.splice(index, 1);
                    setUTMData({
                      ...UTMData,
                      data: {
                        ...UTMData.data,
                        [key]: newData,
                      },
                    });
                  }}
                />
              </div>
            ),
          )}

          {
            // Add UTM
            UTMData.addUTM.type === key && (
              <div className={styles.utmValue}>
                <InputField
                  icon={<LuPlus size={15} />}
                  type='text'
                  name='utm'
                  value={UTMData.addUTM.value}
                  id='utm'
                  placeholder='Add UTM'
                  onChange={(e) => {
                    setUTMData({
                      ...UTMData,
                      addUTM: {
                        type: key,
                        value: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            )
          }
          <SecondaryButton
            buttonText={UTMData.addUTM.type === key ? 'Save' : 'Add'}
            icon={<LuPlus size={15} />}
            onClick={() => {
              if (UTMData.addUTM.type === key && UTMData.addUTM.value !== '') {
                setUTMData({
                  ...UTMData,
                  data: {
                    ...UTMData.data,
                    [key]: [
                      ...UTMData.data[key as keyof UTMDataType['data']],
                      UTMData.addUTM.value,
                    ],
                  },
                  addUTM: {
                    type: '',
                    value: '',
                  },
                });
              } else {
                setUTMData({
                  ...UTMData,
                  addUTM: {
                    type: key as keyof UTMDataType['data'],
                    value: '',
                  },
                });
              }
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default UTMManager;
