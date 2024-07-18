type venueVisited = {
  name: string;
  visited_at: string;
};

export type VisitedVenues = {
  status: boolean;
  venues: venueVisited[];
};
