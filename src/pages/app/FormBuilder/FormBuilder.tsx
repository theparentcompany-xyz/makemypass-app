import { FaAddressCard, FaUser } from 'react-icons/fa6';
import EventHeader from '../../../components/EventHeader/EventHeader';
import Glance from '../../../components/Glance/Glance';
import Theme from '../../../components/Theme/Theme';
import styles from './FormBuilder.module.css';
import { MdEmail, MdOutlinePhoneAndroid } from 'react-icons/md';
import Slider from '../../../components/SliderButton/Slider';
import { BsAlphabetUppercase } from 'react-icons/bs';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { LuPencil } from 'react-icons/lu';

const FormBuilder = () => {
  return (
    <>
      <Theme>
        <EventHeader />
        <Glance tab='formbuilder' />
        <div className={styles.builderContainer}>
          <div className={styles.requiredFieldsHeader}>
            <div className={styles.requiredHeading}>
              <div className={styles.image}>
                <FaAddressCard size={20} color='#ffffff' />
              </div>
              <p className={styles.requiredFieldsText}>Required Fields</p>
            </div>
            <div className={styles.requiredFields}>
              <div className={styles.requiredField}>
                <div>
                  <FaUser size={20} color='#606264' />
                  <p className={styles.requiredLabel}>Name</p>
                </div>
                <Slider checked={true} text={''} onChange={() => {}} />
              </div>
              <div className={styles.requiredField}>
                <div>
                  <MdEmail size={20} color='#606264' />
                  <p className={styles.requiredLabel}>Email Address</p>
                </div>
                <Slider checked={true} text={''} onChange={() => {}} />
              </div>
              <div className={styles.requiredField}>
                <div>
                  <MdOutlinePhoneAndroid size={20} color='#606264' />
                  <p className={styles.requiredLabel}>Phone Number</p>
                </div>
                <Slider checked={true} text={''} onChange={() => {}} />
              </div>
            </div>

            <div className={styles.customFieldsContainer}>
              <div className={styles.customFieldsHeader}>
                <div className={styles.customFieldsHeading}>
                  <div
                    className={styles.image}
                    style={{
                      backgroundColor: '#FF9641',
                    }}
                  >
                    <FaAddressCard size={20} color='#ffffff' />
                  </div>
                  <p className={styles.customFieldsText}>Custom Fields</p>
                </div>
              </div>

              <div className={styles.customFields}>
                <div className={styles.customField}>
                  <div className='row'>
                    <RxDragHandleDots2 size={25} color='#606264' />
                    <div>
                      <p className={styles.customFieldLabel}>Name</p>
                      <p className={styles.customFieldType}>
                        <BsAlphabetUppercase size={25} /> Text
                      </p>
                    </div>
                  </div>
                  <LuPencil size={20} color='#606264' />
                </div>

                <div className={styles.customField}>
                  <div className='row'>
                    <RxDragHandleDots2 size={25} color='#606264' />
                    <div>
                      <p className={styles.customFieldLabel}>Phone Number</p>
                      <p className={styles.customFieldType}>
                        <BsAlphabetUppercase size={25} /> Phone Number
                      </p>
                    </div>
                  </div>
                  <LuPencil size={20} color='#606264' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Theme>
    </>
  );
};

export default FormBuilder;
