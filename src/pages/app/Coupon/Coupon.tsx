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
import { TicketType } from '../../../apis/types';
import { getTickets } from '../../../apis/tickets';
import Slider from '../../../components/SliderButton/Slider';

const Coupon = () => {
  type CouponModalType = {
    showModal: boolean;
  };

  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [couponModal, setCouponModal] = useState<CouponModalType>({
    showModal: true,
  });

  const couponTypes = [
    {
      value: 'precentage',
      label: 'Percentage',
    },
    {
      value: 'amount',
      label: 'Amount',
    },
  ];
  const [tickets, setTickets] = useState<TicketType[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [coupons, setCoupons] = useState<CouponType[]>([]);

  const [newCouponData, setNewCouponData] = useState<CreateCouponType>({
    code: '',
    value: 0,
    type: 'amount',
    tickets: [],
    description: '',
    active: true,
    count: 0,
    conditions: '',
    is_private: false,
  });

  useEffect(() => {
    listCoupons(eventId, setCoupons);
    getTickets(eventId, setTickets);
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
                            type: selectedOption.value,
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
                    checked={newCouponData.is_private}
                    onChange={() => {
                      setNewCouponData({ ...newCouponData, is_private: !newCouponData.is_private });
                    }}
                    text='Activate Ticket'
                  />
                </div>
              </div>

              <div className={styles.buttons}>
                <SecondaryButton
                  buttonText='Discard Coupon'
                  onClick={() => {
                    setCouponModal({ showModal: false });
                  }}
                />
                <SecondaryButton
                  buttonText='Save Coupon'
                  onClick={() => {
                    createCoupon(eventId, newCouponData);
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
