import { FormFieldType, TicketType } from '../../../apis/types';
import type { CouponData } from '../EventPage/types';

export type GuestsType = {
  id: string;
  registered_at: string;
  name: string;
  email: string;
  phonenumber: string;
  district: string;
  category: string;
  organization: string;
  is_checked_in: boolean;
};

export type ResentTicket = {
  status: boolean;
  name: string | string[];
  guestId: string | string[];
};

export type SelectedGuest = {
  id: string;
  type: string;
};

export interface FormEventData {
  is_grouped_ticket: boolean;
  id: string;
  form: FormFieldType[];
  tickets: TicketType[];
  select_multi_ticket: boolean;
  is_sub_event: boolean;
  parse_audio: boolean;
  coupon: CouponData;
  claim_ticket_id?: string;
  show_ticket_first?: boolean;
}

export type PaginationDataType = {
  page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
  next: number | null;
  previous: number | null;
  fetchingData: boolean;
  searchKeyword: string;
};
