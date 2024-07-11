import { FaAddressCard, FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import EventHeader from '../../../components/EventHeader/EventHeader';
import Glance from '../../../components/Glance/Glance';
import Theme from '../../../components/Theme/Theme';
import styles from './FormBuilder.module.css';
import Slider from '../../../components/SliderButton/Slider';
import { BsAlphabetUppercase } from 'react-icons/bs';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { LuPencil, LuPlus } from 'react-icons/lu';
import { RiDeleteBinLine } from 'react-icons/ri';
import Select from 'react-select';

import { useEffect, useState } from 'react';
import { getForm, updateForm } from '../../../apis/formbuilder';
import { Field, FieldType } from './types';
import SelectComponent from './SelectComponent';
import { IoCloseSharp } from 'react-icons/io5';
import { FileExtensions, getConditions } from './constant';
import { v4 as uuidv4 } from 'uuid';
import ChangeTypeModal from './ChangeTypeModal/ChangeTypeModal';
import { FaChevronDown } from 'react-icons/fa';
import { AnimatePresence, Reorder } from 'framer-motion';
import InputField from '../../auth/Login/InputField';
import { MdDelete, MdOutlineSdStorage } from 'react-icons/md';
import { customStyles } from '../EventPage/constants';

const FormBuilder = () => {
  const { event_id } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [formFields, setFormFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field>({} as Field);
  const [showChangeTypeModal, setShowChangeTypeModal] = useState(false);

  useEffect(() => {
    getForm(event_id, setFormFields);
  }, [event_id]);

  const updateFormStateVariable = () => {
    setFormFields([...formFields]);
  };

  const getConditionalFields = (currentField: Field) => {
    const index = formFields.findIndex((field) => field.id === currentField.id);
    return formFields.slice(0, index).map((field) => ({ label: field.title, value: field.id }));
  };

  const getFieldType = (fieldId: string) => {
    const field = formFields.find((f) => f.id === fieldId);
    if (field) {
      return field.type;
    }
    return '';
  };

  const removeOption = (field: Field, index: number) => {
    field.options.splice(index, 1);
    updateFormStateVariable();
  };

  const addOption = (field: Field) => {
    field.options.push('');
    updateFormStateVariable();
  };

  const addField = () => {
    const defaultField = {
      id: uuidv4(),
      type: FieldType.Text,
      title: 'Name',
      hidden: false,
      unique: null,
      options: [],
      property: {
        extension_types: [],
        max_size: 0,
        is_multiple: false,
      },
      required: true,
      field_key: 'name',
      conditions: [],
      team_field: false,
      description: null,
    };
    setFormFields([...formFields, defaultField]);
  };

  const addOrRemoveCondition = (field: Field) => {
    if (field.conditions.length > 0) {
      field.conditions = [];
    } else {
      field.conditions = [
        {
          field: '',
          operator: '',
          value: '',
        },
      ];
    }
    updateFormStateVariable();
  };

  const addCondition = (field: Field) => {
    field.conditions.push({
      field: '',
      operator: '',
      value: '',
    });
    updateFormStateVariable();
  };

  const removeCondition = (field: Field, index: number) => {
    field.conditions.splice(index, 1);
    updateFormStateVariable();
  };

  return (
    <>
      <Theme>
        <div className={styles.builderContainer}>
          <EventHeader />
          <Glance tab='formbuilder' />
          <div className={styles.requiredFieldsHeader}>
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
                <Reorder.Group values={formFields} onReorder={setFormFields}>
                  {formFields.map((field, idx) => {
                    return (
                      <Reorder.Item value={field} key={field.id}>
                        {field.id !== selectedField.id ? (
                          <div
                            className={styles.customField}
                            key={idx}
                            onClick={() => {
                              setSelectedField(field);
                            }}
                          >
                            <div className={styles.row1}>
                              <RxDragHandleDots2 size={25} color='#606264' id={field.id} />
                              <div>
                                <p
                                  className={styles.customFieldLabel}
                                  onClick={() => {
                                    setSelectedField(field);
                                    setShowChangeTypeModal(true);
                                  }}
                                >
                                  {field.type.toUpperCase()}{' '}
                                  <span className={styles.changeTypeButton}>
                                    <FaChevronDown size={15} color='white' />
                                  </span>
                                </p>
                                <p className={styles.customFieldType}>
                                  <BsAlphabetUppercase size={25} /> {field.title}
                                </p>
                              </div>
                            </div>
                            <LuPencil size={20} color='#606264' />

                            <MdDelete
                              size={20}
                              color='#606264'
                              onClick={() => {
                                formFields.splice(idx, 1);
                                updateFormStateVariable();
                              }}
                            />
                          </div>
                        ) : (
                          <div className={styles.customFieldExp} key={idx}>
                            <div className={styles.row}>
                              <div className={styles.row1}>
                                <RxDragHandleDots2 size={25} color='#606264' />
                                <p
                                  className={styles.customFieldLabel}
                                  onClick={() => {
                                    setSelectedField(field);
                                    setShowChangeTypeModal(!showChangeTypeModal);
                                  }}
                                >
                                  {field.type.toUpperCase()}
                                  <span className={styles.changeTypeButton}>
                                    <FaChevronDown size={15} color='white' />
                                  </span>
                                </p>
                              </div>

                              <div className={styles.expandedRight}>
                                <div className={styles.requiredCheckbox}>
                                  Required
                                  <Slider
                                    checked={field.required}
                                    text={''}
                                    onChange={() => {
                                      field.required = !field.required;
                                      updateFormStateVariable();
                                    }}
                                  />
                                </div>
                                {field.hidden ? (
                                  <FaRegEyeSlash
                                    size={25}
                                    color='#606264'
                                    onClick={() => {
                                      field.hidden = !field.hidden;
                                      updateFormStateVariable();
                                    }}
                                  />
                                ) : (
                                  <FaRegEye
                                    size={25}
                                    color='#606264'
                                    onClick={() => {
                                      field.hidden = !field.hidden;
                                      updateFormStateVariable();
                                    }}
                                  />
                                )}
                                <MdDelete
                                  size={20}
                                  color='#606264'
                                  onClick={() => {
                                    formFields.splice(idx, 1);
                                    updateFormStateVariable();
                                  }}
                                />
                              </div>
                            </div>
                            <AnimatePresence>
                              <div className={styles.changeTypeContainer}>
                                {showChangeTypeModal && (
                                  <ChangeTypeModal
                                    field={field}
                                    setShowChangeTypeModal={setShowChangeTypeModal}
                                  />
                                )}
                              </div>
                            </AnimatePresence>

                            <div className={styles.customFieldName}>
                              <input
                                type='text'
                                placeholder='Field Name'
                                value={field.title}
                                onChange={(event) => {
                                  field.title = event.target.value;
                                  field.field_key = event.target.value.toLowerCase();
                                  updateFormStateVariable();
                                }}
                              />
                            </div>
                            <div className={styles.customFieldName}>
                              <input
                                type='text'
                                placeholder='Add Some help text.'
                                value={field.description || ''}
                                onChange={(event) => {
                                  field.description = event.target.value;
                                  updateFormStateVariable();
                                }}
                              />
                            </div>

                            {field.options &&
                              (field.type === FieldType.Radio ||
                                field.type === FieldType.Checkbox ||
                                field.type === FieldType.SingleSelect ||
                                field.type === FieldType.MultiSelect) && (
                                <div className={styles.customFieldOption}>
                                  {field.options.map((option, index) => (
                                    <div className='row' key={index}>
                                      <input
                                        className={styles.optionInput}
                                        type='text'
                                        placeholder='Option'
                                        value={option}
                                        onChange={(event) => {
                                          const updatedOptions = field.options;
                                          updatedOptions[index] = event.target.value;
                                          field.options = updatedOptions;
                                          updateFormStateVariable();
                                        }}
                                      />
                                      <IoCloseSharp
                                        onClick={() => {
                                          removeOption(field, index);
                                        }}
                                        size={20}
                                        color='#606264'
                                      />
                                    </div>
                                  ))}
                                  <p
                                    onClick={() => {
                                      addOption(field);
                                    }}
                                    className={styles.addOption}
                                  >
                                    <span>+</span> Add Option
                                  </p>
                                </div>
                              )}

                            <div className={styles.centerRow}>
                              <div className={styles.requiredCheckbox}>
                                Unique &nbsp;
                                <input
                                  type='number'
                                  value={field.unique ?? undefined}
                                  onChange={(event) => {
                                    if (parseInt(event.target.value) < 1) event.target.value = '1';
                                    field.unique = parseInt(event.target.value);
                                    updateFormStateVariable();
                                  }}
                                />
                              </div>

                              {field.type === FieldType.File && (
                                <Slider
                                  checked={field.property.is_multiple}
                                  text={'Allow Multiple Files'}
                                  onChange={() => {
                                    field.property.is_multiple = !field.property.is_multiple;
                                    updateFormStateVariable();
                                  }}
                                />
                              )}
                            </div>
                            {field.type === FieldType.File && (
                              <div className={styles.customFieldOption}>
                                <div className={styles.customFieldOptionRow}>
                                  <div>
                                    <label className={styles.customFieldOptionLabel}>
                                      Allowed Extensions
                                    </label>
                                    <p className={styles.formLabel}>
                                      Select the file extensions allowed.
                                    </p>
                                    <Select
                                      isMulti
                                      isSearchable
                                      styles={customStyles}
                                      options={FileExtensions}
                                      value={field?.property?.extension_types?.map((ext) => ({
                                        value: ext,
                                        label: ext,
                                      }))}
                                      onChange={(selectedOptions) => {
                                        field.property.extension_types = selectedOptions.map(
                                          (option) => option.value,
                                        );
                                        updateFormStateVariable();
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label className={styles.customFieldOptionLabel}>
                                      Max Size:
                                    </label>
                                    <InputField
                                      name='max_size'
                                      id='max_size'
                                      icon={<MdOutlineSdStorage size={20} color='#606264' />}
                                      type='number'
                                      placeholder='Enter max file size(kb)'
                                      value={
                                        field?.property?.max_size
                                          ? field?.property?.max_size.toString()
                                          : '0'
                                      }
                                      onChange={(event) => {
                                        field.property.max_size = parseInt(event.target.value);
                                        updateFormStateVariable();
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {getConditionalFields(field).length >= 0 && (
                              <div
                                className={styles.row1}
                                style={{
                                  marginTop: '1rem',
                                  marginLeft: '1rem',
                                }}
                              >
                                <Slider
                                  checked={field.conditions.length > 0}
                                  text={''}
                                  onChange={() => {
                                    addOrRemoveCondition(field);
                                  }}
                                />
                                <p className={styles.customFieldLabel}>
                                  Show Field only when the conditions are met.
                                </p>
                              </div>
                            )}

                            {field.conditions.length > 0 && (
                              <div className={styles.conditions}>
                                {field.conditions.map((condition, idx) => (
                                  <div className={styles.conditionRow} key={idx}>
                                    <p className={styles.when}>When</p>
                                    <div className={styles.conditionsSelect}>
                                      <SelectComponent
                                        options={getConditionalFields(field)}
                                        value={condition.field}
                                        onChange={(option: { value: string; label: string }) => {
                                          if (!option) condition.field = '';
                                          else condition.field = option.value;

                                          updateFormStateVariable();
                                        }}
                                      />
                                      <SelectComponent
                                        options={[
                                          ...getConditions(getFieldType(condition.field)).map(
                                            (condition) => ({
                                              value: condition.value,
                                              label: condition.label,
                                            }),
                                          ),
                                        ]}
                                        value={condition.operator}
                                        onChange={(option: { value: string; label: string }) => {
                                          if (!option) condition.operator = '';
                                          else condition.operator = option.value;
                                          updateFormStateVariable();
                                        }}
                                      />
                                      <input
                                        type='text'
                                        placeholder='Enter a Value'
                                        value={condition.value}
                                        onChange={(event) => {
                                          condition.value = event.target.value;
                                          updateFormStateVariable();
                                        }}
                                      />

                                      <RiDeleteBinLine
                                        size={20}
                                        color='#606264'
                                        onClick={() => {
                                          removeCondition(field, idx);
                                        }}
                                      />
                                      <LuPlus
                                        style={{
                                          marginLeft: '0.5rem',
                                        }}
                                        size={20}
                                        color='#606264'
                                        onClick={() => {
                                          addCondition(field);
                                        }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </Reorder.Item>
                    );
                  })}
                </Reorder.Group>
                <button
                  onClick={() => {
                    addField();
                  }}
                  className={styles.addQuestionButton}
                >
                  <span>+</span>Add Question
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
