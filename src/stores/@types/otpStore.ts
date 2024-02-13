import { TLinks } from '@components/hocs/WithLink/@types';

export type TOtpProps = {
  action?: string;
  otpId?: number; //тут бы этот параметр обязательным сделать...
  phoneNumber?: string;
};

export type TAuthRes = {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

export type TOtpFormStatic = {
  wrongOtp: string;
  sendOtp: string;
  termsAndConditions: string;
  links: TLinks;
};

export type TOtpOneFieldFormStatic = {
  wrongOtp: string;
  sendOtp: string;
  codeLabel: string;
};
