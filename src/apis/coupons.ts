import { Dispatch, SetStateAction } from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import CouponType, { CreateCouponType, CreateCouponTypeError } from '../pages/app/Coupon/types';
import toast from 'react-hot-toast';
import { ActivateCouponType } from './types';

export const listCoupons = async (
  eventId: string,
  setCoupons: Dispatch<SetStateAction<CouponType[]>>,
  setActivateCoupon?: React.Dispatch<React.SetStateAction<ActivateCouponType>>,
) => {
  privateGateway.get(makeMyPass.listCoupons(eventId)).then((response) => {
    setCoupons(response.data.response.coupons);
    console.log('Coupons', response.data.response.coupons);

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
      .post(makeMyPass.createCoupon(eventId), backendFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        listCoupons(eventId, setCoupons);
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

export const editCoupon = async (
  eventId: string,
  data: CreateCouponType,
  setCoupons: Dispatch<SetStateAction<CouponType[]>>,
) => {
  const backendFormData = new FormData();
  console.log(data);

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
    .patch(makeMyPass.editCoupon(eventId, data.id), backendFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => {
      listCoupons(eventId, setCoupons);
    });
};

export const updateCouponStatus = async (
  eventId: string,
  activateCoupon: ActivateCouponType,
  setActivateCoupon: Dispatch<SetStateAction<ActivateCouponType>>,
) => {
  return privateGateway
    .put(makeMyPass.updateCouponStatus(eventId), {
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
    .delete(makeMyPass.deleteCoupon(eventId, couponId))
    .then(() => {
      listCoupons(eventId, setCoupons);
      toast.success('Coupon deleted successfully');
    })
    .catch(() => {
      toast.error('Failed to delete coupon');
    });
};
