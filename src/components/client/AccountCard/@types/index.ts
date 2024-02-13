import { TJSON } from '@interfaces';
import { LoanStore } from '@src/stores/LoanStore';
import { UserStore } from '@src/stores/UserStore';

export type TAccountCard = {
  userStore: UserStore;
  loanStore: LoanStore;
  staticData: TJSON;
};
