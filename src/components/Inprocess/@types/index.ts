import { LoanStore } from '@src/stores/LoanStore';
import { UserStore } from '@src/stores/UserStore';

export type TInprocessProps = {
  userStore: UserStore;
  loanStore: LoanStore;
  className?: string;
};
