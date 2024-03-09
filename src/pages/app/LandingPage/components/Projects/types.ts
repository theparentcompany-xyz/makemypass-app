export interface PubllicEvent {
  id: string;
  name: string;
  title: string;
  banner: string;
  description: string;
  start_date: string;
  end_date: string;
  logo: string;
  location: {
    lat: number;
    lng: number;
  };
  place: string;
  is_private: boolean;
  shortlist: boolean;
}
