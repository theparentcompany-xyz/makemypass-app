import { Dispatch, SetStateAction } from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import CouponType, { CreateCouponType } from '../pages/app/Coupon/types';

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

export const createCoupon = async (eventId: string, data: CreateCouponType) => {
  const backendFormData = new FormData();

  Object.keys(data).forEach((key) => {
    let value = data[key];

    if (!(value instanceof FileList)) {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((value) => backendFormData.append(key + '[]', value));
      } else {
        value = data[key].toString();
      }
    }

    if (typeof value === 'string' && value.length > 0) {
      backendFormData.append(key, value);
    } else if (value instanceof FileList) {
      Array.from(value).forEach((value) => backendFormData.append(key + '[]', value));
    }
  });

  console.log(backendFormData);

  return privateGateway
    .post(makeMyPass.createCoupon(eventId), backendFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
};
