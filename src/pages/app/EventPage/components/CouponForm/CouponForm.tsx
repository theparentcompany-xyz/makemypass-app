import React from 'react';
import { CouponData, DiscountData } from '../../types';
import { EventType, TicketType } from '../../../../../apis/types';
import styles from './CouponForm.module.css';
import { discountedTicketPrice, getIcon } from '../../constants';
import InputFIeld from '../../../../auth/Login/InputFIeld';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import { motion } from 'framer-motion';
import { applyCoupon } from '../../../../../apis/publicpage';

const CouponForm = ({
  ticketInfo,
  setTicketId,
  ticketId,
  eventId,
  discount,
  setDiscount,
  setAmount,
  eventData,
  setCoupon,
  coupon,
}: {
  ticketInfo: { [key: string]: TicketType };
  setTicketId: React.Dispatch<React.SetStateAction<string>>;
  ticketId: string;
  eventId: string;
  discount: DiscountData;
  setDiscount: React.Dispatch<React.SetStateAction<DiscountData>>;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  eventData: EventType | undefined;
  setCoupon: React.Dispatch<React.SetStateAction<CouponData>>;
  coupon: CouponData;
}) => {
  return (
    <>
      {coupon.coupon && (
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className={`${styles.row} ${styles.ticketType}`}
          style={{
            marginTop: '0rem',
            border: discount.discount_value > 0 ? '2px solid #46BF75' : '2px solid #2A3533',
          }}
        >
          <InputFIeld
            name='coupon_code'
            placeholder='Coupon Code'
            id='coupon_code'
            key='coupon_code'
            error={[coupon.error ?? '']}
            onChange={(e) => {
              setCoupon({
                ...coupon,
                error: '',
                value: e.target.value,
              });
            }}
            type='text'
            icon={getIcon('coupon_code')}
            required={true}
            description={coupon.description}
            style={{
              marginTop: '-1rem',
              border: discount.discount_value > 0 ? '2px solid #46BF75' : '2px solid #2A3533',
            }}
          />
          {discount.discount_type && discount.discount_value > 0 && (
            <p
              style={{
                marginTop: '-1.75rem',
              }}
              className={styles.discountText}
            >
              {discount.discount_type.toLowerCase() === 'percentage'
                ? `${discount.discount_value}% discount applied`
                : `${discount.discount_value} ${ticketInfo[Object.keys(ticketInfo)[0]].currency} discount applied`}
            </p>
          )}

          <div>
            <SecondaryButton
              onClick={() => {
                if (coupon.value) applyCoupon(eventId, coupon, setDiscount, setCoupon);
                else {
                  setCoupon({
                    ...coupon,
                    error: 'Please enter a coupon code',
                  });
                }
              }}
              buttonText='Validate Code'
            />
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className={styles.ticketTypes}
      >
        <div
          style={{
            marginLeft: '8px',
          }}
        >
          <p className={styles.ticketTypesTitle}>Ticket Types</p>
          <p className={styles.eventDescription}>Select a ticket type to register for the event.</p>
        </div>

        {Object.keys(ticketInfo)?.map((ticketType) => (
          <div
            key={ticketType}
            onClick={() => {
              setTicketId(ticketInfo[ticketType].id);
              if (discount.discount_value > 0)
                setAmount(
                  discountedTicketPrice(Number(ticketInfo[ticketType].price), discount).toString(),
                );
              else {
                setAmount(ticketInfo[ticketType].price.toString());
              }
            }}
            className={styles.ticketType}
            style={{
              border:
                ticketId === ticketInfo[ticketType].id ? '2px solid #FFFFFF' : '2px solid #2A3533',
            }}
          >
            <div className={styles.passText}>
              <p className={styles.ticketTypeTitle}>{ticketType?.toUpperCase()}</p>

              <div className={styles.perks}>
                {Object.keys(ticketInfo[ticketType].perks)?.map((perk) => (
                  <div key={perk} className={styles.perk}>
                    {perk}: {ticketInfo[ticketType].perks[perk]}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.ticketPriceData}>
              {discount.discount_value > 0 && ticketInfo[ticketType].price > 0 && (
                <div className={styles.discountData}>
                  <p className={styles.discountAmount}>
                    {discount.discount_type.toLowerCase() === 'percentage'
                      ? `${discount.discount_value}% off`
                      : `${ticketInfo[ticketType].currency} ${discount.discount_value} off`}
                  </p>
                  <p className={styles.originalPrice}>
                    <del>
                      M.R.P. {ticketInfo[ticketType].currency} {ticketInfo[ticketType].price}
                    </del>
                  </p>
                </div>
              )}
              <div className={styles.priceData}>
                <p className={styles.ticketPrice}>
                  {discountedTicketPrice(Number(ticketInfo[ticketType].price), discount) === 0
                    ? 'FREE'
                    : `${ticketInfo[ticketType].currency} ${discountedTicketPrice(Number(ticketInfo[ticketType].price), discount)}`}
                </p>
                <p className={styles.extraCharges}>
                  {ticketInfo[ticketType].platform_fee_from_user &&
                    Number(ticketInfo[ticketType].price) > 0 &&
                    discountedTicketPrice(Number(ticketInfo[ticketType].price), discount) !== 0 && (
                      <p className={styles.extraCharges}>
                        {ticketInfo[ticketType].platform_fee}% extra charges
                      </p>
                    )}
                </p>
              </div>
            </div>

            <p className={styles.cardText}>{eventData?.title?.toUpperCase()}</p>
          </div>
        ))}
      </motion.div>
    </>
  );
};

export default CouponForm;
