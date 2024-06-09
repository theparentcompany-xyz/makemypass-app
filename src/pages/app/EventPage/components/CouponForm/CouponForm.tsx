import React, { useEffect, useState } from 'react';
import { CouponData, DiscountData, Tickets } from '../../types';
import { FormDataType, TicketType } from '../../../../../apis/types';
import styles from './CouponForm.module.css';
import { getIcon } from '../../constants';
import InputField from '../../../../auth/Login/InputField.tsx';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import { motion } from 'framer-motion';
import { applyCoupon } from '../../../../../apis/publicpage';

import 'react-datepicker/dist/react-datepicker.css';
import SelectDate from '../../../../../components/SelectDate/SelectDate';
import toast from 'react-hot-toast';
import { findMinDate } from '../../../../../common/commonFunctions';
import { validateCondition } from '../../../../../components/DynamicForm/condition';
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
        <InputField
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
            border:
              discount.discount_value > 0 && discount.ticket.length > 0
                ? '2px solid #46BF75'
                : '2px solid #2A3533',
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
              : `${discount.discount_value} ${filteredTickets[0].currency} discount applied`}
          </p>
        )}

        <div>
          <SecondaryButton
            onClick={() => {
              if (coupon.value) applyCoupon(eventFormData.id, coupon, setDiscount, setCoupon);
              else {
                setCoupon({
                  ...coupon,
                  error: 'Please enter a coupon code',
                });
                setDiscount({
                  discount_value: 0,
                  discount_type: 'error',
                  ticket: [],
                });
              }
            }}
            buttonText='Validate Coupon'
          />
        </div>
      </motion.div>

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
        <div
          style={{
            marginLeft: '8px',
          }}
        >
          <p className={styles.ticketTypesTitle}>Ticket Types</p>
          <p className={styles.eventDescription}>Select a ticket type to register for the event.</p>
        </div>

        {filteredTickets?.map((filteredTicket) => {
          const hasCapacity = filteredTicket.entry_date.find(
            (entry) => entry.date === selectedDate,
          )?.capacity;

          if (
            ((hasCapacity && hasCapacity > 0) || !hasCapacity) &&
            eventFormData &&
            validateCondition(filteredTicket.conditions, formData, eventFormData?.form)
          ) {
            return (
              <div
                key={filteredTicket.id}
                onClick={() => {
                  onSelectTicket(filteredTicket.id);
                }}
                className={styles.ticketType}
                style={{
                  border: tickets.find(
                    (ticket) => ticket.my_ticket && ticket.ticket_id === filteredTicket.id,
                  )
                    ? '2px solid #FFFFFF'
                    : '2px solid #2A3533',
                }}
              >
                {eventFormData?.select_multi_ticket && (
                  <>
                    <div className={styles.ticketCountContainer}>
                      <div
                        className='row'
                        style={{
                          columnGap: 0,
                        }}
                      >
                        <button
                          className={styles.ticketCountUpdateButton}
                          onClick={() => {
                            updateTicketCount(filteredTicket.id, false);
                          }}
                        >
                          -
                        </button>
                        <p className={styles.ticketCount}>
                          {tickets.find((ticket) => ticket.ticket_id === filteredTicket.id)
                            ?.count ?? 0}
                        </p>
                        <button
                          className={styles.ticketCountUpdateButton}
                          onClick={() => {
                            const currentTicketCount = tickets.find(
                              (ticket) => ticket.ticket_id === filteredTicket.id,
                            )?.count;

                            if (currentTicketCount === filteredTicket.capacity) {
                              toast.error('Ticket limit reached');
                              return;
                            }
                            updateTicketCount(filteredTicket.id, true);
                          }}
                        >
                          +
                        </button>
                      </div>

                      {/*TODO: add this outside this*/}
                      {filteredTicket.capacity <= 10 && (
                        <div className={styles.dateContainer}>
                          <p className={styles.capacity}>{filteredTicket.capacity} tickets left</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className={styles.passText}>
                  <p className={styles.ticketTypeTitle}>{filteredTicket.title?.toUpperCase()}</p>
                  <p className={styles.ticketTypeDescription}>{filteredTicket.description}</p>
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
                      {filteredTicket.currency} {filteredTicket.price}
                    </p>
                    <p className={styles.extraCharges}>
                      {filteredTicket.platform_fee_from_user && filteredTicket.price > 0 && (
                        <p className={styles.extraCharges}>
                          {filteredTicket.platform_fee}% extra charges
                        </p>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </motion.div>
    </>
  );
};

export default CouponForm;
