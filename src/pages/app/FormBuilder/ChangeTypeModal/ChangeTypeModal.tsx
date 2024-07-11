import { Dispatch, SetStateAction } from 'react';
import { HexColors, IconsMapping } from '../constant';
import { Field, FieldType } from '../types';
import styles from './ChangeTypeModal.module.css';
import { IconType } from 'react-icons';
import { motion } from 'framer-motion';

const changeTypeModal = (field: Field, newType: FieldType) => {
  if (field.type === newType) return;

  const optionTypes = [
    FieldType.SingleSelect,
    FieldType.MultiSelect,
    FieldType.Radio,
    FieldType.Checkbox,
  ];
  if (optionTypes.includes(field.type as FieldType)) {
    if (!optionTypes.includes(newType)) {
      field.options = [];
    }
  }

  field.type = newType;
};

const ChangeTypeModal = ({
  setShowChangeTypeModal,
  field,
}: {
  setShowChangeTypeModal: Dispatch<SetStateAction<boolean>>;
  field: Field;
}) => {
  return (
    <>
      <div
        className={styles.backgroundBlur}
        onClick={() => {
          setShowChangeTypeModal(false);
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
                setShowChangeTypeModal(false);
                changeTypeModal(field, FieldType[type as keyof typeof FieldType]);
              }}
              style={
                field && field.type === FieldType[type as keyof typeof FieldType]
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