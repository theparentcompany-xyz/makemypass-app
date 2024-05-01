import { FaAddressCard, FaRegEyeSlash, FaUser } from 'react-icons/fa6';
import EventHeader from '../../../components/EventHeader/EventHeader';
import Glance from '../../../components/Glance/Glance';
import Theme from '../../../components/Theme/Theme';
import styles from './FormBuilder.module.css';
import { MdEmail, MdOutlinePhoneAndroid } from 'react-icons/md';
import Slider from '../../../components/SliderButton/Slider';
import { BsAlphabetUppercase } from 'react-icons/bs';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { LuPencil } from 'react-icons/lu';
import { RiDeleteBinLine } from 'react-icons/ri';
import Select from 'react-select';
import { customStyles } from '../EventPage/constants';

const categories = ['Attendee', 'Speaker', 'Sponsor', 'Exhibitor', 'Staff'];

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

                <div className={styles.customFieldExp}>
                  <div className={styles.row}>
                    <div className={styles.row1}>
                      <RxDragHandleDots2 size={25} color='#606264' />

                      <p className={styles.customFieldLabel}>Phone Number</p>
                    </div>
                    <div className={styles.expandedRight}>
                      <div className={styles.requiredCheckbox}>
                        Required
                        <Slider checked={true} text={''} onChange={() => {}} />
                      </div>
                      <FaRegEyeSlash size={25} color='#606264' />
                    </div>
                  </div>

                  <div className={styles.customFieldName}>
                    <input type='text' placeholder='Field Name' />
                  </div>
                  <div className={styles.customFieldName}>
                    <input type='text' placeholder='Add Some help text.' />
                  </div>

                  <div
                    className={styles.row1}
                    style={{
                      marginTop: '1rem',
                      marginLeft: '1rem',
                    }}
                  >
                    <Slider checked={true} text={''} onChange={() => {}} />
                    <p className={styles.customFieldLabel}>
                      Show Field only when the conditions are met.
                    </p>
                  </div>

                  <div className={styles.conditions}>
                    <div className={styles.conditionRow}>
                      <p className={styles.when}>When</p>
                      <div className={styles.conditionsSelect}>
                        <Select
                          className='basic-single'
                          classNamePrefix='select'
                          name='role'
                          options={[
                            ...categories.map((category) => ({
                              value: category,
                              label: category,
                            })),
                            {
                              value: '',
                              label: 'All',
                            },
                          ]}
                          styles={{
                            ...customStyles,
                            control: (provided: any) => ({
                              ...provided,
                              border: 'none',
                              backgroundColor: 'transparent', // Set the background color to transparent
                              color: '#fff',
                              fontFamily: 'Inter, sans-serif',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '0.9rem',
                              zIndex: 1000,
                              width: '12rem',
                            }),
                          }}
                        />
                        <Select
                          className='basic-single'
                          classNamePrefix='select'
                          name='role'
                          options={[
                            ...categories.map((category) => ({
                              value: category,
                              label: category,
                            })),
                            {
                              value: '',
                              label: 'All',
                            },
                          ]}
                          styles={{
                            ...customStyles,
                            control: (provided: any) => ({
                              ...provided,
                              border: 'none',
                              backgroundColor: 'transparent', // Set the background color to transparent
                              color: '#fff',
                              fontFamily: 'Inter, sans-serif',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '0.9rem',
                              zIndex: 1000,
                              width: '12rem',
                            }),
                          }}
                        />
                        <input type='text' placeholder='Enter a Value' />

                        <RiDeleteBinLine size={20} color='#606264' />
                        <RxDragHandleDots2
                          style={{
                            marginLeft: '1rem',
                          }}
                          size={20}
                          color='#606264'
                        />
                      </div>
                    </div>

                    <div className={styles.conditionRow}>
                      <Select
                        className='basic-single'
                        classNamePrefix='select'
                        name='role'
                        options={[
                          ...categories.map((category) => ({
                            value: category,
                            label: category,
                          })),
                          {
                            value: '',
                            label: 'All',
                          },
                        ]}
                        styles={{
                          ...customStyles,
                          control: (provided: any) => ({
                            ...provided,
                            border: 'none',
                            backgroundColor: '#24332F', // Set the background color to transparent
                            color: '#fff',
                            fontFamily: 'Inter, sans-serif',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '0.9rem',
                            zIndex: 1000,
                            width: '8rem',
                          }),
                        }}
                      />
                      <div className={styles.conditionsSelect}>
                        <Select
                          className='basic-single'
                          classNamePrefix='select'
                          name='role'
                          options={[
                            ...categories.map((category) => ({
                              value: category,
                              label: category,
                            })),
                            {
                              value: '',
                              label: 'All',
                            },
                          ]}
                          styles={{
                            ...customStyles,
                            control: (provided: any) => ({
                              ...provided,
                              border: 'none',
                              backgroundColor: 'transparent', // Set the background color to transparent
                              color: '#fff',
                              fontFamily: 'Inter, sans-serif',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '0.9rem',
                              zIndex: 1000,
                              width: '12rem',
                            }),
                          }}
                        />
                        <Select
                          className='basic-single'
                          classNamePrefix='select'
                          name='role'
                          options={[
                            ...categories.map((category) => ({
                              value: category,
                              label: category,
                            })),
                            {
                              value: '',
                              label: 'All',
                            },
                          ]}
                          styles={{
                            ...customStyles,
                            control: (provided: any) => ({
                              ...provided,
                              border: 'none',
                              backgroundColor: 'transparent', // Set the background color to transparent
                              color: '#fff',
                              fontFamily: 'Inter, sans-serif',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '0.9rem',
                              zIndex: 1000,
                              width: '12rem',
                            }),
                          }}
                        />
                        <input type='text' placeholder='Enter a Value' />

                        <RiDeleteBinLine size={20} color='#606264' />
                        <RxDragHandleDots2
                          style={{
                            marginLeft: '1rem',
                          }}
                          size={20}
                          color='#606264'
                        />
                      </div>
                    </div>
                  </div>

                  <p className={styles.addCustomField}>
                    <span>+</span> Add Custom Field
                  </p>
                </div>

                <button className={styles.addQuestionButton}>
                  <span>+</span>
                  {''}Add Question
                </button>
              </div>
            </div>
          </div>
        </div>
      </Theme>
    </>
  );
};

export default FormBuilder;
