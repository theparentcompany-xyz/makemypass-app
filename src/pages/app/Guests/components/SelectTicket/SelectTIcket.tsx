import toast from 'react-hot-toast';
import { TicketType } from '../../../../../apis/types';
import { Tickets } from '../../../EventPage/types';
import styles from './SelectTicket.module.css';

const SelectTIcket = ({
  ticketInfo,
  selectedDate,
  tickets,
  setTickets,
}: {
  ticketInfo: TicketType[];
  selectedDate: string;
  tickets: Tickets[];
  setTickets: React.Dispatch<React.SetStateAction<Tickets[]>> | undefined;
}) => {
  console.log(ticketInfo);

  return (
    <div
      style={{
        marginBottom: '1rem',
      }}
    >
      {ticketInfo.length > 0 && <p className={styles.formLabel}>Ticket Type</p>}

      <div className={styles.tickets}>
        {ticketInfo.map((ticket: TicketType) => {
          return (
            (ticket.entry_date.length === 0 ||
              (ticket.entry_date.find((entry) => entry.date === selectedDate)?.capacity ?? 0) >
                0) && (
              <div className={styles.ticket}>
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
                    if (event.target.value != '' && Number(event.target.value) < 0) {
                      toast.error('Ticket count cannot be negative');
                      event.target.value = '0';
                      return;
                    }

                    if (
                      ticket.entry_date.length !== 0 &&
                      event.target.value != '' &&
                      Number(event.target.value) >
                        (ticket.entry_date.find((entry) => entry.date === selectedDate)?.capacity ??
                          0)
                    ) {
                      toast.error('Ticket Limit Exceeded');
                      event.target.value = '0';
                      return;
                    }

                    const tempTickets = tickets?.map((myticket) => {
                      if (myticket.ticket_id === ticket.id) {
                        ticket.count = event.target.value ? Number(event.target.value) : 0;
                      }
                      return ticket;
                    });

                    if (tempTickets)
                      setTickets &&
                        setTickets((myPrevTickets) =>
                          myPrevTickets.map((myprevticket) => {
                            if (myprevticket.ticket_id === ticket.id) {
                              myprevticket.my_ticket = true;
                              myprevticket.count = event.target.value
                                ? Number(event.target.value)
                                : 0;
                            }

                            return myprevticket;
                          }),
                        );
                    else {
                      event.target.value = '0';
                    }
                  }}
                />

                {ticket.entry_date.length > 0 && (
                  <p className={styles.ticketCount}>
                    {ticket.entry_date.find((entry) => entry.date === selectedDate)?.capacity}{' '}
                    tickets left
                  </p>
                )}
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default SelectTIcket;
