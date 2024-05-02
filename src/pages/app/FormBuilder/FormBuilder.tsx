import { FaAddressCard, FaRegEye, FaRegEyeSlash, FaUser } from 'react-icons/fa6';
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
import { useEffect, useState } from 'react';
import { getForm, updateForm } from '../../../apis/formbuilder';
import { Field } from './types';
import RequiredFields from './RequiredFields';

const categories = ['Attendee', 'Speaker', 'Sponsor', 'Exhibitor', 'Staff'];

const FormBuilder = () => {
  const { event_id } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [formFields, setFormFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field>({} as Field);

  useEffect(() => {
    getForm(event_id, setFormFields);
  }, [event_id]);

  const updateFormFieldValue = (field: Field, key: string, value: any) => {
    setFormFields([
      ...formFields.slice(0, formFields.indexOf(field)),
      {
        ...field,
        [key]: value,
      },
      ...formFields.slice(formFields.indexOf(field) + 1),
    ]);
  };

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
              <RequiredFields icon={<FaUser size={20} color='#606264' />} label={'Name'} />
              <RequiredFields
                icon={<MdEmail size={20} color='#606264' />}
                label={'Email Address'}
              />
              <RequiredFields
                icon={<MdOutlinePhoneAndroid size={20} color='#606264' />}
                label={'Phone Number'}
              />
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
                {Object.keys(formFields).map((field) => {
                  return formFields[Number(field)].id !== selectedField.id ? (
                    <div className={styles.customField}>
                      <div className={styles.row1}>
                        <RxDragHandleDots2 size={25} color='#606264' />
                        <div>
                          <p className={styles.customFieldLabel}>
                            {formFields[Number(field)].title}
                          </p>
                          <p className={styles.customFieldType}>
                            <BsAlphabetUppercase size={25} />{' '}
                            {formFields[Number(field)].description}
                          </p>
                        </div>
                      </div>
                      <LuPencil
                        onClick={() => {
                          setSelectedField(formFields[Number(field)]);
                        }}
                        size={20}
                        color='#606264'
                      />
                    </div>
                  ) : (
                    <div className={styles.customFieldExp}>
                      <div className={styles.row}>
                        <div className={styles.row1}>
                          <RxDragHandleDots2 size={25} color='#606264' />
                          <p className={styles.customFieldLabel}>
                            {formFields[Number(field)].title}
                          </p>
                        </div>
                        <div className={styles.expandedRight}>
                          <div className={styles.requiredCheckbox}>
                            Unique
                            <Slider
                              checked={formFields[Number(field)].unique}
                              text={''}
                              onChange={() => {
                                updateFormFieldValue(
                                  formFields[Number(field)],
                                  'unique',
                                  !formFields[Number(field)].unique,
                                );
                              }}
                            />
                          </div>
                          <div className={styles.requiredCheckbox}>
                            Required
                            <Slider
                              checked={formFields[Number(field)].required}
                              text={''}
                              onChange={() => {
                                updateFormFieldValue(
                                  formFields[Number(field)],
                                  'required',
                                  !formFields[Number(field)].required,
                                );
                              }}
                            />
                          </div>
                          {formFields[Number(field)].hidden ? (
                            <FaRegEyeSlash
                              size={25}
                              color='#606264'
                              onClick={() => {
                                updateFormFieldValue(
                                  formFields[Number(field)],
                                  'hidden',
                                  !formFields[Number(field)].hidden,
                                );
                              }}
                            />
                          ) : (
                            <FaRegEye
                              size={25}
                              color='#606264'
                              onClick={() => {
                                updateFormFieldValue(
                                  formFields[Number(field)],
                                  'hidden',
                                  !formFields[Number(field)].hidden,
                                );
                              }}
                            />
                          )}
                        </div>
                      </div>

                      <div className={styles.customFieldName}>
                        <input
                          type='text'
                          placeholder='Field Name'
                          value={formFields[Number(field)].title}
                          onChange={(event) => {
                            updateFormFieldValue(
                              formFields[Number(field)],
                              'title',
                              event.target.value,
                            );
                          }}
                        />
                      </div>
                      <div className={styles.customFieldName}>
                        <input
                          type='text'
                          placeholder='Add Some help text.'
                          value={formFields[Number(field)].description || ''}
                          onChange={(event) => {
                            updateFormFieldValue(
                              formFields[Number(field)],
                              'description',
                              event.target.value,
                            );
                          }}
                        />
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
                  );
                })}

                <button className={styles.addQuestionButton}>
                  <span>+</span>
                  {''}Add Question
                </button>
                <button
                  onClick={() => {
                    updateForm(event_id, formFields);
                  }}
                  className={styles.addQuestionButton}
                >
                  Save Form
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
