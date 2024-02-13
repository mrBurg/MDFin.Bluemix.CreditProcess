import { URIS_SUFFIX } from '@src/constants';
import { LoanStore } from '@src/stores/LoanStore';
import { OtpStore } from '@src/stores/OtpStore';
import { UserStore } from '@src/stores/UserStore';

export type TOtpProps = {
  className?: string;
  action: () => void;
  page?: URIS_SUFFIX; //для подписания заявки, этот параметр не нужен
};

export type TFieldData = Record<'name' | 'value', string>;

export type TOtpPropsStore = {
  loanStore: LoanStore;
  userStore: UserStore;
  otpStore: OtpStore;
} & TOtpProps;

export type TState = {
  invalidFields: any[];
};
