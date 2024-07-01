import { Dispatch, SetStateAction } from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import CouponType from '../pages/app/Coupon/types';

export const listCoupons = async (
  eventId: string,
  setCoupons: Dispatch<SetStateAction<CouponType[]>>,
) => {
  privateGateway
    .get(makeMyPass.listCoupons(eventId))
    .then((response) => {
      console.log(response.data.response.coupons);
      setCoupons(response.data.response.coupons);
    })
    .catch((error) => {
      console.log(error);
    });
};
