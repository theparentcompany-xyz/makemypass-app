import toast from 'react-hot-toast';
import { publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { TicketOptions } from '../pages/app/EventPage/types';

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
      console.log(error);
    });
};

export const getFormFields = async (eventId: string, setFormFields: React.Dispatch<any>) => {
  publicGateway
    .get(makeMyPass.getFormFields(eventId))
    .then((response) => {
      console.log(response.data);
      setFormFields(response.data.response);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const submitForm = async (ticketId: string, data: any, response?: any) => {
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
  setDiscount: React.Dispatch<any>,
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
