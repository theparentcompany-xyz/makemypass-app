import { Dispatch, SetStateAction } from 'react';

import { publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';

type VerifiedType = {
  isVerified: boolean;
  error: boolean;
  errorMsg?: string;
};

export const verifyParticipant = (
  verificationCode: string,
  setVerified: Dispatch<SetStateAction<VerifiedType>>,
) => {
  return publicGateway
    .post(makeMyPass.formVerfifyParticipant(verificationCode), {
      verification_code: verificationCode,
    })
    .then(() => {
      setVerified({ isVerified: true, error: false });
    })
    .catch((error) => {
      setVerified({
        isVerified: false,
        error: true,
        errorMsg: error.response.data.message.general[0],
      });
    });
};
