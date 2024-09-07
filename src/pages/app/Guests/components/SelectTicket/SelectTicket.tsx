import toast from 'react-hot-toast';

import { TicketType } from '../../../../../apis/types';
import { Tickets } from '../../../EventPage/types';
import styles from './SelectTicket.module.css';

const SelectTicket = ({
  filteredTickets,
  selectedDate,
  tickets,
  setTickets,
}: {
  filteredTickets: TicketType[];
  selectedDate: string;
  tickets: Tickets[];
  setTickets: React.Dispatch<React.SetStateAction<Tickets[]>> | undefined;
}) => {
  const handleTicketUpdation = (ticket: TicketType, ticketCount: number) => {
    const selectedTicketCapacity = filteredTickets
      .find((filteredTicket) => (filteredTicket.id = ticket.id))
      ?.entry_date.find((date) => date.date === selectedDate)?.capacity;

    // if the event has no entry date selectedTicketCapacity would be null.
    if (selectedTicketCapacity && ticketCount <= selectedTicketCapacity && setTickets) {
      if (tickets.length === 0) {
        setTickets([
          {
            ticket_id: ticket.id,
            count: ticketCount,
            my_ticket: true,
          },
        ]);
      }
    } else {
      toast.error('Ticket capacity exceeded.');
    }
  };

  const ticketSelected = (ticket: TicketType) => {
    return tickets.some((myticket) => myticket.ticket_id === ticket.id && myticket.my_ticket);
  };
  return (
    <div
      style={{
        marginBottom: '1rem',
      }}
    >
      {filteredTickets.length > 0 && <p className={styles.formLabel}>Ticket Type</p>}

      <div className={styles.tickets}>
        {filteredTickets.map((ticket: TicketType) => {
          return (
            <div
              className={styles.ticket}
              style={ticketSelected(ticket) ? { border: '1px solid #FFFFFF' } : undefined}
            >
              <p key={ticket.id} className={styles.ticketDetails}>
                {ticket.title} - {ticket?.currency}{' '}
                {ticket.entry_date.find((entry) => entry.date === selectedDate)?.price ??
                  ticket.price}
              </p>

              <input
                placeholder='Enter Ticket Count'
                type='number'
                className={styles.ticketCountInput}
                onChange={(event) => {
                  if (Number(event.target.value) > 0) {
                    handleTicketUpdation(ticket, Number(event.target.value));
                  }
                }}
              />

              {ticket.entry_date.length > 0 && (
                <p className={styles.ticketCount}>
                  {ticket.entry_date.find((entry) => entry.date === selectedDate)?.capacity} tickets
                  left
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectTicket;
