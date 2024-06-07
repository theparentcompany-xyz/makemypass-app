import React, { useEffect, useState } from 'react';
import { CouponData, DiscountData, Tickets } from '../../types';
import { EventType, FormDataType, TicketType } from '../../../../../apis/types';
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

const CouponForm = ({
  setTickets,
  tickets,
  discount,
  setDiscount,
  eventData,
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
  eventData: EventType;
  setCoupon: React.Dispatch<React.SetStateAction<CouponData>>;
  coupon: CouponData;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  selectedDate: string | null | undefined;
  formData: FormDataType;
}) => {
  const handleDateChange = (date: string | null | undefined | Date) => {
    let newDate;
    if (date) newDate = new Date(date);

    if (newDate && eventData) {
      setSelectedDate(newDate.toISOString().split('T')[0]);
    }
    getTickets();
  };
  const [filteredTickets, setFilteredTickets] = useState<TicketType[]>([]);
  const [newTickets, setNewTickets] = useState<Tickets[]>([]);

  const onSelectTicket = (currentTicketId: string) => {
    if (eventData?.select_multi_ticket) {
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
    } else if (eventData?.is_sub_event) {
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

  const getTickets = () => {
    const tempList: TicketType[] = [];
    eventData?.tickets.forEach((ticket) => {
      if (ticket.conditions) {
        if (validateCondition(ticket.conditions, formData, eventData.form)) {
          tempList.push(ticket);
        }
      } else {
        tempList.push(ticket);
      }
    });
    setFilteredTickets([]);

    const tempList2: TicketType[] = [];
    tempList.forEach((ticket) => {
      if (ticket.entry_date && ticket.entry_date.length > 0) {
        ticket.entry_date.forEach((date) => {
          if (selectedDate === date.date) {
            const updatedTicket = {
              ...ticket,
              capacity: date.capacity ? date.capacity : ticket.capacity,
              price: date.price ? date.price : ticket.price,
              show_price: date.show_price ? date.show_price : ticket.show_price,
            };
            tempList2.push(updatedTicket);
          }
        });
      } else {
        tempList2.push(ticket);
      }
    });

    tempList2.forEach((ticket) => {
      // TODO: move to type to enum (amount, percent)
      if (discount?.discount_type === 'percentage' && discount.ticket.includes(ticket.id)) {
        const updatedTicket = {
          ...ticket,
          price: ticket.price - (ticket.price * Number(discount.discount_value)) / 100,
          show_price: ticket.price,
        };
        setFilteredTickets((prevTickets) => {
          return [...prevTickets, updatedTicket];
        });
      } else if (discount?.discount_type === 'amount' && discount.ticket.includes(ticket.id)) {
        const updatedTicket = {
          ...ticket,
          price: ticket.price - Number(discount.discount_value),
          show_price: ticket.price,
        };
        setFilteredTickets((prevTickets) => {
          return [...prevTickets, updatedTicket];
        });
      } else {
        setFilteredTickets((prevTickets) => {
          return [...prevTickets, ticket];
        });
      }
    });
  };

  useEffect(() => {
    if (eventData) {
      handleDateChange(findMinDate(eventData));
      getTickets();
    }
  }, [eventData]);

  useEffect(() => {
    getTickets();
  }, [discount]);

  useEffect(() => {
    getTickets();
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
              if (coupon.value) applyCoupon(eventData.id, coupon, setDiscount, setCoupon);
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

      {eventData?.tickets[0]?.entry_date && eventData?.tickets[0]?.entry_date.length > 0 && (
        <SelectDate
          eventData={eventData}
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
            eventData &&
            validateCondition(filteredTicket.conditions, formData, eventData?.form)
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
                {eventData?.select_multi_ticket && (
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

                <p className={styles.cardText}>{eventData?.title?.toUpperCase()}</p>
              </div>
            );
          }
        })}
      </motion.div>
    </>
  );
};

export default CouponForm;
