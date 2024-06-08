import { EventType, FormDataType, TicketType } from '../apis/types';
import { validateCondition } from '../components/DynamicForm/condition';
import { DiscountData } from '../pages/app/EventPage/types';

export const filterTickets = ({
  eventData,
  selectedDate,
  setFilteredTickets,
  formData,
  discount,
}: {
  eventData: EventType | undefined;
  selectedDate: string | undefined | null;
  setFilteredTickets: React.Dispatch<React.SetStateAction<TicketType[]>>;
  formData: FormDataType;
  discount?: DiscountData | undefined;
}) => {
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
