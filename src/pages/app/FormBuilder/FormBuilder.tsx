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

import { useEffect, useState } from 'react';
import { getForm, updateForm } from '../../../apis/formbuilder';
import { Field } from './types';
import SelectComponent from './SelectComponent';
import { IoCloseSharp } from 'react-icons/io5';
import { IoIosSave } from 'react-icons/io';
import { conditions } from './constant';
import toast from 'react-hot-toast';

const FormBuilder = () => {
  const { event_id } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [formFields, setFormFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field>({} as Field);
  const [newOption, setNewOption] = useState(false);
  const [newOptionValue, setNewOptionValue] = useState('');

  useEffect(() => {
    getForm(event_id, setFormFields);
  }, [event_id]);

  const updateFormFieldValue = (
    field: Field,
    key: string,
    value: string | boolean | string[] | { field: string; operator: string; value: string }[],
  ) => {
    setFormFields([
      ...formFields.slice(0, formFields.indexOf(field)),
      {
        ...field,
        [key]: value,
      },
      ...formFields.slice(formFields.indexOf(field) + 1),
    ]);
  };

  const updateFormStateVariable = () => {
    setFormFields((prevForm) => {
     ...prevForm 
    });
  };

  const getFormFields = (currentField: Field, fieldId?: string) => {
    let hasPassed = false;

    const fields = formFields.reduce((acc: { value: string; label: string }[], field) => {
      if (
        currentField.conditions.length >= 0 &&
        (!currentField.conditions.find((condition) => condition.field === field.id) || fieldId)
      )
        if (field.id !== currentField.id && !hasPassed) {
          acc.push({
            value: field.id,
            label: field.title,
          });
        } else {
          hasPassed = true;
        }

      return acc;
    }, []);

    return fields;
  };

  const removeOption = (field: Field, index: number) => {
    const updatedOptions = field.options;
    updatedOptions.splice(index, 1);
    updateFormFieldValue(field, 'options', updatedOptions);
  };

  useEffect(() => {}, [formFields]);

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
                {formFields.map((field) => {
                  console.log(formFields);
                  return field.id !== selectedField.id ? (
                    <div className={styles.customField}>
                      <div className={styles.row1}>
                        <RxDragHandleDots2 size={25} color='#606264' />
                        <div>
                          <p className={styles.customFieldLabel}>{field.title}</p>
                          <p className={styles.customFieldType}>
                            <BsAlphabetUppercase size={25} /> {field.description}
                          </p>
                        </div>
                      </div>
                      <LuPencil
                        onClick={() => {
                          setSelectedField(field);
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
                          <p className={styles.customFieldLabel}>{field.title}</p>
                        </div>

                        <div className={styles.expandedRight}>
                          <div className={styles.requiredCheckbox}>
                            Unique
                            <Slider
                              checked={field.unique}
                              text={''}
                              onChange={() => {
                                field.unique = !field.unique;
                              }}
                            />
                          </div>
                          <div className={styles.requiredCheckbox}>
                            Required
                            <Slider
                              checked={field.required}
                              text={''}
                              onChange={() => {
                                field.required = !field.required;
                              }}
                            />
                          </div>
                          {field.hidden ? (
                            <FaRegEyeSlash
                              size={25}
                              color='#606264'
                              onClick={() => {
                                field.hidden = !field.hidden;
                              }}
                            />
                          ) : (
                            <FaRegEye
                              size={25}
                              color='#606264'
                              onClick={() => {
                                field.hidden = !field.hidden;
                              }}
                            />
                          )}
                        </div>
                      </div>

                      <div className={styles.customFieldName}>
                        <input
                          type='text'
                          placeholder='Field Name'
                          value={field.title}
                          onChange={(event) => {
                            field.title = event.target.value;
                            console.log(field.title);
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

                      {field.options && (field.type === 'radio' || field.type === 'checkbox') && (
                        <div className={styles.customFieldOption}>
                          {field.options.map((option, index) => (
                            <div className='row'>
                              <input
                                className={styles.optionInput}
                                type='text'
                                placeholder='Option'
                                value={option}
                                onChange={(event) => {
                                  const updatedOptions = field.options;
                                  updatedOptions[index] = event.target.value;
                                  updateFormFieldValue(field, 'options', updatedOptions);
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
                          {newOption && (
                            <div className='row'>
                              <input
                                className={styles.optionInput}
                                type='text'
                                placeholder='Option'
                                onChange={(event) => {
                                  setNewOptionValue(event.target.value);
                                }}
                              />
                              <IoIosSave
                                onClick={() => {
                                  const updatedOptions = field.options;
                                  updatedOptions.push(newOptionValue);

                                  updateFormFieldValue(field, 'options', updatedOptions);
                                  setNewOption(false);
                                }}
                                size={20}
                                color='#606264'
                              />
                            </div>
                          )}
                          <p
                            onClick={() => {
                              setNewOption(true);
                            }}
                            className={styles.addOption}
                          >
                            <span>+</span> Add Option
                          </p>
                        </div>
                      )}

                      {getFormFields(field).length >= 0 && (
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
                              updateFormFieldValue(
                                field,
                                'condition',
                                field.conditions.length > 0
                                  ? []
                                  : [
                                      {
                                        field: '',
                                        operator: '',
                                        value: '',
                                      },
                                    ],
                              );
                            }}
                          />
                          <p className={styles.customFieldLabel}>
                            Show Field only when the conditions are met.
                          </p>
                        </div>
                      )}

                      {field.conditions.length > 0 && (
                        <div className={styles.conditions}>
                          {field.conditions.map((condition) => (
                            <div className={styles.conditionRow}>
                              <p className={styles.when}>When</p>
                              <div className={styles.conditionsSelect}>
                                <SelectComponent
                                  options={getFormFields(field, condition.field)}
                                  value={condition.field}
                                  onChange={(option: { value: string; label: string }) => {
                                    updateFormFieldValue(
                                      field,
                                      'condition',
                                      field.conditions.map((cond) => {
                                        if (cond.field === condition.field) {
                                          return {
                                            ...cond,
                                            field: option.value,
                                          };
                                        }
                                        return cond;
                                      }),
                                    );
                                  }}
                                />
                                <SelectComponent
                                  options={[
                                    ...conditions.map((condition) => ({
                                      value: condition.value,
                                      label: condition.label,
                                    })),
                                  ]}
                                  value={condition.operator}
                                  onChange={(option: { value: string; label: string }) => {
                                    updateFormFieldValue(
                                      field,
                                      'condition',
                                      field.conditions.map((cond) => {
                                        if (cond.field === condition.field) {
                                          return {
                                            ...cond,
                                            operator: option.value,
                                          };
                                        }
                                        return cond;
                                      }),
                                    );
                                  }}
                                />
                                <input
                                  type='text'
                                  placeholder='Enter a Value'
                                  value={condition.value}
                                  onChange={(event) => {
                                    updateFormFieldValue(
                                      field,
                                      'condition',
                                      field.conditions.map((cond) => {
                                        if (cond.field === condition.field) {
                                          return {
                                            ...cond,
                                            value: event.target.value,
                                          };
                                        }
                                        return cond;
                                      }),
                                    );
                                  }}
                                />

                                <RiDeleteBinLine
                                  size={20}
                                  color='#606264'
                                  onClick={() => {
                                    updateFormFieldValue(
                                      field,
                                      'condition',
                                      field.conditions.filter(
                                        (cond) => cond.field !== condition.field,
                                      ),
                                    );
                                    toast.success('Condition Removed Successfully');
                                  }}
                                />

                                <RxDragHandleDots2
                                  style={{
                                    marginLeft: '0.5rem',
                                  }}
                                  size={20}
                                  color='#606264'
                                />

                                {getFormFields(field, condition.field).length > 0 && (
                                  <LuPlus
                                    style={{
                                      marginLeft: '0.5rem',
                                    }}
                                    size={20}
                                    color='#606264'
                                    onClick={() => {
                                      updateFormFieldValue(field, 'condition', [
                                        ...field.conditions,
                                        {
                                          field: '',
                                          operator: '',
                                          value: '',
                                        },
                                      ]);
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* <p className={styles.addCustomField}>
                        <span>+</span> Add Condition
                      </p> */}
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
