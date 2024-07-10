import { useEffect, useState } from 'react';
import Glance from '../../../components/Glance/Glance';
import Theme from '../../../components/Theme/Theme';
import styles from './Coupon.module.css';
import { createCoupon, listCoupons } from '../../../apis/coupons';
import GenericTable from '../../../components/Table/GenericTable';
import CouponType, { CreateCouponType } from './types';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import Modal from '../../../components/Modal/Modal';
import InputField from '../../auth/Login/InputField';
import { customStyles } from '../EventPage/constants';
import Select from 'react-select';
import { FormFieldType, TicketType } from '../../../apis/types';
import { getTickets } from '../../../apis/tickets';
import Slider from '../../../components/SliderButton/Slider';
import { LuPlus } from 'react-icons/lu';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { RiDeleteBinLine } from 'react-icons/ri';
import SelectComponent from '../FormBuilder/SelectComponent';
import { getFormFields } from '../../../apis/publicpage';
import { conditions } from '../FormBuilder/constant';

const Coupon = () => {
  type CouponModalType = {
    showModal: boolean;
  };

  const couponTypes = [
    {
      value: 'percentage',
      label: 'Percentage',
    },
    {
      value: 'amount',
      label: 'Amount',
    },
  ];

  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [couponModal, setCouponModal] = useState<CouponModalType>({
    showModal: false,
  });

  const [tickets, setTickets] = useState<TicketType[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [formFields, setFormFields] = useState<FormFieldType[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [newCouponData, setNewCouponData] = useState<CreateCouponType>({
    code: '',
    value: 0,
    type: 'amount',
    tickets: [],
    description: '',
    is_active: true,
    count: 0,
    conditions: [],
    is_private: false,
  });

  useEffect(() => {
    listCoupons(eventId, setCoupons);
    getTickets(eventId, setTickets);
    getFormFields(eventId, setFormFields);
  }, []);

  return (
    <>
      <Theme>
        <Glance tab='coupon' />
        {couponModal.showModal && (
          <Modal
            type='side'
            title='Add New Coupon Code'
            onClose={() => setCouponModal({ showModal: false })}
          >
            <div
              className={styles.couponModal}
              style={{
                maxWidth: '30rem',
              }}
            >
              <div className={styles.couponCodeInput}>
                <p className={styles.fieldHeader}>Amount off Ticket</p>

                <InputField
                  type='text'
                  name='Coupon Code'
                  id='couponCode'
                  placeholder='Coupon Code'
                  icon={<></>}
                  required={true}
                  onChange={(event) => {
                    setNewCouponData({ ...newCouponData, code: event.target.value });
                  }}
                  value={newCouponData.code}
                  description='Customer must enter this coupon code at checkout'
                />

                <hr className={styles.line} />

                <div className={styles.discountContainer}>
                  <div className={styles.discountValue}>
                    <InputField
                      type='text'
                      name='Discount Value'
                      id='discount'
                      placeholder='Enter Discount Value'
                      icon={<></>}
                      required={true}
                      onChange={(event) => {
                        setNewCouponData({ ...newCouponData, value: parseInt(event.target.value) });
                      }}
                      value={newCouponData.value.toString()}
                    />
                    <Select
                      styles={customStyles}
                      name='colors'
                      className={styles.basicSelect}
                      classNamePrefix='select'
                      options={couponTypes}
                      onChange={(selectedOption) => {
                        if (selectedOption)
                          setNewCouponData({
                            ...newCouponData,
                            type: selectedOption.value as 'percentage' | 'amount',
                          });
                      }}
                    />
                  </div>
                  <>
                    <div
                      style={{
                        marginBottom: '1rem',
                      }}
                    >
                      <p className={styles.fieldHeader}>Applies To</p>
                      <Select
                        isMulti
                        styles={customStyles}
                        name='colors'
                        className='basic-multi-select'
                        classNamePrefix='select'
                        options={tickets.map((ticket) => {
                          return {
                            value: ticket.id,
                            label: ticket.title,
                          };
                        })}
                        onChange={(options) => {
                          setNewCouponData({
                            ...newCouponData,
                            tickets: options.map((option) => option.value),
                          });
                        }}
                      />
                    </div>
                  </>
                </div>

                <hr className={styles.line} />

                <InputField
                  type='textarea'
                  name='Description'
                  id='description'
                  placeholder='Write a short description'
                  icon={<></>}
                  required={true}
                  onChange={(event) => {
                    setNewCouponData({ ...newCouponData, description: event.target.value });
                  }}
                  value={newCouponData.description}
                />

                <hr className={styles.line} />

                <div className={styles.discountUses}></div>

                <div className={styles.discountUses}>
                  <p className={styles.fieldHeader}>Maximum Discount Uses</p>
                  <InputField
                    type='text'
                    name='Conditions'
                    id='conditions'
                    placeholder='Limit number of times this discount can be used in total'
                    icon={<></>}
                    required={true}
                    onChange={(event) => {
                      setNewCouponData({ ...newCouponData, count: Number(event.target.value) });
                    }}
                    value={newCouponData.count.toString()}
                  />
                </div>

                <div className={styles.limitOne}>
                  <Slider
                    checked={newCouponData.is_private}
                    onChange={() => {
                      setNewCouponData({ ...newCouponData, is_private: !newCouponData.is_private });
                    }}
                    text='Show Ticket in Form'
                  />
                  <Slider
                    checked={newCouponData.is_active}
                    onChange={() => {
                      setNewCouponData({ ...newCouponData, is_active: !newCouponData.is_private });
                    }}
                    text='Activate Ticket'
                  />
                </div>
              </div>

              <hr className={styles.line} />

              <div className={styles.conditions}>
                <p className={styles.fieldHeader}>Customer Eligiblity</p>
                <Slider
                  checked={newCouponData.conditions.length > 0}
                  onChange={() => {
                    if (newCouponData.conditions.length > 0) newCouponData.conditions = [];
                    else
                      newCouponData.conditions.push({
                        field: '',
                        value: '',
                        operator: '',
                      });

                    setNewCouponData({ ...newCouponData });
                  }}
                  text='Show coupon only when conditions are met'
                />
                {newCouponData.conditions.length >= 0 && (
                  <div className={styles.conditions}>
                    {newCouponData.conditions.map((condition, idx) => (
                      <div className={styles.conditionRow} key={idx}>
                        <p className={styles.when}>{idx === 0 ? 'When' : 'And'}</p>
                        <div className={styles.conditionsSelect}>
                          <SelectComponent
                            options={
                              formFields.length > 0
                                ? formFields.map((field) => ({
                                    value: field.id,
                                    label: field.title,
                                  }))
                                : []
                            }
                            value={condition.field}
                            onChange={(option: { value: string; label: string }) => {
                              if (!option) condition.field = '';
                              else condition.field = option.value;

                              setNewCouponData({ ...newCouponData });
                            }}
                            isSmall={true}
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
                              if (!option) condition.operator = '';
                              else condition.operator = option.value;

                              setNewCouponData({ ...newCouponData });
                            }}
                            isSmall={true}
                          />
                          <input
                            type='text'
                            placeholder='Enter a Value'
                            value={condition.value}
                            onChange={(event) => {
                              condition.value = event.target.value;

                              setNewCouponData({ ...newCouponData });
                            }}
                          />

                          <RiDeleteBinLine
                            size={20}
                            color='#606264'
                            onClick={() => {
                              newCouponData.conditions.splice(idx, 1);
                              setNewCouponData({ ...newCouponData });
                            }}
                          />

                          <RxDragHandleDots2
                            style={{
                              marginLeft: '0.5rem',
                            }}
                            size={20}
                            color='#606264'
                          />

                          <LuPlus
                            style={{
                              marginLeft: '0.5rem',
                            }}
                            size={20}
                            color='#606264'
                            onClick={() => {
                              newCouponData.conditions.push({
                                field: '',
                                value: '',
                                operator: '',
                              });
                              setNewCouponData({ ...newCouponData });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.buttons}>
                <SecondaryButton
                  buttonText='Discard Coupon'
                  onClick={() => {
                    setCouponModal({ showModal: false });
                    setNewCouponData({
                      code: '',
                      value: 0,
                      type: 'amount',
                      tickets: [],
                      description: '',
                      is_active: true,
                      count: 0,
                      conditions: [],
                      is_private: false,
                    });
                  }}
                />
                <SecondaryButton
                  buttonText='Save Coupon'
                  onClick={() => {
                    createCoupon(eventId, newCouponData, setCoupons);
                    setCouponModal({ showModal: false });
                    setNewCouponData({
                      code: '',
                      value: 0,
                      type: 'amount',
                      tickets: [],
                      description: '',
                      is_active: true,
                      count: 0,
                      conditions: [],
                      is_private: false,
                    });
                  }}
                />
              </div>
            </div>
          </Modal>
        )}
        {coupons.length > 0 ? (
          <div className={styles.couponListingContainer}>
            <GenericTable
              tableHeading='Coupons'
              tableData={coupons}
              secondaryButton={
                <SecondaryButton
                  buttonText='+ Add New Coupon Code'
                  onClick={() => {
                    setCouponModal({ showModal: true });
                  }}
                />
              }
            />
          </div>
        ) : (
          <div className={styles.noCoupon}>
            <p className={styles.noCouponText}>No Coupons Available</p>
            <SecondaryButton
              buttonText='+ Add New Coupon Code'
              onClick={() => {
                setCouponModal({ showModal: true });
              }}
            />
          </div>
        )}
      </Theme>
    </>
  );
};

export default Coupon;
