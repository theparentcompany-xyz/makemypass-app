interface Perk {
  id: string;
  name: string;
  count: number;
}

export interface TicketPerkType {
  ticket_id: string;
  ticket_name: string;
  perks: Perk[];
}
