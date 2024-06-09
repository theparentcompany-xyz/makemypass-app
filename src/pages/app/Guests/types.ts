import { FormFieldType, TicketType } from '../../../apis/types';
import { CouponData } from '../EventPage/types';

export type GuestsType = {
  id: string;
  registered_at: string;
  name: string;
  email: string;
  phone_number: string;
  district: string;
  category: string;
  organization: string;
};

export type ResentTicket = {
  status: boolean;
  name: string | string[];
  guestId: string | string[];
};

export type SelectedGuest = {
  id: string | string[];
  type: string | string[];
};

export interface FormEventData {
  id: string;
  form: FormFieldType[];
  tickets: TicketType[];
  select_multi_ticket: boolean;
  is_sub_event: boolean;
  parse_audio: boolean;
  coupon: CouponData;
}
