export type SubEventGuestType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string | null;
  registered_at: string;
  ticket_code: string | null;
  is_approved: boolean;
  is_team_lead: boolean;
  team_id: string | null;
  is_checked_in: boolean;
};
