import { Dispatch, SetStateAction } from 'react';
import { HexColors, IconsMapping } from '../constant';
import { Field, FieldType } from '../types';
import styles from './ChangeTypeModal.module.css';
import { IconType } from 'react-icons';
import { motion } from 'framer-motion';

const changeTypeModal = (field: Field, newType: FieldType) => {
  if (field.type === newType) return;

  console.log('Changing type from', field.type, 'to', newType);

  const optionTypes = [
    FieldType.singleselect,
    FieldType.multiselect,
    FieldType.radio,
    FieldType.checkbox,
  ].map((type) => type.toLowerCase());

  console.log('Option types', optionTypes);

  if (optionTypes.includes(field.type as FieldType)) {
    if (!optionTypes.includes(newType)) {
      field.options = [];
    }
  }
  if (field.type == FieldType.file) {
    field.property = {};
  } else if (newType == FieldType.file) {
    field.property = {
      extension_types: [],
      max_size: 5000,
      is_multiple: false,
    };
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

                changeTypeModal(field, type as FieldType);
              }}
              style={
                field && field.type === (type as FieldType) ? { border: `2px solid #565B63` } : {}
              }
            >
              <span
                style={{
                  backgroundColor: `${HexColor}20`, // reduce opacity by adding alpha value
                }}
              >
                {IconComponent && <IconComponent size={20} color={HexColor} />}
              </span>
              {FieldType[type as keyof typeof FieldType]}
            </p>
          );
        })}
      </motion.div>
    </>
  );
};

export default ChangeTypeModal;
