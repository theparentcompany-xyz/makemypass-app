import React, { useEffect } from 'react';
import { CouponData, DiscountData, Tickets } from '../../types';
import { EventType, TicketType } from '../../../../../apis/types';
import styles from './CouponForm.module.css';
import { discountedTicketPrice, getIcon } from '../../constants';
import InputFIeld from '../../../../auth/Login/InputFIeld';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import { motion } from 'framer-motion';
import { applyCoupon } from '../../../../../apis/publicpage';

import 'react-datepicker/dist/react-datepicker.css';
import SelectDate from '../../../../../components/SelectDate/SelectDate';
import toast from 'react-hot-toast';
import { findMinDate } from '../../../../../common/commonFunctions';

const CouponForm = ({
  ticketInfo,
  setTickets,
  tickets,
  eventId,
  discount,
  setDiscount,
  setAmount,
  eventData,
  setCoupon,
  coupon,
  setSelectedDate,
  selectedDate,
  updateTicketCount,
}: {
  ticketInfo: { [key: string]: TicketType };
  setTickets: React.Dispatch<React.SetStateAction<Tickets[]>>;
  tickets: Tickets[];
  eventId: string;
  discount: DiscountData;
  setDiscount: React.Dispatch<React.SetStateAction<DiscountData>>;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  eventData: EventType | undefined;
  setCoupon: React.Dispatch<React.SetStateAction<CouponData>>;
  coupon: CouponData;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  selectedDate: string | null | undefined;
  updateTicketCount: (ticketId: string, increment: boolean) => void;
}) => {
  const handleDateChange = (date: string | null | undefined | Date) => {
    let newDate;
    if (date) newDate = new Date(date);

    if (newDate && eventData) {
      setSelectedDate(newDate.toISOString().split('T')[0]);
    }
  };

  useEffect(() => {
    if (eventData) handleDateChange(findMinDate(eventData));
  }, [eventData]);

  return (
    <>
      {coupon.status && (
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

      {eventData && (
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

        {Object.keys(ticketInfo)?.map((ticketType) => {
          return (
            (ticketInfo[ticketType].entry_date.find((entry) => entry.date === selectedDate)
              ?.capacity ?? 0) > 0 && (
              <div
                key={ticketType}
                onClick={() => {
                  if (eventData?.select_multi_ticket) {
                    let newTicketIds = []; //temporary variable to store new ticket ids for amount updation

                    if (
                      tickets.filter((ticket) => ticket.ticket_id === ticketInfo[ticketType].id)
                        .length > 0
                    ) {
                      setTickets(
                        tickets.filter((ticket) => ticket.ticket_id !== ticketInfo[ticketType].id),
                      );
                      newTicketIds = tickets.filter(
                        (ticket) => ticket.ticket_id !== ticketInfo[ticketType].id,
                      );
                    } else {
                      setTickets([
                        ...tickets,
                        {
                          ticket_id: ticketInfo[ticketType].id,
                          count: 1,
                          my_ticket: true,
                        },
                      ]);
                      newTicketIds = [...tickets, ticketInfo[ticketType].id];
                    }

                    if (
                      discount.discount_value > 0 &&
                      discount.ticket.includes(ticketInfo[ticketType].id)
                    ) {
                      const amount = newTicketIds.reduce((acc, ticket) => {
                        const ticketId = typeof ticket === 'string' ? ticket : ticket.ticket_id;
                        return (
                          acc +
                          discountedTicketPrice(
                            Object.values(ticketInfo).filter(
                              (ticktype) => ticktype.id === ticketId,
                            )[0].price,
                            discount,
                            ticketId,
                          )
                        );
                      }, 0);
                      setAmount(amount.toString());
                    } else {
                      const amount = newTicketIds.reduce((acc, id) => {
                        return (
                          acc +
                          Number(
                            Object.values(ticketInfo).filter((ticktype) => ticktype.id === id)[0]
                              .price,
                          )
                        );
                      }, 0);
                      setAmount(amount.toString());
                    }
                  } else {
                    const ticketAlreadyThere =
                      tickets.filter((ticket) => ticket.ticket_id === ticketInfo[ticketType].id)
                        .length > 0;

                    if (ticketAlreadyThere) {
                      setTickets(
                        tickets.map((ticket) => ({
                          ...ticket,
                          my_ticket: ticket.ticket_id === ticketInfo[ticketType].id ? true : false,
                        })),
                      );
                    } else {
                      const updatedTickets = tickets.map((ticket) => ({
                        ...ticket,
                        my_ticket: false,
                      }));

                      updatedTickets.push({
                        ticket_id: ticketInfo[ticketType].id,
                        count: 1,
                        my_ticket: true,
                      });

                      setTickets(updatedTickets);
                    }

                    if (
                      discount.discount_value > 0 &&
                      discount.ticket.includes(ticketInfo[ticketType].id)
                    )
                      setAmount(
                        discountedTicketPrice(
                          Number(
                            ticketInfo[ticketType].entry_date.find(
                              (entry) => entry.date === selectedDate,
                            )?.price || ticketInfo[ticketType].price,
                          ),
                          discount,
                          ticketInfo[ticketType].id,
                        ).toString(),
                      );
                    else {
                      setAmount(
                        (
                          ticketInfo[ticketType].entry_date.find(
                            (entry) => entry.date === selectedDate,
                          )?.price || ticketInfo[ticketType].price
                        ).toString(),
                      );
                    }
                  }
                }}
                className={styles.ticketType}
                style={{
                  border: tickets.find(
                    (ticket) => ticket.my_ticket && ticket.ticket_id === ticketInfo[ticketType].id,
                  )
                    ? '2px solid #FFFFFF'
                    : '2px solid #2A3533',
                }}
              >
                {tickets && (
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
                            updateTicketCount(ticketInfo[ticketType].id, false);
                          }}
                        >
                          -
                        </button>
                        <p className={styles.ticketCount}>
                          {tickets.find((ticket) => ticket.ticket_id === ticketInfo[ticketType].id)
                            ?.count ?? 0}
                        </p>
                        <button
                          className={styles.ticketCountUpdateButton}
                          onClick={() => {
                            const currentTicketCount = tickets.find(
                              (ticket) => ticket.ticket_id === ticketInfo[ticketType].id,
                            )?.count;

                            const ticketLimit = ticketInfo[ticketType].entry_date?.find(
                              (entryDate) => entryDate.date === selectedDate,
                            )?.capacity;

                            if (currentTicketCount === ticketLimit) {
                              toast.error('Ticket limit reached');
                              return;
                            }
                            updateTicketCount(ticketInfo[ticketType].id, true);
                          }}
                        >
                          +
                        </button>
                      </div>
                      {ticketInfo[ticketType].entry_date?.map((entryDate) => {
                        return (
                          entryDate.date === selectedDate &&
                          entryDate.capacity <= 10 && (
                            <div key={entryDate.date} className={styles.dateContainer}>
                              <p className={styles.capacity}>{entryDate.capacity} tickets left</p>
                            </div>
                          )
                        );
                      })}
                    </div>
                  </>
                )}

                <div className={styles.passText}>
                  <p className={styles.ticketTypeTitle}>{ticketType?.toUpperCase()}</p>
                  <p className={styles.ticketTypeDescription}>
                    {ticketInfo[ticketType].description}
                  </p>
                  <div className={styles.perks}>
                    {Object.keys(ticketInfo[ticketType].perks)?.map((perk) => (
                      <div key={perk} className={styles.perk}>
                        {perk}: {ticketInfo[ticketType].perks[perk]}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.ticketPriceData}>
                  {discount.discount_value > 0 &&
                    (ticketInfo[ticketType].entry_date.find((entry) => entry.date === selectedDate)
                      ?.price || ticketInfo[ticketType].price) > 0 &&
                    discount.ticket.includes(ticketInfo[ticketType].id) && (
                      <div className={styles.discountData}>
                        <p className={styles.discountAmount}>
                          {discount.discount_type.toLowerCase() === 'percentage'
                            ? `${discount.discount_value}% off`
                            : `${ticketInfo[ticketType].currency} ${discount.discount_value} off`}
                        </p>
                        <p className={styles.originalPrice}>
                          <del>
                            M.R.P. {ticketInfo[ticketType].currency}{' '}
                            {ticketInfo[ticketType].entry_date.find(
                              (entry) => entry.date === selectedDate,
                            )?.price || ticketInfo[ticketType].price}
                          </del>
                        </p>
                      </div>
                    )}

                  <div className={styles.priceData}>
                    <p className={styles.ticketPrice}>
                      {discountedTicketPrice(
                        Number(
                          ticketInfo[ticketType].entry_date.find(
                            (entry) => entry.date === selectedDate,
                          )?.price || ticketInfo[ticketType].price,
                        ),
                        discount,
                        ticketInfo[ticketType].id,
                      ) === 0
                        ? 'FREE'
                        : `${ticketInfo[ticketType].currency} ${discountedTicketPrice(
                            Number(
                              ticketInfo[ticketType].entry_date.find(
                                (entry) => entry.date === selectedDate,
                              )?.price || ticketInfo[ticketType].price,
                            ),
                            discount,
                            ticketInfo[ticketType].id,
                          )}`}
                    </p>
                    <p className={styles.extraCharges}>
                      {ticketInfo[ticketType].platform_fee_from_user &&
                        Number(
                          ticketInfo[ticketType].entry_date.find(
                            (entry) => entry.date === selectedDate,
                          )?.price || ticketInfo[ticketType].price,
                        ) > 0 &&
                        discountedTicketPrice(
                          Number(
                            ticketInfo[ticketType].entry_date.find(
                              (entry) => entry.date === selectedDate,
                            )?.price || ticketInfo[ticketType].price,
                          ),
                          discount,
                          ticketInfo[ticketType].id,
                        ) !== 0 && (
                          <p className={styles.extraCharges}>
                            {ticketInfo[ticketType].platform_fee}% extra charges
                          </p>
                        )}
                    </p>
                  </div>
                  {
                    /*Check for Show price if discount value is 0 and show it if available*/
                    !discount.discount_value &&
                      (ticketInfo[ticketType].entry_date.find((entry) => entry.date == selectedDate)
                        ?.show_price ||
                        ticketInfo[ticketType].show_price) && (
                        <div className={styles.discountData}>
                          <p className={styles.marketingOriginalPrice}>
                            <del>
                              M.R.P. {ticketInfo[ticketType].currency}{' '}
                              {ticketInfo[ticketType].entry_date.find(
                                (entry) => entry.date == selectedDate,
                              )?.show_price || ticketInfo[ticketType].show_price}{' '}
                              {/*Show price if available*/}
                            </del>
                          </p>
                        </div>
                      )
                  }
                </div>

                <p className={styles.cardText}>{eventData?.title?.toUpperCase()}</p>
              </div>
            )
          );
        })}
      </motion.div>
    </>
  );
};

export default CouponForm;
