import { LoanStore } from '@src/stores/LoanStore';
import { UserStore } from '@src/stores/UserStore';

export type TRejectNotify = unknown;

export type TRejectNotifyStores = {
  loanStore: LoanStore;
  userStore: UserStore;
} & TRejectNotify;
