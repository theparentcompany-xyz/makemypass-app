import { FormDataType, TicketType } from '../apis/types';
import { validateCondition } from '../components/DynamicForm/condition';
import type { DiscountData } from '../pages/app/EventPage/types';
import { FormEventData } from '../pages/app/Guests/types';

enum DiscountType {
  Amount = 'amount',
  Percentage = 'percentage',
}

export const filterTickets = ({
  eventFormData,
  selectedDate,
  setFilteredTickets,
  formData,
  discount,
}: {
  eventFormData: FormEventData;
  selectedDate: string | undefined | null;
  setFilteredTickets: React.Dispatch<React.SetStateAction<TicketType[]>>;
  formData: FormDataType;
  discount?: DiscountData | undefined;
}) => {
  const tempList: TicketType[] = [];
  eventFormData?.tickets.forEach((ticket: TicketType) => {
    if (ticket.conditions) {
      if (validateCondition(ticket.conditions, formData, eventFormData.form)) {
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
    if (
      discount?.discount_type === DiscountType.Percentage &&
      discount.ticket.some((t) => t.id === ticket.id)
    ) {
      const updatedTicket = {
        ...ticket,
        price: ticket.price - (ticket.price * Number(discount.discount_value)) / 100,
        show_price: ticket.price,
      };
      setFilteredTickets((prevTickets) => {
        return [...prevTickets, updatedTicket];
      });
    } else if (
      discount?.discount_type === DiscountType.Amount &&
      discount.ticket.some((t) => t.id === ticket.id)
    ) {
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
