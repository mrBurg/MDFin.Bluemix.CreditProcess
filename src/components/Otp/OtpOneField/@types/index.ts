import { URIS_SUFFIX } from '@src/constants';
import { LoanStore } from '@src/stores/LoanStore';
import { OtpStore } from '@src/stores/OtpStore';
import { UserStore } from '@src/stores/UserStore';

export type TOtpOneFieldProps = {
  action: () => void;
  className?: string;
  page?: URIS_SUFFIX; //для подписания заявки, этот параметр не нужен
};

export type TOtpOneFieldPropsStore = {
  loanStore: LoanStore;
  userStore: UserStore;
  otpStore: OtpStore;
} & TOtpOneFieldProps;
