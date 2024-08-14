import React, { useEffect, useState } from 'react';
import { CouponData, DiscountData, Tickets } from '../../types';
import { FormDataType, TicketType } from '../../../../../apis/types';
import styles from './CouponForm.module.css';
import { getIcon } from '../../constants';
import InputField from '../../../../auth/Login/InputField.tsx';
import { motion } from 'framer-motion';
import { applyCoupon } from '../../../../../apis/publicpage';

import 'react-datepicker/dist/react-datepicker.css';
import SelectDate from '../../../../../components/SelectDate/SelectDate';
import toast from 'react-hot-toast';
import { findMinDate } from '../../../../../common/commonFunctions';
import { filterTickets } from '../../../../../common/coreLogics.ts';
import { FormEventData } from '../../../Guests/types.ts';

const CouponForm = ({
  setTickets,
  tickets,
  discount,
  setDiscount,
  eventFormData,
  setCoupon,
  coupon,
  setSelectedDate,
  selectedDate,
  formData,
}: {
  setTickets: React.Dispatch<React.SetStateAction<Tickets[]>>;
  tickets: Tickets[];
  discount: DiscountData;
  setDiscount: React.Dispatch<React.SetStateAction<DiscountData>>;
  eventFormData: FormEventData;
  setCoupon: React.Dispatch<React.SetStateAction<CouponData>>;
  coupon: CouponData;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  selectedDate: string | null | undefined;
  formData: FormDataType;
}) => {
  const handleDateChange = (date: string | null | undefined | Date) => {
    let newDate;
    if (date) newDate = new Date(date);

    if (newDate && eventFormData) {
      setSelectedDate(newDate.toISOString().split('T')[0]);
    }
    filterTickets({
      eventFormData,
      selectedDate,
      discount,
      setFilteredTickets,
      formData,
    });
  };
  const [filteredTickets, setFilteredTickets] = useState<TicketType[]>([]);
  const [newTickets, setNewTickets] = useState<Tickets[]>([]);

  const ticketSoldAlert = () => {
    toast.error('Ticket sold out');
  };

  const onSelectTicket = (currentTicketId: string) => {
    if (eventFormData?.select_multi_ticket) {
      let newTicket = true;
      const updatedTickets = tickets.map((ticket) => {
        if (ticket.ticket_id === currentTicketId) {
          newTicket = false;
          return {
            ...ticket,
            count: ticket.count == 0 ? 1 : ticket.count,
            my_ticket: true,
          };
        } else {
          return {
            ...ticket,
            my_ticket: false,
          };
        }
      });
      if (newTicket) {
        updatedTickets.push({ ticket_id: currentTicketId, count: 1, my_ticket: true });
      }
      setTickets(updatedTickets);
    } else if (eventFormData?.is_sub_event) {
      setTickets((prevTickets) => [
        ...prevTickets,
        { ticket_id: currentTicketId, count: 1, my_ticket: true },
      ]);
    } else {
      setTickets([{ ticket_id: currentTicketId, count: 1, my_ticket: true }]);
    }
  };

  const updateTicketCount = (ticketId: string, increment: boolean) => {
    let newTicket = true;
    const updatedTickets: Tickets[] = tickets.map((ticket) => {
      if (ticket.ticket_id === ticketId && ticket.count >= 0) {
        newTicket = false;
        return {
          ...ticket,
          count: increment ? ticket.count + 1 : ticket.count > 0 ? ticket.count - 1 : 0,
        };
      }
      return ticket;
    });

    if (newTicket) {
      updatedTickets.push({ ticket_id: ticketId, count: 1, my_ticket: false });
    }
    setNewTickets(updatedTickets);
  };

  const isTicketActive = (filteredTicket: TicketType) => {
    const isActive = tickets.find(
      (ticket) => ticket.my_ticket && ticket.ticket_id === filteredTicket.id,
    );

    if (isActive) return true;
    else return false;
  };

  useEffect(() => {
    if (eventFormData) {
      handleDateChange(findMinDate(eventFormData));
      filterTickets({
        eventFormData,
        selectedDate,
        discount,
        setFilteredTickets,
        formData,
      });
    }
  }, [eventFormData]);

  useEffect(() => {
    filterTickets({
      eventFormData,
      selectedDate,
      discount,
      setFilteredTickets,
      formData,
    });
  }, [discount]);

  useEffect(() => {
    filterTickets({
      eventFormData,
      selectedDate,
      discount,
      setFilteredTickets,
      formData,
    });
  }, [selectedDate]);

  useEffect(() => {
    setTickets(newTickets);
  }, [newTickets]);

  useEffect(() => {
    if (tickets.length === 0 && filteredTickets.length > 0) {
      const defaultTicket =
        filteredTickets.find((ticket: TicketType) => ticket.default_selected) || filteredTickets[0];
      setTickets([{ ticket_id: defaultTicket.id, count: 1, my_ticket: true }]);
    }
  }, [filteredTickets]);

  return (
    <>
      {findMinDate(eventFormData) && (
        <SelectDate
          eventFormData={eventFormData}
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className={styles.ticketTypes}
      >
        <div>
          <p className={styles.ticketTypesTitle}>Ticket Types</p>
          <p className={styles.eventDescription}>Select a ticket type to register for the event.</p>
        </div>

        {filteredTickets?.map((filteredTicket) => {
          return (
            <div
              key={filteredTicket.id}
              onClick={() => {
                filteredTicket.capacity && filteredTicket.capacity <= 0
                  ? ticketSoldAlert()
                  : onSelectTicket(filteredTicket.id);
              }}
              className={`${styles.ticketType} ${isTicketActive(filteredTicket) ? styles.borderClassWhite : styles.borderClassDefault}`}
              style={
                filteredTicket.capacity && filteredTicket.capacity <= 0
                  ? { opacity: '0.5' }
                  : undefined
              }
            >
              {eventFormData?.select_multi_ticket && (
                <div className={styles.ticketCountContainer}>
                  <div className='row' style={{ columnGap: 0 }}>
                    <button
                      className={styles.ticketCountUpdateButton}
                      onClick={() => {
                        filteredTicket.capacity && filteredTicket.capacity <= 0
                          ? ticketSoldAlert()
                          : updateTicketCount(filteredTicket.id, false);
                      }}
                    >
                      -
                    </button>
                    <p className={styles.ticketCount}>
                      {tickets.find((ticket) => ticket.ticket_id === filteredTicket.id)?.count ?? 0}
                    </p>
                    <button
                      className={styles.ticketCountUpdateButton}
                      onClick={() => {
                        const currentTicketCount = tickets.find(
                          (ticket) => ticket.ticket_id === filteredTicket.id,
                        )?.count;

                        if (
                          currentTicketCount === filteredTicket.capacity ||
                          (filteredTicket.capacity != null && filteredTicket.capacity <= 0)
                        ) {
                          toast.error('Ticket limit reached');
                          return;
                        }
                        updateTicketCount(filteredTicket.id, true);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {filteredTicket.capacity != null && filteredTicket.capacity >= 0 && (
                <div className={styles.dateContainer}>
                  <p className={styles.capacity}>{filteredTicket.capacity} tickets left</p>
                </div>
              )}

              <div>
                <div className={styles.passText}>
                  <p className={styles.ticketTypeTitle}>
                    {filteredTicket.title?.toUpperCase()}{' '}
                    {filteredTicket.user_count > 1 && <span>x {filteredTicket.user_count}</span>}
                  </p>
                  <p
                    className={styles.ticketTypeDescription}
                    dangerouslySetInnerHTML={{ __html: filteredTicket.description }}
                  ></p>
                  <div className={styles.perks}>
                    {Object.keys(filteredTicket.perks)?.map((perk) => (
                      <div key={perk} className={styles.perk}>
                        {perk}: {filteredTicket.perks[perk]}
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.ticketPriceData}>
                  {discount.discount_value > 0 &&
                    filteredTicket.price > 0 &&
                    discount.ticket.includes(filteredTicket.id) && (
                      <div className={styles.discountData}>
                        <p className={styles.discountAmount}>
                          {discount.discount_type.toLowerCase() === 'percentage'
                            ? `${discount.discount_value}% off`
                            : `${filteredTicket.currency} ${discount.discount_value} off`}
                        </p>
                        <p className={styles.originalPrice}>
                          <del>
                            {filteredTicket.currency} {filteredTicket.show_price}
                          </del>
                        </p>
                      </div>
                    )}

                  <div className={styles.priceData}>
                    <p className={styles.ticketPrice}>
                      {filteredTicket.platform_fee + filteredTicket.gateway_fee > 0 &&
                        filteredTicket.currency}{' '}
                      {filteredTicket.price}{' '}
                    </p>
                    <br />
                    <p className={styles.extraCharges}>
                      {filteredTicket.platform_fee_from_user && filteredTicket.price > 0 && (
                        <>
                          {filteredTicket.platform_fee > 0 && (
                            <p className={styles.extraCharges}>
                              {filteredTicket.platform_fee}% Extra Platform Fee
                            </p>
                          )}
                          {filteredTicket.gateway_fee > 0 && (
                            <p className={styles.extraCharges}>
                              {filteredTicket.gateway_fee}% Extra Gateway Fee
                            </p>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {coupon.status && (
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className={`${styles.ticketType}`}
          style={{
            marginTop: '0rem',
            border:
              discount.discount_value > 0 ? styles.borderClassGreen : styles.borderClassDefault,
          }}
        >
          <p className={styles.couponHeader}>Have a Coupon Code?</p>
          {coupon.description && <p className={styles.couponDescription}>{coupon.description}</p>}
          <InputField
            name='coupon_code'
            placeholder='Coupon Code'
            id='coupon_code'
            key='coupon_code'
            error={[coupon.error ?? '']}
            type='text'
            icon={getIcon('coupon_code')}
            style={{
              marginTop: '-1rem',
              border:
                discount.discount_value > 0 && discount.ticket.length > 0
                  ? styles.borderClassDefault
                  : styles.borderClassGreen,
            }}
            onChange={(e) => {
              setCoupon({ ...coupon, error: '', value: e.target.value });
            }}
          />
          {discount.discount_type && discount.discount_value > 0 && (
            <p className={styles.discountText}>
              {discount.discount_type.toLowerCase() === 'percentage'
                ? `${discount.discount_value}% discount applied`
                : `${discount.discount_value} ${filteredTickets[0].currency} discount applied`}
            </p>
          )}

          <button
            className={styles.validateButton}
            onClick={() => {
              if (coupon.value) applyCoupon(eventFormData.id, coupon, setDiscount, setCoupon);
              else {
                setCoupon({ ...coupon, error: 'Please enter a coupon code' });
                setDiscount({ discount_value: 0, discount_type: 'error', ticket: [] });
              }
            }}
          >
            Validate Coupon
          </button>
        </motion.div>
      )}
    </>
  );
};

export default CouponForm;
