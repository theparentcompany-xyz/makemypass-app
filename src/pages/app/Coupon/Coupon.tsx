import { useEffect, useState } from 'react';
import Glance from '../../../components/Glance/Glance';
import Theme from '../../../components/Theme/Theme';
import styles from './Coupon.module.css';
import { listCoupons } from '../../../apis/coupons';
import GenericTable from '../../../components/Table/GenericTable';
import CouponType from './types';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import Modal from '../../../components/Modal/Modal';
import InputField from '../../auth/Login/InputField';
import { customStyles } from '../EventPage/constants';
import Select from 'react-select';

const Coupon = () => {
  type CouponModalType = {
    showModal: boolean;
  };

  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [couponModal, setCouponModal] = useState<CouponModalType>({
    showModal: true,
  });
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  useEffect(() => {
    listCoupons(eventId, setCoupons);
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
            <div className={styles.couponModal}>
              <div className={styles.couponCodeInput}>
                <p className={styles.fieldHeader}>Amount off Ticket</p>

                <InputField
                  type='text'
                  name='Coupon Code'
                  id='couponCode'
                  placeholder='Coupon Code'
                  icon={<></>}
                  required={true}
                  onChange={() => {}}
                  value=''
                  description='Customer must enter this coupon code at checkout'
                />

                <hr className={styles.line} />

                <div className={styles.discountContainer}>
                  <InputField
                    type='text'
                    name='Discount Value'
                    id='discount'
                    placeholder='Enter Discount Value'
                    icon={<></>}
                    required={true}
                    onChange={() => {}}
                    value=''
                  />

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
                  onChange={() => {}}
                  value=''
                />

                <hr className={styles.line} />
              </div>
            </div>
          </Modal>
        )}
        {coupons.length > 0 && (
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
        )}
      </Theme>
    </>
  );
};

export default Coupon;
