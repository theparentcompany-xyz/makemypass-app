import { Dispatch, SetStateAction } from 'react';
import Modal from '../../../../components/Modal/Modal';
import { HexColors, IconsMapping } from '../constant';
import { ChangeType, FieldType } from '../types';
import styles from './ChangeTypeModal.module.css';
import { IconType } from 'react-icons';

const ChangeTypeModal = ({
  setChangeType,
}: {
  setChangeType: Dispatch<SetStateAction<ChangeType>>;
}) => {
  return (
    <Modal
      type='changeType'
      title='Change Field Type'
      onClose={() => {
        setChangeType({
          showModal: false,
          currentType: '',
        });
      }}
    >
      <div className={styles.typeContainer}>
        {Object.keys(FieldType).map((type) => {
          const IconComponent = IconsMapping[type as keyof typeof IconsMapping] as IconType;
          const HexColor = HexColors[type as keyof typeof FieldType];
          return (
            <p
              className={styles.type}
              key={type}
              onClick={() => {
                console.log('type', FieldType[type as keyof typeof FieldType]);
                setChangeType({
                  showModal: false,
                  currentType: FieldType[type as keyof typeof FieldType],
                });
              }}
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
      </div>
    </Modal>
  );
};

export default ChangeTypeModal;
