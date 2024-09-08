type venueVisited = {
  name: string;
  visited_at: string;
};

export type VisitedVenues = {
  status: boolean;
  venues: venueVisited[];
};

export type EmailType = {
  id: string;
  event_id: string;
  send_to: string;
  send_from: string;
  subject: string;
  body: string;
  type: string;
  created_at: string;
  created_by: string;
  show_content: boolean;
};
