import { LoanStore } from '@src/stores/LoanStore';
import { UserStore } from '@src/stores/UserStore';
import { PageStore } from '@src/stores/PageStore';

export type TCreditLine = {
  loanStore: LoanStore;
  userStore: UserStore;
  pageStore: PageStore;
};
