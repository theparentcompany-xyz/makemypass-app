import toast from 'react-hot-toast';
import { publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { DiscountData, TicketOptions } from '../pages/app/EventPage/types';
import { Dispatch } from 'react';
import { FormData, FormField } from './types';

export const getTickets = async (
  eventId: string,
  setTicketInfo: React.Dispatch<React.SetStateAction<TicketOptions | undefined>>,
) => {
  publicGateway
    .get(makeMyPass.getTicketInfo(eventId))
    .then((response) => {
      setTicketInfo(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Tickets');
    });
};

export const getFormFields = async (
  eventId: string,
  setFormFields: Dispatch<React.SetStateAction<FormField[]>>,
) => {
  publicGateway
    .get(makeMyPass.getFormFields(eventId))
    .then((response) => {
      setFormFields(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Form Fields');
    });
};

export const submitForm = async (ticketId: string, data: FormData, response?: any) => {
  publicGateway
    .post(makeMyPass.submitForm(ticketId), {
      rsvp_data: data,
      payment_data: response,
    })
    .then(() => {
      toast.success('Event Registered Successfully');
    })
    .catch(() => {
      toast.error('Error in Registering Event');
    });
};

export const applyCoupon = async (
  eventId: string,
  couponCode: string,
  setDiscount: React.Dispatch<DiscountData>,
) => {
  publicGateway
    .post(makeMyPass.validateCoupon(eventId), {
      coupon_code: couponCode,
    })
    .then((response) => {
      setDiscount(response.data.response);
    })
    .catch((error) => {
      console.log(error);
    });
};
