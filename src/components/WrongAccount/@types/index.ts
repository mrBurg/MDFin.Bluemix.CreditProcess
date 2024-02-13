import { TJSON } from '@interfaces';
import { LoanStore } from '@src/stores/LoanStore';
import { UserStore } from '@src/stores/UserStore';

export type TWrongAccountProps = {
  staticData: TJSON;
  userStore: UserStore;
  loanStore: LoanStore;
  className?: string;
};
