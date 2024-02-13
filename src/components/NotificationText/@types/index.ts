import { LoanStore } from '@src/stores/LoanStore';
import { UserStore } from '@src/stores/UserStore';

export type TNotificationText = {
  className?: string;
};

export type TNotificationTextStore = {
  userStore: UserStore;
  loanStore: LoanStore;
};
