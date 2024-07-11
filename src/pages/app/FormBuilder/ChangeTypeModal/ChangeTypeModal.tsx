import { Dispatch, SetStateAction, useEffect } from 'react';
import { HexColors, IconsMapping } from '../constant';
import { ChangeType, FieldType } from '../types';
import styles from './ChangeTypeModal.module.css';
import { IconType } from 'react-icons';
import { motion } from 'framer-motion';

const ChangeTypeModal = ({
  setChangeType,
  changeType,
}: {
  setChangeType: Dispatch<SetStateAction<ChangeType>>;
  changeType: ChangeType;
}) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const modal = document.querySelector('.typeContainer');
      if (modal && !modal.contains(event.target as Node)) {
        setChangeType((prevChangeType) => ({
          ...prevChangeType,
          showModal: false,
        }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setChangeType]);
  return (
    <>
      <div
        className={styles.backgroundBlur}
        onClick={() => {
          setChangeType((prevChangeType) => ({
            ...prevChangeType,
            showModal: false,
          }));
        }}
      ></div>
      <motion.div
        className={styles.typeContainer}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }} // Add exit animation
        transition={{ duration: 0.25 }}
      >
        {Object.keys(FieldType).map((type) => {
          const IconComponent = IconsMapping[type as keyof typeof IconsMapping] as IconType;
          const HexColor = HexColors[type as keyof typeof FieldType];
          return (
            <p
              className={styles.type}
              key={type}
              onClick={() => {
                setChangeType((prevChangeType) => ({
                  ...prevChangeType,
                  showModal: false,
                  currentType: FieldType[type as keyof typeof FieldType],
                }));
              }}
              style={
                changeType.currentType &&
                changeType.currentType === FieldType[type as keyof typeof FieldType]
                  ? { border: `2px solid #565B63` }
                  : {}
              }
            >
              <span
                style={{
                  backgroundColor: `${HexColor}20`, // reduce opacity by adding alpha value
                }}
              >
                {IconComponent && <IconComponent size={20} color={HexColor} />}
              </span>
              {type}
            </p>
          );
        })}
      </motion.div>
    </>
  );
};

export default ChangeTypeModal;
