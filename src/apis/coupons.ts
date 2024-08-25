import { Dispatch, SetStateAction } from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import CouponType, { CreateCouponType, CreateCouponTypeError } from '../pages/app/Coupon/types';
import toast from 'react-hot-toast';
import { ActivateCouponType } from './types';

export const getCouponsList = async (
  eventId: string,
  setCoupons: Dispatch<SetStateAction<CouponType[]>>,
  setActivateCoupon?: React.Dispatch<React.SetStateAction<ActivateCouponType>>,
) => {
  privateGateway.get(makeMyPass.couponsList(eventId)).then((response) => {
    setCoupons(response.data.response.coupons);
    if (setActivateCoupon)
      setActivateCoupon({
        showModal: false,
        active: response.data.response.is_coupon_active,
        description: response.data.response.description,
        isCouponActive: response.data.response.is_coupon_active,
      });
  });
};

export const createCoupon = (
  eventId: string,
  data: CreateCouponType,
  setCoupons: Dispatch<SetStateAction<CouponType[]>>,
  setCouponError: Dispatch<SetStateAction<CreateCouponTypeError>>,
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const backendFormData = new FormData();
    Object.keys(data).forEach((key) => {
      let value = data[key];

      if (!(value instanceof FileList)) {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((value) =>
            backendFormData.append(
              key + '[]',
              typeof value === 'object' ? JSON.stringify(value) : value,
            ),
          );
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

    privateGateway
      .post(makeMyPass.couponCreate(eventId), backendFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        getCouponsList(eventId, setCoupons);
        resolve();
      })
      .catch((error) => {
        if (error.response.data.message) {
          setCouponError(error.response.data.message);
        }
        reject(error);
      });
  });
};

export const getCouponData = async (eventId: string, couponId: string) => {
  return privateGateway.get(makeMyPass.coupon(eventId, couponId)).then((response) => {
    return response.data.response;
  });
};

export const updateCouponData = async (
  eventId: string,
  data: CreateCouponType,
  setCoupons: Dispatch<SetStateAction<CouponType[]>>,
) => {
  const backendFormData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (!(value instanceof FileList)) {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((value) =>
          backendFormData.append(
            key + '[]',
            typeof value === 'object' ? JSON.stringify(value) : value,
          ),
        );
      }
    }

    if (
      (typeof value === 'string' && value.length > 0) ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      backendFormData.append(key, value.toString());
    } else if (value instanceof FileList) {
      Array.from(value).forEach((value) => backendFormData.append(key + '[]', value));
    }
  });

  return privateGateway
    .patch(makeMyPass.coupon(eventId, data.id), backendFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => {
      getCouponsList(eventId, setCoupons);
    });
};

export const updateFormCouponStatus = async (
  eventId: string,
  activateCoupon: ActivateCouponType,
  setActivateCoupon: Dispatch<SetStateAction<ActivateCouponType>>,
) => {
  return privateGateway
    .put(makeMyPass.couponStatusUpdate(eventId), {
      show_coupon_field: activateCoupon.active,
      description: activateCoupon.description,
    })
    .then(() => {
      toast.success('Coupon status updated successfully');
      setActivateCoupon({
        ...activateCoupon,
        showModal: false,
        isCouponActive: activateCoupon.active,
      });
    })
    .catch(() => {
      toast.error('Failed to update coupon status');
    });
};

export const deleteCoupon = async (
  eventId: string,
  couponId: string,
  setCoupons: Dispatch<SetStateAction<CouponType[]>>,
) => {
  return privateGateway
    .delete(makeMyPass.coupon(eventId, couponId))
    .then(() => {
      getCouponsList(eventId, setCoupons);
      toast.success('Coupon deleted successfully');
    })
    .catch(() => {
      toast.error('Failed to delete coupon');
    });
};

export const getTicketShortlist = async (
  eventId: string,
  setTickets: Dispatch<
    SetStateAction<
      {
        id: string;
        title: string;
        price: number;
      }[]
    >
  >,
) => {
  return privateGateway.get(makeMyPass.ticketShortList(eventId)).then((response) => {
    setTickets(response.data.response.tickets);
  });
};
